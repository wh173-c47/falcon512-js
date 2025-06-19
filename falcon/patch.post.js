// inserted slightly before emcc gen
    const FALCON_512_PUB_KEY_SIZE = 897;
    const FALCON_512_PRV_KEY_SIZE = 1281;
    const FALCON_512_SIG_COMP_MAX_SIZE = 752;

    // Check if valid return data
    function dataReturn (returnValue, result) {
        if (returnValue === 0) return result;

        throw new Error('FALCON error: ' + returnValue);
    }

    // Get result from memory
    function dataResult (buffer, bytes) {
        return new Uint8Array(HEAPU8.buffer, buffer, bytes).slice();
    }

    // Free malloc buffer
    function dataFree (buffer) {
        try {
            Module._xfree(buffer);
        } catch (err) {
            setTimeout(function () {throw err;}, 0);
        }
    }

    const falcon = {
        version: 'v0.3-beta',
        initialised: false,

        isInitialised: function() {
            return this.initialised;
        },

        keypair: function (seed) {
            const seedDataBytes = seed.length;
            const seedDataBuffer = Module._xmalloc(seedDataBytes);
            const publicKeyBytes = FALCON_512_PUB_KEY_SIZE;
            const publicKeyBuffer = Module._xmalloc(publicKeyBytes);
            const privateKeyBytes = FALCON_512_PRV_KEY_SIZE;
            const privateKeyBuffer = Module._xmalloc(privateKeyBytes);

            HEAPU8.set(seed, seedDataBuffer);

            try {
                const returnValue = Module._falconjs_keygen_make(
                    publicKeyBuffer,
                    privateKeyBuffer,
                    seedDataBuffer,
                    seedDataBytes
                );

                return dataReturn(returnValue, {
                    publicKey: dataResult(publicKeyBuffer, publicKeyBytes),
                    privateKey: dataResult(privateKeyBuffer, privateKeyBytes)
                });
            }
            finally {
                dataFree(seedDataBuffer);
                dataFree(publicKeyBuffer);
                dataFree(privateKeyBuffer);
            }
        },

        sign: function (data, privateKey, seed) {
            const seedDataBytes = seed.length;
            const seedDataBuffer = Module._xmalloc(seedDataBytes);
            const dataBytes = data.length;
            const dataBuffer = Module._xmalloc(dataBytes);
            const privateKeyBytes = privateKey.length;
            const privateKeyBuffer = Module._xmalloc(privateKeyBytes);
            let signatureKeyBytes = FALCON_512_SIG_COMP_MAX_SIZE;
            const signatureKeyBuffer = Module._xmalloc(signatureKeyBytes);
            const signatureKeyBytesBuffer = Module._xmalloc(4);

            HEAPU8.set(seed, seedDataBuffer);
            HEAPU8.set(data, dataBuffer);
            HEAPU8.set(privateKey, privateKeyBuffer);
            HEAP32[signatureKeyBytesBuffer >> 2] = signatureKeyBytes;

            try {
                const returnValue = Module._falconjs_sign_dyn(
                    signatureKeyBuffer,
                    signatureKeyBytesBuffer,
                    privateKeyBuffer,
                    dataBuffer,
                    dataBytes,
                    seedDataBuffer,
                    seedDataBytes
                );

                const view = new DataView(dataResult(signatureKeyBytesBuffer, 4).buffer, signatureKeyBytesBuffer.byteOffset);
                signatureKeyBytes = view.getUint32(0, true);

                return dataReturn(
                    returnValue,
                    dataResult(signatureKeyBuffer, signatureKeyBytes)
                );
            } finally {
                dataFree(seedDataBuffer);
                dataFree(dataBuffer);
                dataFree(privateKeyBuffer);
                dataFree(signatureKeyBuffer);
            }
        },

        verify: function (data, signature, publicKey) {
            const dataBytes = data.length;
            const dataBuffer = Module._xmalloc(dataBytes);
            const publicKeyBytes = publicKey.length;
            const publicKeyBuffer = Module._xmalloc(publicKeyBytes);
            const signatureKeyBytes = signature.length;
            const signatureKeyBuffer = Module._xmalloc(signatureKeyBytes);

            HEAPU8.set(data, dataBuffer);
            HEAPU8.set(publicKey, publicKeyBuffer);
            HEAPU8.set(signature, signatureKeyBuffer);

            try {
                const returnValue = Module._falconjs_verify(
                    signatureKeyBuffer,
                    signatureKeyBytes,
                    publicKeyBuffer,
                    dataBuffer,
                    dataBytes
                );

                return dataReturn(
                    returnValue,
                    (returnValue === 0)
                );
            }
            finally {
                dataFree(dataBuffer);
                dataFree(publicKeyBuffer);
                dataFree(signatureKeyBuffer);
            }
        }
    };

    // end of emcc gen applied back

    if(runtimeInitialized){moduleRtn=Module}else{moduleRtn=new Promise((resolve,reject)=>{readyPromiseResolve=resolve;readyPromiseReject=reject})}

    moduleRtn.falcon = falcon;

    return moduleRtn;
}
);
})();
if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = Module;
    module.exports.default = Module;
} else if (typeof define === 'function' && define['amd'])
    define([], () => Module);
