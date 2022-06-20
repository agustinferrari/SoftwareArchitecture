import { Console } from "console";
import { Circuit, Election, Party, Voter, Candidate, Vote } from "../../../Common/Domain";
import { Sequelize } from "sequelize-typescript";
import {
  CandidateSQL,
  ElectionSQL,
  ElectionCircuitSQL,
  ElectionCircuitVoterSQL,
  PartySQL,
  VoterSQL,
  CircuitSQL,
  ElectionCandidateSQL,
  VoteSQL,
  ElectionCandidateVoterSQL,
} from "../../Models";
const { QueryTypes } = require("sequelize");

export class CommandSQL {
  sequelize: Sequelize;

  constructor(sequelize: Sequelize){
    this. sequelize = sequelize;
  }


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
          electionId: idElection,
          circuitId: currentVoter.circuitId,
          voterCI: currentVoter.ci,
        });
      }
    });

    return voters.length;
  }

  public async addVote(vote: Vote, mode: string): Promise<void> {
    await this.addVoteUnique(vote);
    if (mode === "repeated") {
      await this.addVoteRepeated(vote);
    }
    return;
  }

  private async addVoteUnique(vote: Vote): Promise<void> {
    VoteSQL.create(vote);
    ElectionCandidateSQL.increment(
      { voteCount: 1 },
      { where: { electionId: vote.electionId, candidateCI: vote.candidateCI } }
    );
    return;
  }

  private async addVoteRepeated(vote: Vote): Promise<void> {

    let parameters = { electionId: vote.electionId, voterCI: vote.voterCI };
    let previousVote: ElectionCandidateVoterSQL | null = await ElectionCandidateVoterSQL.findOne({
      where: parameters,
    });
    if (previousVote != null) {
      ElectionCandidateSQL.decrement(
        { voteCount: 1 },
        { where: { electionId: previousVote.electionId, candidateCI: previousVote.candidateCI } }
      );
      ElectionCandidateVoterSQL.update(
        { candidateCI: vote.candidateCI },
        { where: { electionId: previousVote.electionId,  candidateCI: previousVote.candidateCI, voterCI: previousVote.voterCI} }
      );
    } else {
      ElectionCandidateVoterSQL.create({
        electionId: vote.electionId,
        candidateCI: vote.candidateCI,
        voterCI: vote.voterCI,
      });
    }
  }

  public async deleteVoterCandidateAssociation(electionId: number){
    let command = `DELETE FROM appEvDB.ElectionCandidateVoterSQLs WHERE electionId = ${electionId};`;
    await this.sequelize.query(command, {
      type: QueryTypes.DELETE,
    });
  }
}
