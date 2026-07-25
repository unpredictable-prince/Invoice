import * as Invoice from '../../contract/src/managed/invoice/contract/index.js';

import { type ContractAddress, convertFieldToBytes } from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';
import { type Logger } from 'pino';
import {
  type InvoiceDerivedState,
  type InvoiceContract,
  type InvoiceProviders,
  type DeployedInvoiceContract,
  invoicePrivateStateKey,
} from './common-types.js';
import { CompiledInvoiceContractContract } from '../../contract/src/index.js';
import * as utils from './utils/index.js';
import { deployContract, findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { combineLatest, map, tap, from, type Observable } from 'rxjs';
import { toHex } from '@midnight-ntwrk/midnight-js-utils';
import { InvoicePrivateState, createInvoicePrivateState } from '../../contract/src/witnesses.js';

export interface DeployedInvoiceAPI {
  readonly deployedContractAddress: ContractAddress;
  readonly state$: Observable<InvoiceDerivedState>;

  pay: () => Promise<void>;
}

export class InvoiceAPI implements DeployedInvoiceAPI {
  private constructor(
    public readonly deployedContract: DeployedInvoiceContract,
    providers: InvoiceProviders,
    private readonly logger?: Logger,
  ) {
    this.deployedContractAddress = deployedContract.deployTxData.public.contractAddress;
    providers.privateStateProvider.setContractAddress(this.deployedContractAddress);
    this.state$ = combineLatest(
      [
        providers.publicDataProvider.contractStateObservable(this.deployedContractAddress, { type: 'latest' }).pipe(
          map((contractState) => Invoice.ledger(contractState.data)),
          tap((ledgerState) =>
            logger?.trace({
              ledgerStateChanged: {
                ledgerState: {
                  ...ledgerState,
                  state: ledgerState.state === Invoice.State.PAID ? 'paid' : 'unpaid',
                  payee: toHex(ledgerState.payee),
                },
              },
            }),
          ),
        ),
        from(providers.privateStateProvider.get(invoicePrivateStateKey) as Promise<InvoicePrivateState>),
      ],
      (ledgerState, privateState) => {
        const hashedSecretKey = Invoice.pureCircuits.publicKey(privateState.secretKey);

        return {
          state: ledgerState.state,
          amount: ledgerState.amount,
          description: ledgerState.description,
          payee: toHex(ledgerState.payee),
          payer: toHex(ledgerState.payer),
          isPayee: toHex(ledgerState.payee) === toHex(hashedSecretKey),
        };
      },
    );
  }

  readonly deployedContractAddress: ContractAddress;
  readonly state$: Observable<InvoiceDerivedState>;

  async pay(): Promise<void> {
    this.logger?.info('payingInvoice');
    const txData = await this.deployedContract.callTx.pay();
    this.logger?.trace({
      transactionAdded: {
        circuit: 'pay',
        txHash: txData.public.txHash,
        blockHeight: txData.public.blockHeight,
      },
    });
  }

  static async deploy(providers: InvoiceProviders, invAmount: bigint, invDescription: string, logger?: Logger): Promise<InvoiceAPI> {
    logger?.info('deployContract');

    const deployedInvoiceContract = await deployContract(providers, {
      compiledContract: CompiledInvoiceContractContract,
      privateStateId: invoicePrivateStateKey,
      initialPrivateState: createInvoicePrivateState(utils.randomBytes(32)),
      args: [invAmount, invDescription],
    });

    logger?.trace({
      contractDeployed: {
        finalizedDeployTxData: deployedInvoiceContract.deployTxData.public,
      },
    });

    return new InvoiceAPI(deployedInvoiceContract, providers, logger);
  }

  static async join(providers: InvoiceProviders, contractAddress: ContractAddress, logger?: Logger): Promise<InvoiceAPI> {
    logger?.info({
      joinContract: { contractAddress },
    });

    const deployedInvoiceContract = await findDeployedContract<InvoiceContract>(providers, {
      contractAddress,
      compiledContract: CompiledInvoiceContractContract,
      privateStateId: invoicePrivateStateKey,
      initialPrivateState: await InvoiceAPI.getPrivateState(providers, contractAddress),
    });

    logger?.trace({
      contractJoined: {
        finalizedDeployTxData: deployedInvoiceContract.deployTxData.public,
      },
    });

    return new InvoiceAPI(deployedInvoiceContract, providers, logger);
  }

  private static async getPrivateState(
    providers: InvoiceProviders,
    contractAddress: ContractAddress,
  ): Promise<InvoicePrivateState> {
    providers.privateStateProvider.setContractAddress(contractAddress);
    const existingPrivateState = await providers.privateStateProvider.get(invoicePrivateStateKey);
    return existingPrivateState ?? createInvoicePrivateState(utils.randomBytes(32));
  }
}

export * as utils from './utils/index.js';
export * from './common-types.js';
