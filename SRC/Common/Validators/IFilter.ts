export interface IFilter {
  error: string;
  maxAttempts: number;
  validate(): void;
}
