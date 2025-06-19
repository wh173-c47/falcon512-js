#include <stdio.h>
#include <stdlib.h>

/*
 * This code uses only the external API.
 */

#include "falcon.h"

void *xmalloc(size_t size) {
    return malloc(size);
}

void xfree(void *ptr) {
    free(ptr);
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
