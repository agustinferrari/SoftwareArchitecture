import {
  CircuitDTO,
  ElectionDTO,
  PartyDTO,
  VoterDTO,
  CandidateDTO,
} from "../../../Common/Domain";

import {
  Candidate,
  Election,
  ElectionCircuit,
  ElectionCircuitVoter,
  Party,
  Voter,
  Circuit,
  ElectionCandidate,
} from "../../../Common/Models";

export class ElectionCommandSQL {
  addElections(elections: ElectionDTO[]): void {
    elections.map((election: ElectionDTO) => {
      this.addElection(election);
    });
  }

  public async addElection(election: ElectionDTO): Promise<void> {
    let circuitPromises: Promise<void>[] = [];
    election.circuits.map(async (c: CircuitDTO) => {
      circuitPromises.push(Circuit.create(c, { ignoreDuplicates: true }));
    });

    let partyPromises: Promise<void>[] = [];
    election.parties.map((p: PartyDTO) => {
      partyPromises.push(Party.create(p, { ignoreDuplicates: true }));
    });

    let candidatePromises: Promise<void>[] = [];

    await Promise.all(partyPromises).then(async () => {
      await Election.create(election);
      election.candidates.map((c: CandidateDTO) => {
        candidatePromises.push(Candidate.create(c, { ignoreDuplicates: true }));
      });
    });

    let resolvePromises: Promise<any>[] = [];
    await Promise.all(candidatePromises).then(() => {
      election.candidates.map((c: CandidateDTO) => {
        resolvePromises.push(
          ElectionCandidate.create({
            candidateCI: c.ci,
            electionId: election.id,
          })
        );
      });
    });

    await Promise.all(circuitPromises).then(() => {
      election.circuits.map(async (c: CircuitDTO) => {
        resolvePromises.push(
          ElectionCircuit.create({
            electionCircuitId: `${election.id}_${c.id}`,
            electionId: election.id,
            circuitId: c.id,
          })
        );
      });
    });

    await Promise.all(resolvePromises);
    console.log("termino SQL");
  }

  private addParties(parties: PartyDTO[]): void {
    parties.map((p: PartyDTO) => {
      Party.create(p, { ignoreDuplicates: true });
    });
  }

  private addCircuits(election: ElectionDTO): void {
    election.circuits.map((c: CircuitDTO) => {
      Circuit.create(c, { ignoreDuplicates: true });
      ElectionCircuit.create({
        electionCircuitId: `${election.id}_${c.id}`,
        electionId: election.id,
        circuitId: c.id,
      });
    });
  }

  public async addVoters(
    voters: VoterDTO[],
    idElection: number
  ): Promise<void> {
    let voterPromises: Promise<void>[] = [];
    for (let i: number = 0; i < voters.length; i++) {
      let currentVoter: VoterDTO = voters[i];
      voterPromises.push(
        Voter.create(currentVoter, { ignoreDuplicates: true })
      );
    }

    await Promise.all(voterPromises).then(() => {
      for (let i: number = 0; i < voters.length; i++) {
        let currentVoter: VoterDTO = voters[i];
        console.log(
          `${idElection}_${currentVoter.circuitId} ___` + currentVoter.ci
        );
        ElectionCircuitVoter.create({
          electionCircuitId: `${idElection}_${currentVoter.circuitId}`,
          voterCI: currentVoter.ci,
        });
      }
    });
  }
}
