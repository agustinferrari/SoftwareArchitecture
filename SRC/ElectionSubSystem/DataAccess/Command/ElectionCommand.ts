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

export class ElectionCommand {
  addElections(elections: ElectionDTO[]): void {
    elections.map((election: ElectionDTO) => {
      this.addElection(election);
    });
  }

  public async addElection(election: ElectionDTO): Promise<void> {
    new Promise<ElectionDTO>(async (resolve, rejects) => {
      try {
        await this.addParties(election.parties);
        await Election.create(election, {
          include: [{ model: Candidate, ignoreDuplicates: true }],
        });
        await this.addCircuits(election);
        await this.addVoters(election);
        resolve(election);
      } catch (error) {
        rejects("Error adding:" + error);
      }
    })
      .then((election) => {
        // this.addVoters(election);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  public async addElectionSeq(election: ElectionDTO): Promise<void> {
    try {
      let circuitPromises: Promise<void>[] = [];
      election.circuits.map(async (c: CircuitDTO) => {
        circuitPromises.push(Circuit.create(c, { ignoreDuplicates: true }));
      });

      let partyPromises: Promise<void>[] = [];
      election.parties.map((p: PartyDTO) => {
        partyPromises.push(Party.create(p, { ignoreDuplicates: true }));
      });

      await Promise.all(partyPromises).then(async()=>{
        await Election.create(election, {
          include: [{ model: Candidate, ignoreDuplicates: true }],
        });  
      })


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

      // election.voters.map(async (v: VoterDTO) => {
      //   await Voter.create(v, { ignoreDuplicates: true });
      //   //TODO: LOG DE CREADO USUARIO
      //   await ElectionCircuitVoter.create({
      //     electionCircuitId: `${election.id}_${v.circuitId}`,
      //     voterCI: v.ci,
      //   });
      // });
    } catch (error) {
      console.log("CACAAAAAAAAAAAAAAAAAAAAAAA");
    }
  }

  private addParties(parties: PartyDTO[]): void {
    parties.map((p: PartyDTO) => {
      Party.create(p, { ignoreDuplicates: true });
    });
  }

  private addCircuits(election: ElectionDTO): void {
    // election.circuits.map((c: CircuitDTO) => {
    //   Circuit.create(c, { ignoreDuplicates: true }).then(() => {
    //     ElectionCircuit.create({
    //       electionCircuitId: `${election.id}_${c.id}`,
    //       electionId: election.id,
    //       circuitId: c.id,
    //     });
    //   });
    // });

    election.circuits.map((c: CircuitDTO) => {
      Circuit.create(c, { ignoreDuplicates: true });
      ElectionCircuit.create({
        electionCircuitId: `${election.id}_${c.id}`,
        electionId: election.id,
        circuitId: c.id,
      });
    });
  }

  private addVoters(election: ElectionDTO): void {
    // election.voters.map((v: VoterDTO) => {
    //   Voter.create(v, { ignoreDuplicates: true }).then(() => {
    //     //TODO: LOG DE CREADO USUARIO
    //     ElectionCircuitVoter.create({
    //       electionCircuitId: `${election.id}_${v.circuitId}`,
    //       voterCI: v.ci,
    //     });
    //  });
    // });

    election.voters.map((v: VoterDTO) => {
      Voter.create(v, { ignoreDuplicates: true });
      //TODO: LOG DE CREADO USUARIO
      ElectionCircuitVoter.create({
        electionCircuitId: `${election.id}_${v.circuitId}`,
        voterCI: v.ci,
      });
    });
  }
}
