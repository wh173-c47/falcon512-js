var Module = (() => {
  var _scriptName = typeof document != 'undefined' ? document.currentScript?.src : undefined;
  return (
async function(moduleArg = {}) {
  var moduleRtn;

var Module=moduleArg;var ENVIRONMENT_IS_WEB=typeof window=="object";var ENVIRONMENT_IS_WORKER=typeof WorkerGlobalScope!="undefined";var ENVIRONMENT_IS_NODE=typeof process=="object"&&process.versions?.node&&process.type!="renderer";var arguments_=[];var thisProgram="./this.program";var quit_=(status,toThrow)=>{throw toThrow};if(typeof __filename!="undefined"){_scriptName=__filename}else{}var scriptDirectory="";function locateFile(path){if(Module["locateFile"]){return Module["locateFile"](path,scriptDirectory)}return scriptDirectory+path}var readAsync,readBinary;if(ENVIRONMENT_IS_NODE){var fs=require("fs");scriptDirectory=__dirname+"/";readBinary=filename=>{filename=isFileURI(filename)?new URL(filename):filename;var ret=fs.readFileSync(filename);return ret};readAsync=async(filename,binary=true)=>{filename=isFileURI(filename)?new URL(filename):filename;var ret=fs.readFileSync(filename,binary?undefined:"utf8");return ret};if(process.argv.length>1){thisProgram=process.argv[1].replace(/\\/g,"/")}arguments_=process.argv.slice(2);quit_=(status,toThrow)=>{process.exitCode=status;throw toThrow}}else if(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER){try{scriptDirectory=new URL(".",_scriptName).href}catch{}{readAsync=async url=>{var response=await fetch(url,{credentials:"same-origin"});if(response.ok){return response.arrayBuffer()}throw new Error(response.status+" : "+response.url)}}}else{}var out=console.log.bind(console);var err=console.error.bind(console);var wasmBinary;var ABORT=false;var EXITSTATUS;var isFileURI=filename=>filename.startsWith("file://");var readyPromiseResolve,readyPromiseReject;var wasmMemory;var HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAPF64;var HEAP64,HEAPU64;var runtimeInitialized=false;function updateMemoryViews(){var b=wasmMemory.buffer;HEAP8=new Int8Array(b);HEAP16=new Int16Array(b);HEAPU8=new Uint8Array(b);HEAPU16=new Uint16Array(b);HEAP32=new Int32Array(b);HEAPU32=new Uint32Array(b);HEAPF32=new Float32Array(b);HEAPF64=new Float64Array(b);HEAP64=new BigInt64Array(b);HEAPU64=new BigUint64Array(b)}function preRun(){if(Module["preRun"]){if(typeof Module["preRun"]=="function")Module["preRun"]=[Module["preRun"]];while(Module["preRun"].length){addOnPreRun(Module["preRun"].shift())}}callRuntimeCallbacks(onPreRuns)}function initRuntime(){runtimeInitialized=true}function postRun(){if(Module["postRun"]){if(typeof Module["postRun"]=="function")Module["postRun"]=[Module["postRun"]];while(Module["postRun"].length){addOnPostRun(Module["postRun"].shift())}}callRuntimeCallbacks(onPostRuns)}var runDependencies=0;var dependenciesFulfilled=null;function addRunDependency(id){runDependencies++;Module["monitorRunDependencies"]?.(runDependencies)}function removeRunDependency(id){runDependencies--;Module["monitorRunDependencies"]?.(runDependencies);if(runDependencies==0){if(dependenciesFulfilled){var callback=dependenciesFulfilled;dependenciesFulfilled=null;callback()}}}function abort(what){Module["onAbort"]?.(what);what="Aborted("+what+")";err(what);ABORT=true;what+=". Build with -sASSERTIONS for more info.";var e=new WebAssembly.RuntimeError(what);readyPromiseReject?.(e);throw e}var wasmBinaryFile;function findWasmBinary(){return locateFile("falcon.wasm")}function getBinarySync(file){if(file==wasmBinaryFile&&wasmBinary){return new Uint8Array(wasmBinary)}if(readBinary){return readBinary(file)}throw"both async and sync fetching of the wasm failed"}async function getWasmBinary(binaryFile){if(!wasmBinary){try{var response=await readAsync(binaryFile);return new Uint8Array(response)}catch{}}return getBinarySync(binaryFile)}async function instantiateArrayBuffer(binaryFile,imports){try{var binary=await getWasmBinary(binaryFile);var instance=await WebAssembly.instantiate(binary,imports);return instance}catch(reason){err(`failed to asynchronously prepare wasm: ${reason}`);abort(reason)}}async function instantiateAsync(binary,binaryFile,imports){if(!binary&&typeof WebAssembly.instantiateStreaming=="function"&&!ENVIRONMENT_IS_NODE){try{var response=fetch(binaryFile,{credentials:"same-origin"});var instantiationResult=await WebAssembly.instantiateStreaming(response,imports);return instantiationResult}catch(reason){err(`wasm streaming compile failed: ${reason}`);err("falling back to ArrayBuffer instantiation")}}return instantiateArrayBuffer(binaryFile,imports)}function getWasmImports(){return{a:wasmImports}}async function createWasm(){function receiveInstance(instance,module){wasmExports=instance.exports;wasmMemory=wasmExports["f"];updateMemoryViews();assignWasmExports(wasmExports);removeRunDependency("wasm-instantiate");return wasmExports}addRunDependency("wasm-instantiate");function receiveInstantiationResult(result){return receiveInstance(result["instance"])}var info=getWasmImports();if(Module["instantiateWasm"]){return new Promise((resolve,reject)=>{Module["instantiateWasm"](info,(mod,inst)=>{resolve(receiveInstance(mod,inst))})})}wasmBinaryFile??=findWasmBinary();var result=await instantiateAsync(wasmBinary,wasmBinaryFile,info);var exports=receiveInstantiationResult(result);return exports}class ExitStatus{name="ExitStatus";constructor(status){this.message=`Program terminated with exit(${status})`;this.status=status}}var callRuntimeCallbacks=callbacks=>{while(callbacks.length>0){callbacks.shift()(Module)}};var onPostRuns=[];var addOnPostRun=cb=>onPostRuns.push(cb);var onPreRuns=[];var addOnPreRun=cb=>onPreRuns.push(cb);var noExitRuntime=true;var __abort_js=()=>abort("");var runtimeKeepaliveCounter=0;var __emscripten_runtime_keepalive_clear=()=>{noExitRuntime=false;runtimeKeepaliveCounter=0};var timers={};var handleException=e=>{if(e instanceof ExitStatus||e=="unwind"){return EXITSTATUS}quit_(1,e)};var keepRuntimeAlive=()=>noExitRuntime||runtimeKeepaliveCounter>0;var _proc_exit=code=>{EXITSTATUS=code;if(!keepRuntimeAlive()){Module["onExit"]?.(code);ABORT=true}quit_(code,new ExitStatus(code))};var exitJS=(status,implicit)=>{EXITSTATUS=status;_proc_exit(status)};var _exit=exitJS;var maybeExit=()=>{if(!keepRuntimeAlive()){try{_exit(EXITSTATUS)}catch(e){handleException(e)}}};var callUserCallback=func=>{if(ABORT){return}try{func();maybeExit()}catch(e){handleException(e)}};var _emscripten_get_now=()=>performance.now();var __setitimer_js=(which,timeout_ms)=>{if(timers[which]){clearTimeout(timers[which].id);delete timers[which]}if(!timeout_ms)return 0;var id=setTimeout(()=>{delete timers[which];callUserCallback(()=>__emscripten_timeout(which,_emscripten_get_now()))},timeout_ms);timers[which]={id,timeout_ms};return 0};var abortOnCannotGrowMemory=requestedSize=>{abort("OOM")};var _emscripten_resize_heap=requestedSize=>{var oldSize=HEAPU8.length;requestedSize>>>=0;abortOnCannotGrowMemory(requestedSize)};{if(Module["noExitRuntime"])noExitRuntime=Module["noExitRuntime"];if(Module["print"])out=Module["print"];if(Module["printErr"])err=Module["printErr"];if(Module["wasmBinary"])wasmBinary=Module["wasmBinary"];if(Module["arguments"])arguments_=Module["arguments"];if(Module["thisProgram"])thisProgram=Module["thisProgram"]}var _xmalloc,_xfree,_falconjs_keygen_make,_falconjs_sign_dyn,_falconjs_verify,__emscripten_timeout;function assignWasmExports(wasmExports){Module["_xmalloc"]=_xmalloc=wasmExports["g"];Module["_xfree"]=_xfree=wasmExports["h"];Module["_falconjs_keygen_make"]=_falconjs_keygen_make=wasmExports["i"];Module["_falconjs_sign_dyn"]=_falconjs_sign_dyn=wasmExports["j"];Module["_falconjs_verify"]=_falconjs_verify=wasmExports["k"];__emscripten_timeout=wasmExports["l"]}var wasmImports={c:__abort_js,b:__emscripten_runtime_keepalive_clear,d:__setitimer_js,e:_emscripten_resize_heap,a:_proc_exit};var wasmExports=await createWasm();function run(){if(runDependencies>0){dependenciesFulfilled=run;return}preRun();if(runDependencies>0){dependenciesFulfilled=run;return}function doRun(){Module["calledRun"]=true;if(ABORT)return;initRuntime();readyPromiseResolve?.(Module);Module["onRuntimeInitialized"]?.();postRun()}if(Module["setStatus"]){Module["setStatus"]("Running...");setTimeout(()=>{setTimeout(()=>Module["setStatus"](""),1);doRun()},1)}else{doRun()}}function preInit(){if(Module["preInit"]){if(typeof Module["preInit"]=="function")Module["preInit"]=[Module["preInit"]];while(Module["preInit"].length>0){Module["preInit"].shift()()}}}preInit();run();if(runtimeInitialized){moduleRtn=Module}else{moduleRtn=new Promise((resolve,reject)=>{readyPromiseResolve=resolve;readyPromiseReject=reject})}

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
} else if (typeof define === 'function' && define['amd']) {
    define([], () => Module);
}
