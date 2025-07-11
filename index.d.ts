export class Falcon512 {
    static instance(): Promise<Falcon512>;

    genkeys(entropy?: Buffer): { sk: Uint8Array; pk: Uint8Array };
    sign(sk: Uint8Array, data: Uint8Array): Uint8Array;
    verify(pk: Uint8Array, signature: Uint8Array, data: Uint8Array): boolean;
}
