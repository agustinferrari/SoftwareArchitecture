import { rejects } from "assert";
import { CircuitDTO } from "../../Domain/CircuitDTO";
import { ElectionDTO } from "../../Domain/ElectionDTO";
import { PartyDTO } from "../../Domain/PartyDTO";
import { VoterDTO } from "../../Domain/VoterDTO";
import { Candidate } from "../Models/Candidate";
import { Circuit } from "../Models/Circuit";
import {
  Election,
  ElectionCircuit,
  ElectionCircuitVoter,
} from "../Models/Election";
import { Party } from "../Models/Party";
import { Voter } from "../Models/Voter";

export class ElectionCommand {
  addElections(elections: ElectionDTO[]): void {
    elections.map((election: ElectionDTO) => {
      this.addElection(election);
    });
  }

  private addElection(election: ElectionDTO): void {
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
