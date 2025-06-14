// inserted slightly before emcc gen

    // Check if valid return data
    function dataReturn (returnValue, result) {
        if (returnValue === 0) return result;
        throw new Error('FALCON error: ' + returnValue);
    }

    // Get result from memory
    function dataResult (buffer, bytes) {
        return new Uint8Array(
            new Uint8Array(HEAPU8.buffer, buffer, bytes)
        );
    }

    // Free malloc buffer
    function dataFree (buffer) {
        try {
            Module._xfree(buffer);
        }
        catch (err) {
            setTimeout(function () {throw err;}, 0);
        }
    }

    var falcon = {
        version: 'v0.3-beta',
        initialised: false,

        isInitialised: function() {
            return this.initialised;
        },

        keypair: function (seed) {
            var seedData = typeof seed === 'string' ? new TextEncoder().encode(seed) : seed;
            var seedDataBytes = seedData.length;
            var seedDataBuffer = Module._xmalloc(seedDataBytes);
            var publicKeyBytes = Module._falconjs_pubkey_size();
            var publicKeyBuffer = Module._xmalloc(publicKeyBytes);
            var privateKeyBytes = Module._falconjs_privkey_size();
            var privateKeyBuffer = Module._xmalloc(privateKeyBytes);

            Module.writeArrayToMemory(seedData, seedDataBuffer);

            try {
                var returnValue = Module._falconjs_keygen_make(
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

        sign: function (message, privateKey, seed) {
            var seedData = typeof seed === 'string' ? new TextEncoder().encode(seed) : seed;
            var seedDataBytes = seedData.length;
            var seedDataBuffer = Module._xmalloc(seedDataBytes);
            var data = typeof message === 'string' ? new TextEncoder().encode(message) : message;
            var dataBytes = data.length;
            var dataBuffer = Module._xmalloc(dataBytes);
            var privateKeyBytes = privateKey.length;
            var privateKeyBuffer = Module._xmalloc(privateKeyBytes);
            var signatureKeyBytes = Module._falconjs_sig_compressed_maxsize();
            var signatureKeyBuffer = Module._xmalloc(signatureKeyBytes);
            var signatureKeyBytesBuffer = Module._xmalloc(4);

            Module.writeArrayToMemory(seedData, seedDataBuffer);
            Module.writeArrayToMemory(data, dataBuffer);
            Module.writeArrayToMemory(privateKey, privateKeyBuffer);
            Module.writeArrayToMemory(new Uint8Array(new Int32Array([signatureKeyBytes]).buffer), signatureKeyBytesBuffer);

            try {
                var returnValue = Module._falconjs_sign_dyn(
                    signatureKeyBuffer,
                    signatureKeyBytesBuffer,
                    privateKeyBuffer,
                    dataBuffer,
                    dataBytes,
                    seedDataBuffer,
                    seedDataBytes
                );

                signatureKeyBytes = new Int32Array(dataResult(signatureKeyBytesBuffer, 4).buffer)[0];

                return dataReturn(
                    returnValue,
                    dataResult(signatureKeyBuffer, signatureKeyBytes)
                );
            }
            finally {
                dataFree(seedDataBuffer);
                dataFree(dataBuffer);
                dataFree(privateKeyBuffer);
                dataFree(signatureKeyBuffer);
            }
        },

        verify: function (message, signature, publicKey) {
            var data = typeof message === 'string' ? new TextEncoder().encode(message) : message;
            var dataBytes = data.length;
            var dataBuffer = Module._xmalloc(dataBytes);
            var publicKeyBytes = publicKey.length;
            var publicKeyBuffer = Module._xmalloc(publicKeyBytes);
            var signatureKeyBytes = signature.length;
            var signatureKeyBuffer = Module._xmalloc(signatureKeyBytes);

            Module.writeArrayToMemory(data, dataBuffer);
            Module.writeArrayToMemory(publicKey, publicKeyBuffer);
            Module.writeArrayToMemory(signature, signatureKeyBuffer);

            try {
                var returnValue = Module._falconjs_verify(
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
