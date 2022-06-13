import { Console } from "console";
import { Circuit, Election, Party, Voter, Candidate, Vote } from "../Common/Domain";

import { CandidateSQL, ElectionSQL, ElectionCircuitSQL, ElectionCircuitVoterSQL, PartySQL, VoterSQL, CircuitSQL, ElectionCandidateSQL, VoteSQL, ElectionCandidateVoterSQL } from "./Models";

export class CommandSQL {
  public async addElection(election: Election): Promise<void> {
    let circuitPromises: Promise<void>[] = [];
    election.circuits.map(async (c: Circuit) => {
      circuitPromises.push(CircuitSQL.create(c, { ignoreDuplicates: true }));
    });

    let partyPromises: Promise<void>[] = [];
    election.parties.map((p: Party) => {
      partyPromises.push(PartySQL.create(p, { ignoreDuplicates: true }));
    });

    let candidatePromises: Promise<void>[] = [];

    await Promise.all(partyPromises).then(async () => {
      await ElectionSQL.create(election);
      election.candidates.map((c: Candidate) => {
        candidatePromises.push(CandidateSQL.create(c, { ignoreDuplicates: true }));
      });
    });

    let resolvePromises: Promise<any>[] = [];
    await Promise.all(candidatePromises).then(() => {
      election.candidates.map((c: Candidate) => {
        resolvePromises.push(
          ElectionCandidateSQL.create({
            candidateCI: c.ci,
            electionId: election.id,
          })
        );
      });
    });

    await Promise.all(circuitPromises).then(() => {
      election.circuits.map(async (c: Circuit) => {
        resolvePromises.push(
          ElectionCircuitSQL.create({
            electionCircuitId: `${election.id}_${c.id}`,
            electionId: election.id,
            circuitId: c.id,
          })
        );
      });
    });

    await Promise.all(resolvePromises);
  }

  public async addVoters(voters: Voter[], idElection: number): Promise<number> {
    let voterPromises: Promise<void>[] = [];
    for (let i: number = 0; i < voters.length; i++) {
      let currentVoter: Voter = voters[i];
      voterPromises.push(VoterSQL.create(currentVoter, { ignoreDuplicates: true }));
    }

    await Promise.all(voterPromises).then(() => {
      for (let i: number = 0; i < voters.length; i++) {
        let currentVoter: Voter = voters[i];
        ElectionCircuitVoterSQL.create({
          electionCircuitId: `${idElection}_${currentVoter.circuitId}`,
          voterCI: currentVoter.ci,
        });
      }
    });

    return voters.length;
  }

  public async addVote(vote: Vote, mode: string): Promise<void> {
    await this.addVoteUnique(vote);
    if (mode === "repeated") {
      this.addVoteRepeated(vote);
    }
  }

  private async addVoteUnique(vote: Vote): Promise<void> {
    VoteSQL.create(vote);
    ElectionCandidateSQL.increment({ voteCount: 1 }, { where: { electionId: vote.electionId, candidateCI: vote.candidateCI } });
    return;
  }

  private async addVoteRepeated(vote: Vote): Promise<void> {
    let previousVote: ElectionCandidateVoterSQL | null = await ElectionCandidateVoterSQL.findOne({ where: { electionId: vote.electionId, voterCI: vote.voterCI } });
    if (previousVote != null) {
      ElectionCandidateSQL.decrement({ voteCount: 1 }, { where: { electionId: previousVote.electionId, candidateCI: previousVote.candidateCI } });
      ElectionCandidateVoterSQL.update({ candidateCI: vote.candidateCI }, { where: { id: previousVote.id } });
    } else {
      ElectionCandidateVoterSQL.create({
        electionId: vote.electionId,
        candidateCI: vote.candidateCI,
        voterCI: vote.voterCI,
      });
    }
  }
}
