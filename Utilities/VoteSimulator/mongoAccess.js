const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const config = require("config");

const Election = new Schema({
  id: Number,
  name: String,
  description: String,
  startDate: String,
  endDate: String,
  mode: String,
  circuits: { type: Array, default: [] },
  parties: [{ id: Number, name: String }],
  candidates: [
    {
      ci: String,
      name: String,
      lastName: String,
      gender: String,
      birthday: String,
      partyId: Number,
    },
  ],
  emails: [{ type: Array, default: [] }],
  voters: [
    {
      ci: String,
      name: String,
      lastName: String,
      gender: String,
      birthday: String,
      residency: String,
      phone: String,
      email: String,
      circuitId: Number,
      electionId: Number,
      publicKEy: String,
    },
  ],
});

const Voter = new Schema({
  ci: String,
  circuitId: Number,
  electionId: Number,
  publicKEy: String,
  privateKey:String
});

class MongoAccess {
  constructor() {
    mongoose.connect(
      `mongodb://${config.get("MONGO.host")}:${config.get(
        "MONGO.port"
      )}/${config.get("MONGO.dbName")}`
    );
    
  }

  async saveElections(elections) {
    const ElectionModel = mongoose.model('Election', Election);


    for(let i =0; i<elections.length ; i++){
      let election = new ElectionModel(elections[i]);
      await election.save();
    }
  }


  async saveVotingInformation(votingInformation) {
    const VoterModel = mongoose.model('Voter', Voter);

    for(let i =0; i<votingInformation.length ; i++){
      let voters = new VoterModel(votingInformation[i]);
      await voters.save();
    }
  }

  

  

}

module.exports = MongoAccess;
