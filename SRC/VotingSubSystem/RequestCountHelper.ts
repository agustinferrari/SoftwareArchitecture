export class RequestCountHelper {
  static instance: RequestCountHelper;

  beforeEncryptionCount: number;
  beforeValidationCount: number;
  afterValidationCount: number;
  beforeAddVoteCount: number;
  afterAddVoteCount: number;
  beforeCommandQueueCount: number;
  afterCommandQueueCount: number;
  expressCount: number;
  beforeGetVoter: number;
  nextFunction : number;
  errorCount: number;
  errorType: string[];
  validationErrorCount : number;
  validationErrorType: string[];
  insideValidationCount:number;
  exampleErrorVote: any;

  constructor() {
    this.expressCount = 0;
    this.beforeAddVoteCount = 0;
    this.afterAddVoteCount = 0;
    this.beforeCommandQueueCount = 0;
    this.afterCommandQueueCount = 0;
    this.beforeEncryptionCount = 0;
    this.beforeValidationCount = 0;
    this.afterValidationCount = 0;
    this.nextFunction = 0;
    this.beforeGetVoter = 0;
    this.errorCount = 0;
    this.errorType = [];
    this.validationErrorCount =0;
    this.validationErrorType = [];
    this.insideValidationCount = 0;
    this.exampleErrorVote = null;
  }

  public static getInstance(): RequestCountHelper {
    if (!RequestCountHelper.instance) {
      RequestCountHelper.instance = new RequestCountHelper();
    }
    return RequestCountHelper.instance;
  }
}
