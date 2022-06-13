const { createDiffieHellman } = require("crypto");

let { server, voter } = createServerAndVoterDiffieHellman();

console.log(voter.getPublicKey("base64"), "|", voter.getPrivateKey("base64"));



const aliceSecret = server.computeSecret(
  voter.getPublicKey(),
  "base64",
  "base64"
);
const bobSecret = voter.computeSecret(
  server.getPublicKey(),
  "base64",
  "base64"
);

let isSymmetric = aliceSecret == bobSecret;

// true
console.log(`Is Symmetric key generation successful : ${isSymmetric}`);

function createServerAndVoterDiffieHellman() {
  const server = createDiffieHellman(512);
  const serverPrime = server.getPrime();
  const serverGenerator = server.getGenerator();

  // Generate Alice's Key
  const serverKeys = server.generateKeys("base64");

  const voter = createDiffieHellman(serverPrime, serverGenerator);

  // Generate Bobs's Prime
  const voterPrime = voter.getPrime();

  // Generate Bob's Generator
  const voterGenerator = voter.getGenerator();

  // Generate Bob's Key
  const voterKey = voter.generateKeys("base64");
  let { publicKey, privateKey } = voter.generateKeys();
  console.log(publicKey, "|", privateKey);


  return { server, voter };
}
