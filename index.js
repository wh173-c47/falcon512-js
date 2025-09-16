const FalconModule = require("./falcon/falcon.js");

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
    if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
      // Browser: use Web Crypto
      const arr = new Uint8Array(256);

      window.crypto.getRandomValues(arr);

      return arr;
    } else {
      // Node.js: use crypto
      const { randomBytes } = require("crypto");

      return randomBytes(256);
    }
  }

  genkeys(entropy) {
    const pair = this.falcon.keypair(entropy ? entropy : this.handleSeed());

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
