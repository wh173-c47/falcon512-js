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

  handleSeed() {
    return crypto.randomBytes(256);
  }

  genkeys() {
    const pair = this.falcon.keypair(this.handleSeed());

    return {sk: pair.privateKey, pk: pair.publicKey};
  }

  sign(sk, data) {
    return this.falcon.sign(data, sk, this.handleSeed());
  }

  verify(pk, signature, data) {
    return this.falcon.verify(data, signature, pk);
  }
}

module.exports = {Falcon512};
