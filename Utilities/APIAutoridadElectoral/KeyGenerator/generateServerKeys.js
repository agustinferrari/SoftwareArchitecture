const config = require("config");
const { generateKeyPairSync } = require("crypto");


function generateKeys() {
  let keyPair = generateKeyPairSync("rsa", {
    modulusLength: config.get("Keys.serverSize"),
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
console.log("Generating Server Key with size: ", config.get("Keys.serverSize"));
const fs = require("fs");

try {
  KeyFileLoad();
  console.log("Finished generating keys");
} catch (error) {
  console.error(error);
}

function KeyFileLoad() {
  let serverConfig = config.get("serverConfigPath");
  let jsonServerConfig = JSON.parse(fs.readFileSync(serverConfig));
  fs.writeFileSync(serverConfig, "");
  let keys = generateKeys();
  jsonServerConfig.publicKey = keys.publicKey;
  jsonServerConfig.privateKey = keys.privateKey;
  try {
    fs.appendFileSync(serverConfig, JSON.stringify(jsonServerConfig));
    console.log("Finished creating server keys")
  } catch (error) {
    console.error(error);
  }
}
