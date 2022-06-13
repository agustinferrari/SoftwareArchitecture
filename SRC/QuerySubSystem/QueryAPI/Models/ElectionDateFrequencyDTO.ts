export class ElectionDateFrequencyDTO {
  electionId: number;
  dateFrequencies: DateFrequencyDTO[];

  constructor(electionId: number, dateFrequencies: DateFrequencyDTO[]) {
    this.electionId = electionId;
    this.dateFrequencies = dateFrequencies;
  }
}

export class DateFrequencyDTO {
  totalVotes: number;
  hour: string;

  constructor(frequency: number, date: string) {
    this.totalVotes = frequency;
    this.hour = date;
  }
}
