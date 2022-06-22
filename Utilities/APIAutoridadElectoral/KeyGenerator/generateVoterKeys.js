const prompt = require("prompt-sync")({ sigint: true });
// const keyPairCount = prompt("Cuantos pares de claves desea generar? ");
const config = require("config");
const keyPairCount = config.get("Keys.count");
const { generateKeyPairSync } = require("crypto");

const ESC = "\x1b"; // ASCII escape character
const CSI = ESC + "["; // control sequence introducer

function writeChangingLine(name, count) {
  clearLastLine();
  process.stdout.write(
    "\n" + name + count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "\r"
  );
}

function clearLastLine() {
  process.stdout.write(CSI + "A"); // moves cursor up one line
  process.stdout.write(CSI + "K"); // clears from cursor to line end
}

function generateKeys() {
  let keyPair = generateKeyPairSync("rsa", {
    modulusLength: config.get("Keys.voterSize"),
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });

  let publicKey = keyPair.publicKey;
  let privateKey = keyPair.privateKey;
  let keys = { publicKey, privateKey };
  return keys;
}

console.log();
console.log("Total Key Count: ", keyPairCount);
const fs = require("fs");

try {
  KeyFileLoad(keyPairCount);
  console.log("Finished generating keys");
} catch (error) {
  console.error(error);
}

function KeyFileLoad(keyPairCount) {
  let filePathKeys = "../Keys/private-public-keys";
  try {
    let pm2id = process.env.pm_id;
    if (pm2id) {
      filePathKeys = filePathKeys + pm2id;
    }
  } catch (e) {}
  filePathKeys = filePathKeys + ".txt";
  fs.writeFileSync(filePathKeys, "");
  try {
    for (let i = 0; i < keyPairCount; i++) {
      let keys = generateKeys();
      let toPrint = `${JSON.stringify(keys)}`;
      fs.appendFileSync(filePathKeys, toPrint);
      //New line to file
      fs.appendFileSync(filePathKeys, "\r\n");
      writeChangingLine(" New keys: ", i + 1);
    }
    console.log();
    console.log();
    console.log("Finished creating keys");
  } catch (error) {
    console.error(error);
  }
}
