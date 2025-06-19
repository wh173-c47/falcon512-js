const crypto = require("crypto");
const {Falcon512} = require("../index.js");

const ITERATIONS = 1000;
const WARMUP = 1;

const defaultOpts = {
    label: 'Benchmark',
    iterations: ITERATIONS,
    warmup: WARMUP
};

const generateHashes = (iterations) => {
    const hashes = new Array(iterations);
    let prev = crypto.randomBytes(32); // initial seed

    for (let i = 0; i < iterations; ++i) {
        const h = crypto.createHash('sha256');

        h.update(prev);
        h.update(Buffer.from([i & 0xff]));

        const next = h.digest();

        hashes[i] = next;
        prev = next;
    }

    return hashes;
};

const bench = async (fn, opts = {}) => {
    const { label, iterations, warmup } = { ...defaultOpts, ...opts };

    for (let i = 0; i < warmup; i++) {
        await fn(i);
    }

    const t0 = performance.now();

    for (let i = 0; i < iterations; i++) {
        await fn(i);
    }

    const t1 = performance.now();
    const benchTotal = t1 - t0;
    const avgTimeMs = benchTotal / iterations;
    const opsPerSec = 1000 / avgTimeMs;

    const result = {
        label,
        bench: {
            runs: iterations,
            totalMs: benchTotal,
            avgMs: avgTimeMs,
            opsPerSec,
        },
    };

    console.log(`📊 ${label}`);
    console.log(`- Bench:  ${iterations} runs, ${benchTotal.toFixed(3)} ms total`);
    console.log(`- Avg per call: ${avgTimeMs.toFixed(6)} ms`);
    console.log(`- Calls/sec: ${opsPerSec.toFixed(2)} ops/sec`);

    return result;
};

const benchmarkKeygen = async () => {
    const falcon = await Falcon512.instance();

    const benchRun = () => falcon.genkeys();

    await bench(benchRun, { ...defaultOpts, label: 'Falcon512 Keygen' });
};

const benchmarkSign = async () => {
    const falcon = await Falcon512.instance();

    const keypair = falcon.genkeys();
    const hashes = new Array(ITERATIONS).fill(0).map(_ => crypto.randomBytes(32));

    const benchRun = (i) => falcon.sign(keypair.sk, hashes[i]);

    await bench(benchRun, { ...defaultOpts, label: 'Falcon512 Sign' });
};

const benchmarkVerify = async () => {
    const falcon = await Falcon512.instance();

    const keypair = falcon.genkeys();
    const hashes = generateHashes(ITERATIONS);
    const sigs = hashes.map((_, i) => falcon.sign(keypair.sk, hashes[i]));

    const benchRun = (i) => {
        falcon.verify(keypair.pk, sigs[i], hashes[i]);
    }

    await bench(benchRun, { ...defaultOpts, label: 'Falcon512 Verify' });
};

const main = async () => {
    await benchmarkKeygen();
    await benchmarkSign();
    await benchmarkVerify();
}

main();
