# Falcon512 CommonJS Library

> Efficient Falcon-512 post-quantum safe digital signature algorithm commonJS lib using WebAssembly.

This library wraps the original Falcon-512 C implementation compiled to WebAssembly via Emscripten. 
It exposes a simple Node.js class interface to sign and verify data using Falcon512 (compressed sig type).

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

### 📊 Falcon512 Keygen
- Bench:  1000 runs, 9558.272 ms total
- Avg per call: 9.558272 ms
- Calls/sec: 104.62 ops/sec

### 📊 Falcon512 Sign
- Bench:  1000 runs, 425.133 ms total
- Avg per call: 0.425133 ms
- Calls/sec: 2352.20 ops/sec

### 📊 Falcon512 Verify
- Bench:  1000 runs, 44.425 ms total
- Avg per call: 0.044425 ms
- Calls/sec: 22509.81 ops/sec

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
