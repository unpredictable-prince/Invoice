import { Ledger } from "./managed/invoice/contract/index.js";
import { WitnessContext } from "@midnight-ntwrk/midnight-js-protocol/compact-runtime";

export type InvoicePrivateState = {
  readonly secretKey: Uint8Array;
};

export const createInvoicePrivateState = (secretKey: Uint8Array) => ({
  secretKey,
});

export const witnesses = {
  localSecretKey: ({
    privateState,
  }: WitnessContext<Ledger, InvoicePrivateState>): [
    InvoicePrivateState,
    Uint8Array,
  ] => [privateState, privateState.secretKey],
};
