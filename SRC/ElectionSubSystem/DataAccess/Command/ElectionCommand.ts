// import { CircuitDTO } from "../../../Common/Domain/CircuitDTO";
// import { ElectionDTO } from "../../../Common/Domain/ElectionDTO";
// import { PartyDTO } from "../../../Common/Domain/PartyDTO";
// import { VoterDTO } from "../../../Common/Domain/VoterDTO";

// import { Candidate } from "../../../Common/Models/Candidate";
// import { Circuit } from "../../../Common/Models/Circuit";
// import { Election, ElectionCircuit, ElectionCircuitVoter } from "../../../Common/Models/Election";
// import { Party } from "../../../Common/Models/Party";
// import { Voter } from "../../../Common/Models/Voter";
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
    new Promise<ElectionDTO>((resolve, rejects) => {
      try {
        this.addParties(election.parties);
        Election.create(election, {
          include: [{ model: Candidate, ignoreDuplicates: true }],
        });
        this.addCircuits(election);

        resolve(election);
      } catch (error) {
        rejects("Error adding:" + error);
      }
    }).then((election) => {
      this.addVoters(election);
    });
  }

  private addParties(parties: PartyDTO[]): void {
    parties.map((p: PartyDTO) => {
      Party.create(p, { ignoreDuplicates: true });
    });
  }

  private addCircuits(election: ElectionDTO): void {
    election.circuits.map((c: CircuitDTO) => {
      Circuit.create(c, { ignoreDuplicates: true }).then(() => {
        ElectionCircuit.create({
          electionCircuitId: `${election.id}_${c.id}`,
          electionId: election.id,
          circuitId: c.id,
        });
      });
    });
  }

  private addVoters(election: ElectionDTO): void {
    election.voters.map((v: VoterDTO) => {
      Voter.create(v, { ignoreDuplicates: true }).then(() => {
        ElectionCircuitVoter.create({
          electionCircuitId: `${election.id}_${v.circuitId}`,
          voterCI: v.ci,
        });
      });
    });
  }
}
