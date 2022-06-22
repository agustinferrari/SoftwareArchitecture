const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const config = require("config");
const ESC = "\x1b"; // ASCII escape character
const CSI = ESC + "["; // control sequence introducer

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
  emails: [{ type: String, default: [] }],
});

const Voter = new Schema({
  ci: String,
  credential: String,
  name: String,
  lastName: String,
  gender: String,
  birthday: String,
  residency: String,
  phone: String,
  email: String,
  circuitId: Number,
  electionId: Number,
  publicKey: String,
});

const Authentication = new Schema({
  ci: String,
  email: String,
  password: String,
  role: String,
});

const VotingInformation = new Schema({
  ci: String,
  circuitId: Number,
  electionId: Number,
  password: String,
  publicKey: String,
  privateKey: String,
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
    console.log("Starting to save elections in mongoose");
    const ElectionModel = mongoose.model("Election", Election);
    await ElectionModel.insertMany(elections);
    console.log("Finished saving elections in mongoose");
  }

  async saveVoters(voters) {
    console.log("Starting to save voters in mongoose");
    const VoterModel = mongoose.model("Voter", Voter);
    const VotingInformationModel = mongoose.model(
      "VotingInformation",
      VotingInformation
    );
    const AuthenticationModel = mongoose.model(
      "Authentication",
      Authentication
    );

    let batchSize = config.get("MONGO.batchSize");
    let batchCount = voters.length / batchSize;
    let currentBatch = 1;

    if (batchCount < 1) {
      batchCount = 1;
    }

    for (let i = 0; i < voters.length; i = i + batchSize) {
      await VoterModel.insertMany(voters.slice(i, i + batchSize));
      console.log(`Voter batches processed ${currentBatch} / ${batchCount}`);

      await VotingInformationModel.insertMany(voters.slice(i, i + batchSize));
      console.log(`VotingInformation batches processed ${currentBatch} / ${batchCount}`);

      await AuthenticationModel.insertMany(voters.slice(i, i + batchSize));
      console.log(`Authentication batches processed ${currentBatch} / ${batchCount}`);

      currentBatch++;
    }

    console.log("Finished saving voters in mongoose");
  }

  async getElectionPaginated(pos) {
    const ElectionModel = mongoose.model("Election", Election);
    let result = await ElectionModel.find().skip(pos).limit(1);
    return result;
  }

  async getElections() {
    const ElectionModel = mongoose.model("Election", Election);
    let result = await ElectionModel.find();
    return result;
  }

  async getVoterPaginated(page, limit, electionId) {
    if (page >= 0) {
      page = page - 1;
    }
    const VoterModel = mongoose.model("Voter", Voter);
    let result = await VoterModel.find({ electionId: { $eq: electionId } })
      .skip(page*limit)
      .limit(limit)
      .exec();
    return result;
  }

  async getVoters(page, limit) {
    const VoterModel = mongoose.model("Voter", Voter);
    let result = await VoterModel.find()
      .skip(page * limit)
      .limit(limit)
      .exec();
    return result;
  }

  async getVoterInformation(page, limit) {
    const VotingInformationModel = mongoose.model("VotingInformation", VotingInformation);
    let result = await VotingInformationModel.find()
      .skip(page * limit)
      .limit(limit)
      .exec();
    return result;
  }
}

function writeChangingLine(name, count) {
  clearLastLine();
  if (count) {
    process.stdout.write(
      "\n" +
        name +
        count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") +
        "\r"
    );
  }
}

function clearLastLine() {
  process.stdout.write(CSI + "A"); // moves cursor up one line
  process.stdout.write(CSI + "K"); // clears from cursor to line end
}

module.exports = MongoAccess;
