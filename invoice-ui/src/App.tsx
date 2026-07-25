import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { MainLayout } from './components/Layout/MainLayout';
import { Invoice } from './components/Invoice';
import { useDeployedInvoiceContext } from './hooks/useDeployedInvoiceContext';
import { type InvoiceDeployment } from './contexts/BrowserDeployedInvoiceManager';
import { type Observable } from 'rxjs';

// The placeholder required by the Rise In prompt
const CONTRACT_ADDRESS = "<YOUR_DEPLOYED_CONTRACT_ADDRESS>";

const App: React.FC = () => {
  const invoiceApiProvider = useDeployedInvoiceContext();
  const [invoiceDeployment, setInvoiceDeployment] = useState<Observable<InvoiceDeployment> | null>(null);

  useEffect(() => {
    if (CONTRACT_ADDRESS === "<" + "YOUR_DEPLOYED_CONTRACT_ADDRESS" + ">") {
      // Do nothing until address is backfilled
      return;
    }
    const deployment = invoiceApiProvider.resolve(CONTRACT_ADDRESS);
    setInvoiceDeployment(deployment);
  }, [invoiceApiProvider]);

  return (
    <Box sx={{ background: '#000', minHeight: '100vh' }}>
      <MainLayout>
        {CONTRACT_ADDRESS === "<" + "YOUR_DEPLOYED_CONTRACT_ADDRESS" + ">" ? (
          <Box sx={{ color: 'white', p: 4, textAlign: 'center' }}>
            <Typography variant="h4">Deployment Skipped</Typography>
            <Typography sx={{ mt: 2 }}>
              Please manually deploy the contract, copy the address, and replace the placeholder in the code.
            </Typography>
          </Box>
        ) : invoiceDeployment ? (
          <Invoice invoiceDeployment$={invoiceDeployment} />
        ) : (
          <Typography sx={{ color: 'white', p: 4 }}>Loading...</Typography>
        )}
      </MainLayout>
    </Box>
  );
};

export default App;
