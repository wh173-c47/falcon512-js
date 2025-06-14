#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

/*
 * This code uses only the external API.
 */

#include "falcon.h"

void * xmalloc(size_t len) {
	void *buf;

	if (len == 0) {
		return NULL;
	}
	#ifdef __EMSCRIPTEN__
        int ret = posix_memalign(&buf, 32, len);
        if (ret != 0) {
            fprintf(stderr, "memory allocation alignment error\n");
            exit(EXIT_FAILURE);
        }
    #else
        buf = malloc(len);
    #endif
	if (buf == NULL) {
		fprintf(stderr, "memory allocation error\n");
		exit(EXIT_FAILURE);
	}
	return buf;
}

void xfree(void *buf) {
	if (buf != NULL) {
		free(buf);
	}
}

// bits = 2 ^ logn
// 		= 2 ^ 8 = 256
// 		= 2 ^ 9 = 512
// 		= 2 ^ 10 = 1024

size_t falconjs_pubkey_size () {
	return FALCON_PUBKEY_SIZE(9);
}

size_t falconjs_privkey_size () {
	return FALCON_PRIVKEY_SIZE(9);
}

size_t falconjs_expandedkey_size () {
	return FALCON_EXPANDEDKEY_SIZE(9);
}

size_t falconjs_sig_compressed_maxsize () {
	return FALCON_SIG_COMPRESSED_MAXSIZE(9);
}

size_t falconjs_sig_ct_size () {
	return FALCON_SIG_COMPRESSED_MAXSIZE(9);
}

shake256_context get_rng(uint8_t *seed, size_t seed_len) {
	shake256_context rng;

	shake256_init(&rng);
	shake256_inject(&rng, seed, seed_len);
	shake256_flip(&rng);

	return rng;
}

int falconjs_keygen_make(uint8_t *pk, uint8_t *sk,  uint8_t *seed, size_t seed_len) {
	shake256_context rng = get_rng(seed, seed_len);

	size_t tmp_len = FALCON_TMPSIZE_KEYGEN(9);
	uint8_t *tmp = xmalloc(tmp_len);

	int r = falcon_keygen_make(&rng, 9,
		sk, FALCON_PRIVKEY_SIZE(9),
		pk, FALCON_PUBKEY_SIZE(9),
		tmp, tmp_len
	);

	xfree(tmp);

	return r;
}

int falconjs_expand_privkey(uint8_t *esk, uint8_t *sk) {
	size_t tmp_len = FALCON_TMPSIZE_EXPANDPRIV(9);
	uint8_t *tmp = xmalloc(tmp_len);

	int r = falcon_expand_privkey(
		esk, FALCON_EXPANDEDKEY_SIZE(9),
		sk, FALCON_PRIVKEY_SIZE(9),
		tmp, tmp_len
	);

	xfree(tmp);

	return r;
}

int falconjs_sign_dyn(uint8_t *sig, size_t *sig_len, uint8_t *sk, uint8_t *data, size_t data_len, uint8_t *seed, size_t seed_len) {
	shake256_context rng = get_rng(seed, seed_len);
	size_t tmp_len = FALCON_TMPSIZE_SIGNDYN(9);
	uint8_t *tmp = xmalloc(tmp_len);

	int r = falcon_sign_dyn(
		&rng,
		sig, sig_len, FALCON_SIG_COMPRESSED,
		sk, FALCON_PRIVKEY_SIZE(9),
		data, data_len, tmp, tmp_len
	);

	xfree(tmp);

	return r;
}

int falconjs_verify(uint8_t *sig, size_t sig_len, uint8_t *pk, uint8_t *data, size_t data_len) {
	size_t tmp_len = FALCON_TMPSIZE_VERIFY(9);
	uint8_t *tmp = xmalloc(tmp_len);

	int r = falcon_verify(
		sig, sig_len, FALCON_SIG_COMPRESSED,
		pk, FALCON_PUBKEY_SIZE(9),
		data, data_len, tmp, tmp_len
	);

	xfree(tmp);

	return r;
}
