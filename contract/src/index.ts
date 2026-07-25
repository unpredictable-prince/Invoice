import { CompiledContract } from "@midnight-ntwrk/midnight-js-protocol/compact-js";

export * from "./managed/invoice/contract/index.js";
export * from "./witnesses.js";

import * as CompiledInvoiceContract from "./managed/invoice/contract/index.js";
import * as Witnesses from "./witnesses.js";

export const CompiledInvoiceContractContract = CompiledContract.make<
  CompiledInvoiceContract.Contract<Witnesses.InvoicePrivateState>
>("Invoice", CompiledInvoiceContract.Contract<Witnesses.InvoicePrivateState>).pipe(
  CompiledContract.withWitnesses(Witnesses.witnesses),
  CompiledContract.withCompiledFileAssets("./managed/invoice"),
);
