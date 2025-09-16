.POSIX:

# =====================================================================
#
# Configurable options:
#   CC       C compiler to JavaScript; Probably Emscripten ("emcc")
#   CFLAGS   Compilation flags
#   LD       Linker; normally the same command as the compiler.
#   LDFLAGS  Linker options, not counting the extra libs.
#   LIBS     Extra libraries for linking.

CC = emcc
CFLAGS = -Wall -Wextra -Wshadow -Wundef -O3 -msimd128 -ffast-math -flto -fno-math-errno -fno-signed-zeros -fno-trapping-math -fno-rounding-math -DNDEBUG -DFALCON_RAND_GETENTROPY=0 -DFALCON_RAND_URANDOM=0 -DFALCON_RAND_WIN32=0
LD = emcc
LDFLAGS = -O3 -msimd128 -ffast-math -flto -fno-math-errno -fno-signed-zeros -fno-trapping-math -fno-rounding-math -DFALCON_RAND_GETENTROPY=0 -DFALCON_RAND_URANDOM=0 -DFALCON_RAND_WIN32=0

LIBS =

# =====================================================================

SOURCE = cfalcon
OBJ = $(SOURCE)/codec.o $(SOURCE)/common.o $(SOURCE)/falcon.o $(SOURCE)/fft.o $(SOURCE)/fpr.o $(SOURCE)/keygen.o $(SOURCE)/rng.o $(SOURCE)/shake.o $(SOURCE)/sign.o $(SOURCE)/vrfy.o

# =====================================================================

all: falconjs

clean:
	-rm -f $(OBJ) falcon.js falconjs.o falcon.wasm falcon.wasm.js

falconjs: falconjs.o $(OBJ)
	$(LD) $(LDFLAGS) -o falcon.js falconjs.o $(OBJ) $(LIBS) \
	-s EXPORTED_FUNCTIONS='["_xfree","_xmalloc","_falconjs_keygen_make","_falconjs_sign_dyn","_falconjs_verify"]' \
	-DNDEBUG \
	-sWASM=1 \
	-sALLOW_MEMORY_GROWTH=1 \
	-sSINGLE_FILE=1 \
	-sNO_EXIT_RUNTIME=1 \
	-sMODULARIZE=1 \
	-sEXPORT_ES6=0 \
	-sENVIRONMENT=web \
	-sINITIAL_MEMORY=131072 \

	head -n -12 falcon.js | cat - patch.post.js > tmp && mv tmp falcon.js

# =====================================================================

falconjs.o: falconjs.c $(SOURCE)/falcon.h
	$(CC) $(CFLAGS) -c -o falconjs.o falconjs.c -I$(SOURCE)/

codec.o: codec.c config.h inner.h fpr.h
	$(CC) $(CFLAGS) -c -o $(SOURCE)/codec.o $(SOURCE)/codec.c

common.o: common.c config.h inner.h fpr.h
	$(CC) $(CFLAGS) -c -o $(SOURCE)/common.o $(SOURCE)/common.c

falcon.o: falcon.c falcon.h config.h inner.h fpr.h
	$(CC) $(CFLAGS) -c -o $(SOURCE)/falcon.o $(SOURCE)/falcon.c

fft.o: fft.c config.h inner.h fpr.h
	$(CC) $(CFLAGS) -c -o $(SOURCE)/fft.o $(SOURCE)/fft.c

fpr.o: fpr.c config.h inner.h fpr.h
	$(CC) $(CFLAGS) -c -o $(SOURCE)/fpr.o $(SOURCE)/fpr.c

keygen.o: keygen.c config.h inner.h fpr.h
	$(CC) $(CFLAGS) -c -o $(SOURCE)/keygen.o $(SOURCE)/keygen.c

rng.o: rng.c config.h inner.h fpr.h
	$(CC) $(CFLAGS) -c -o $(SOURCE)/rng.o $(SOURCE)/rng.c

shake.o: shake.c config.h inner.h fpr.h
	$(CC) $(CFLAGS) -c -o $(SOURCE)/shake.o $(SOURCE)/shake.c

sign.o: sign.c config.h inner.h fpr.h
	$(CC) $(CFLAGS) -c -o $(SOURCE)/sign.o $(SOURCE)/sign.c

vrfy.o: vrfy.c config.h inner.h fpr.h
	$(CC) $(CFLAGS) -c -o $(SOURCE)/vrfy.o $(SOURCE)/vrfy.c
