import React, { useCallback, useEffect, useState } from 'react';
import { type ContractAddress } from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';
import {
  Backdrop,
  CircularProgress,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Skeleton,
  Typography,
  Button,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import CopyIcon from '@mui/icons-material/ContentPasteOutlined';
import StopIcon from '@mui/icons-material/HighlightOffOutlined';
import PaymentIcon from '@mui/icons-material/Payment';
import { type InvoiceDerivedState, type DeployedInvoiceAPI } from '../../../api/src/index.js';
import { type InvoiceDeployment } from '../contexts/BrowserDeployedInvoiceManager';
import { type Observable } from 'rxjs';
import { State } from '../../../contract/src/index.js';

export interface InvoiceProps {
  invoiceDeployment$?: Observable<InvoiceDeployment>;
}

export const Invoice: React.FC<Readonly<InvoiceProps>> = ({ invoiceDeployment$ }) => {
  const [invoiceDeployment, setInvoiceDeployment] = useState<InvoiceDeployment>();
  const [deployedInvoiceAPI, setDeployedInvoiceAPI] = useState<DeployedInvoiceAPI>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [invoiceState, setInvoiceState] = useState<InvoiceDerivedState>();
  const [isWorking, setIsWorking] = useState(!!invoiceDeployment$);

  const onPayInvoice = useCallback(async () => {
    try {
      if (deployedInvoiceAPI) {
        setIsWorking(true);
        await deployedInvoiceAPI.pay();
      }
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setIsWorking(false);
    }
  }, [deployedInvoiceAPI, setErrorMessage, setIsWorking]);

  const onCopyContractAddress = useCallback(async () => {
    if (deployedInvoiceAPI) {
      await navigator.clipboard.writeText(deployedInvoiceAPI.deployedContractAddress);
    }
  }, [deployedInvoiceAPI]);

  useEffect(() => {
    if (!invoiceDeployment$) {
      return;
    }
    const subscription = invoiceDeployment$.subscribe(setInvoiceDeployment);
    return () => subscription.unsubscribe();
  }, [invoiceDeployment$]);

  useEffect(() => {
    if (!invoiceDeployment) {
      return;
    }
    if (invoiceDeployment.status === 'in-progress') {
      return;
    }

    setIsWorking(false);

    if (invoiceDeployment.status === 'failed') {
      setErrorMessage(
        invoiceDeployment.error.message.length ? invoiceDeployment.error.message : 'Encountered an unexpected error.',
      );
      return;
    }

    setDeployedInvoiceAPI(invoiceDeployment.api);
    const subscription = invoiceDeployment.api.state$.subscribe(setInvoiceState);
    return () => {
      subscription.unsubscribe();
    };
  }, [invoiceDeployment, setIsWorking, setErrorMessage, setDeployedInvoiceAPI]);

  return (
    <Card sx={{ position: 'relative', minWidth: 400, margin: '0 auto', mt: 10, p: 2 }} color="primary">
      {invoiceDeployment$ && (
        <React.Fragment>
          <Backdrop
            sx={{ position: 'absolute', color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isWorking}
          >
            <CircularProgress />
          </Backdrop>
          <Backdrop
            sx={{ position: 'absolute', color: '#ff0000', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={!!errorMessage}
            onClick={() => setErrorMessage(undefined)}
          >
            <StopIcon fontSize="large" sx={{ mr: 1 }} />
            <Typography component="div">{errorMessage}</Typography>
          </Backdrop>
          <CardHeader
            avatar={
              invoiceState ? (
                invoiceState.state === State.PAID ? (
                  <LockOpenIcon color="success" />
                ) : (
                  <LockIcon color="warning" />
                )
              ) : (
                <Skeleton variant="circular" width={20} height={20} />
              )
            }
            titleTypographyProps={{ color: 'primary', variant: 'h6' }}
            title={toShortFormatContractAddress(deployedInvoiceAPI?.deployedContractAddress) ?? 'Loading...'}
            action={
              deployedInvoiceAPI?.deployedContractAddress ? (
                <IconButton title="Copy contract address" onClick={onCopyContractAddress}>
                  <CopyIcon fontSize="small" />
                </IconButton>
              ) : (
                <Skeleton variant="circular" width={20} height={20} />
              )
            }
          />
          <CardContent>
            {invoiceState ? (
              <React.Fragment>
                <Typography variant="h4" gutterBottom>
                  ${invoiceState.amount.toString()}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {invoiceState.description}
                </Typography>
                <Typography variant="subtitle2" sx={{ mt: 2 }}>
                  Status: {invoiceState.state === State.PAID ? 'PAID' : 'UNPAID'}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Payee: {invoiceState.payee.substring(0, 10)}...
                </Typography>
                {invoiceState.state === State.PAID && (
                  <Typography variant="body2" color="success.main">
                    Payer: {invoiceState.payer.substring(0, 10)}...
                  </Typography>
                )}
              </React.Fragment>
            ) : (
              <Skeleton variant="rectangular" width="100%" height={160} />
            )}
          </CardContent>
          <CardActions>
            {deployedInvoiceAPI ? (
              <Button
                variant="contained"
                startIcon={<PaymentIcon />}
                disabled={invoiceState?.state === State.PAID}
                onClick={onPayInvoice}
                fullWidth
              >
                {invoiceState?.state === State.PAID ? 'Already Paid' : 'Pay Invoice'}
              </Button>
            ) : (
              <Skeleton variant="rectangular" width="100%" height={40} />
            )}
          </CardActions>
        </React.Fragment>
      )}
    </Card>
  );
};

const toShortFormatContractAddress = (contractAddress: ContractAddress | undefined): React.ReactElement | undefined =>
  contractAddress ? (
    <span>
      0x{contractAddress?.replace(/^[A-Fa-f0-9]{6}([A-Fa-f0-9]{8}).*([A-Fa-f0-9]{8})$/g, '$1...$2')}
    </span>
  ) : undefined;
