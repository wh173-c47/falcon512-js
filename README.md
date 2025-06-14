# Falcon512 CommonJS Library

> Efficient Falcon-512 post-quantum safe digital signature algorithm commonJS lib using WebAssembly.

This library wraps the original Falcon-512 C implementation compiled to WebAssembly via Emscripten. 
It exposes a simple Node.js class interface to sign and verify data using Falcon512.

---

## Requirements

- `Node.js`

---

## Usage

### API

- **Falcon512.instance()**: async singleton loader.
- **genkeys(seed?)**: generate Falcon512 key pair (optionally provide seed).
- **sign(privateKey, message, seed?)**: sign data.
- **verify(publicKey, signature, message)**: verify data.

### Example usage

```js
const crypto = require("crypto");
const { Falcon512 } = require("./index.js");

(async () => {
    const falcon = await Falcon512.instance();

    // Generate keypair
    const { sk, pk } = falcon.genkeys();

    // Sign data
    const message = crypto.randomBytes(32);
    const signature = falcon.sign(sk, message);

    // Verify
    const valid = falcon.verify(pk, signature, message);
    console.log("Valid signature:", valid);
})();
```

---

## Development

### Requirements

- `python` (>= 3.8)
- `emcc` (4.0.10) (Emscripten compiler) to build the WASM module

### Installing Emscripten

```bash
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
./emsdk install latest
./emsdk activate latest
source ./emsdk_env.sh
```

### Building WebAssembly

```bash
npm run build
```

---

## Benchmarks

### Falcon512 Keygen
- Runs: 1000
- Total: 9122.305 ms
- Avg per call: 9.122305 ms
- Calls/sec: 109.62 ops/sec

### Falcon512 Sign
- Runs: 1000
- Total: 418.553 ms
- Avg per call: 0.418553 ms
- Calls/sec: 2389.18 ops/sec

### Falcon512 Verify
- Runs: 1000
- Total: 41.382 ms
- Avg per call: 0.041382 ms
- Calls/sec: 24165.13 ops/sec

*Note: Results may differ depending on the execution environment, you can run your own benchmarks following below instructions.*

```bash
npm run benchmark
```

---

## Disclaimer

This codebase is not audited. Use at your own risk.

---

## Credits

- Falcon512 spec: https://falcon-sign.info/
- Emscripten: https://emscripten.org
- GramThanos: https://github.com/GramThanos/falcon.js
