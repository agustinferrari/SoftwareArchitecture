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
} from "../../../Common/Models";

export class ElectionCommandSQL {
  addElections(elections: ElectionDTO[]): void {
    elections.map((election: ElectionDTO) => {
      this.addElection(election);
    });
  }

  public async addElection(election: ElectionDTO): Promise<void> {
    new Promise<void>(async (resolve, rejects) => {
      try {
        let circuitPromises: Promise<void>[] = [];
        election.circuits.map(async (c: CircuitDTO) => {
          circuitPromises.push(Circuit.create(c, { ignoreDuplicates: true }));
        });

        let partyPromises: Promise<void>[] = [];
        election.parties.map((p: PartyDTO) => {
          partyPromises.push(Party.create(p, { ignoreDuplicates: true }));
        });

        await Promise.all(partyPromises).then(async () => {
          await Election.create(election, {
            include: [{ model: Candidate, ignoreDuplicates: true }],
          });
        });

        let electionCircuitPromises: Promise<ElectionCircuit>[] = [];
        Promise.all(circuitPromises).then(() => {
          election.circuits.map(async (c: CircuitDTO) => {
            electionCircuitPromises.push(
              ElectionCircuit.create({
                electionCircuitId: `${election.id}_${c.id}`,
                electionId: election.id,
                circuitId: c.id,
              })
            );
          });
        });

        let voterPromises: Promise<void>[] = [];
        for (let i: number = 0; i < election.voters.length; i++) {
          let currentVoter: VoterDTO = election.voters[i];
          voterPromises.push(
            Voter.create(currentVoter, { ignoreDuplicates: true })
          );
        }

        Promise.all(voterPromises).then(() => {
          Promise.all(electionCircuitPromises).then(() => {
            for (let i: number = 0; i < election.voters.length; i++) {
              let currentVoter: VoterDTO = election.voters[i];
              ElectionCircuitVoter.create({
                electionCircuitId: `${election.id}_${currentVoter.circuitId}`,
                voterCI: currentVoter.ci,
              });
            }
          });
        });
        resolve();
      } catch (error) {
        rejects(error);
      }
    }).catch((error) => {
      console.log(error);
    });
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

  public addVoters(voters: VoterDTO[], idElection : number): void {
    let voterPromises: Promise<void>[] = [];
    for (let i: number = 0; i < voters.length; i++) {
      let currentVoter: VoterDTO = voters[i];
      voterPromises.push(
        Voter.create(currentVoter, { ignoreDuplicates: true })
      );
    }

    Promise.all(voterPromises).then(() => {
        for (let i: number = 0; i < voters.length; i++) {
          let currentVoter: VoterDTO = voters[i];
          ElectionCircuitVoter.create({
            electionCircuitId: `${idElection}_${currentVoter.circuitId}`,
            voterCI: currentVoter.ci,
          });
        }
    });
  }
}
