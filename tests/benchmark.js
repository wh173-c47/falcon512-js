const crypto = require("crypto");
const {Falcon512} = require("../index.js");

const ITERATIONS = 1000;
const WARMUP = 1;

const bench = (fn, label = 'Benchmark', iterations = ITERATIONS) => {
    // Warmup to ensure async module loading
    for (let i = 0; i < WARMUP; i++) {
        fn(i);
    }

    const t0 = performance.now();
    for (let i = 0; i < iterations; i++) {
        fn(i);
    }
    const t1 = performance.now();

    const totalTimeMs = t1 - t0;
    const avgTimeMs = totalTimeMs / iterations;

    console.log(`${label}:`);
    console.log(`  Runs: ${iterations}`);
    console.log(`  Total: ${totalTimeMs.toFixed(3)} ms`);
    console.log(`  Avg per call: ${avgTimeMs.toFixed(6)} ms`);
    console.log(`  Calls/sec: ${(1000 / avgTimeMs).toFixed(2)} ops/sec`);
};

const benchmarkKeygen = async () => {
    const falcon = await Falcon512.instance();

    const benchRun = () => falcon.genkeys();

    await bench(benchRun, 'Falcon512 Keygen', ITERATIONS);
};

const benchmarkSign = async () => {
    const falcon = await Falcon512.instance();

    const keypair = falcon.genkeys();
    const hashes = new Array(ITERATIONS).fill(0).map(_ => crypto.randomBytes(32));

    const benchRun = (i) => falcon.sign(keypair.sk, hashes[i]);

    await bench(benchRun, 'Falcon512 Sign', ITERATIONS);
};

const benchmarkVerify = async () => {
    const falcon = await Falcon512.instance();

    const keypair = falcon.genkeys();
    const hashes = new Array(ITERATIONS).fill(0).map(_ => crypto.randomBytes(32));
    const sigs = hashes.map((_, i) => falcon.sign(keypair.sk, hashes[i]));

    const benchRun = (i) => {
        falcon.verify(keypair.pk, sigs[i], hashes[i]);
    }

    await bench(benchRun, 'Falcon512 Verify', ITERATIONS);
};

const main = async () => {
    await benchmarkKeygen();
    await benchmarkSign();
    await benchmarkVerify();
}

main();
