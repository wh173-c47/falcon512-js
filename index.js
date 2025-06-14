const FalconModule = require("./falcon/falcon.js");
const crypto = require("crypto");

class Falcon512 {
  static _instance = null;
  falcon;

  constructor(falcon) {
    this.falcon = falcon;
  }

  static async instance() {
    if (Falcon512._instance == null) {
      const module = await FalconModule();

      Falcon512._instance = new Falcon512(module.falcon);
    }

    return Falcon512._instance;
  }

  handleSeed(seed) {
    if (!seed || seed.length === 0) {
      return Uint8Array.from(crypto.randomBytes(256));
    }

    return seed;
  }

  genkeys(seed = undefined) {
    const pair = this.falcon.keypair(this.handleSeed(seed));

    return {sk: pair.privateKey, pk: pair.publicKey};
  }

  sign(sk, data, seed = undefined) {
    return this.falcon.sign(data, sk, this.handleSeed(seed));
  }

  verify(pk, signature, data) {
    return this.falcon.verify(data, signature, pk);
  }
}

module.exports = {Falcon512};
