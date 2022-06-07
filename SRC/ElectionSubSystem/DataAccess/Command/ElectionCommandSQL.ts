import {
  Circuit,
  Election,
  Party,
  Voter,
  Candidate,
} from "../../../Common/Domain";

import {
  CandidateSQL,
  ElectionSQL,
  ElectionCircuitSQL,
  ElectionCircuitVoterSQL,
  PartySQL,
  VoterSQL,
  CircuitSQL,
  ElectionCandidateSQL,
} from "../../../Common/Models";

export class ElectionCommandSQL {
  addElections(elections: Election[]): void {
    elections.map((election: Election) => {
      this.addElection(election);
    });
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

  private addParties(parties: Party[]): void {
    parties.map((p: Party) => {
      PartySQL.create(p, { ignoreDuplicates: true });
    });
  }

  private addCircuits(election: Election): void {
    election.circuits.map((c: Circuit) => {
      CircuitSQL.create(c, { ignoreDuplicates: true });
      ElectionCircuitSQL.create({
        electionCircuitId: `${election.id}_${c.id}`,
        electionId: election.id,
        circuitId: c.id,
      });
    });
  }

  public async addVoters(
    voters: Voter[],
    idElection: number
  ): Promise<boolean> {
    let voterPromises: Promise<void>[] = [];
    for (let i: number = 0; i < voters.length; i++) {
      let currentVoter: Voter = voters[i];
      voterPromises.push(
        VoterSQL.create(currentVoter, { ignoreDuplicates: true })
      );
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

    return voters.length > 0;
  }
}
