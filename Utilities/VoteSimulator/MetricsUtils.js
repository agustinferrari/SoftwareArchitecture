class MetricsUtils {
  constructor() {
    this.failedAttempts = 0;
    this.successfulAttempts = 0;
    this.totalAttempts = 0;
    this.resCodes = {
      "1XX": 0,
      "2XX": 0,
      "3XX": 0,
      "4XX": 0,
      "5XX": 0,
    };
    this.responseTimes = []
  }

  calculate(){
    let totalTime = 0;
    let maxTime = 0;
    let minTime = -1;
    for(let i = 0 ; i<this.responseTimes.length ; i++){
        totalTime += this.responseTimes[i];
        if(this.responseTimes[i] > maxTime){
            maxTime = this.responseTimes[i];
        }
        if(this.responseTimes[i] < minTime || minTime == -1){
            minTime = this.responseTimes[i];
        }
    }

    this.averageResponseTime = totalTime/this.responseTimes.length;
    this.maxTime  = maxTime;
    this.minTime = minTime;
  }

  incrementCode(code) {
    let stringCode = code+"";
    let codeMod = stringCode.charAt(0)  + "XX";
    if (this.resCodes[codeMod]) {
      this.resCodes[codeMod]++;
    } else {
      this.resCodes[codeMod] = 1;
    }
  }

  DateDiff(/*Date*/ date1, /*Date*/ date2) {
    return date1.getTime() - date2.getTime();
  }
}

module.exports = MetricsUtils;
