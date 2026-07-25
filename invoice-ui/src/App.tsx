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
  const [demoPaid, setDemoPaid] = useState(false);

  useEffect(() => {
    if (CONTRACT_ADDRESS === "<" + "YOUR_DEPLOYED_CONTRACT_ADDRESS" + ">") {
      return;
    }
    const deployment = invoiceApiProvider.resolve(CONTRACT_ADDRESS);
    setInvoiceDeployment(deployment);
  }, [invoiceApiProvider]);

  const isPlaceholder = CONTRACT_ADDRESS === "<" + "YOUR_DEPLOYED_CONTRACT_ADDRESS" + ">";

  return (
    <Box sx={{ background: '#090a0f', minHeight: '100vh', color: '#fff', pb: 8 }}>
      <MainLayout>
        {isPlaceholder ? (
          <Box sx={{ maxWidth: 500, mx: 'auto', mt: 6, p: 3, textAlign: 'center' }}>
            <Box
              sx={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 4,
                p: 4,
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#a855f7' }}>
                Preview & Demo Mode
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 3 }}>
                The contract address is set to <code>&lt;YOUR_DEPLOYED_CONTRACT_ADDRESS&gt;</code>. Below is an interactive preview of your Midnight Zero-Knowledge Invoice.
              </Typography>

              <Box
                sx={{
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  borderRadius: 3,
                  p: 3,
                  textAlign: 'left',
                  background: 'rgba(0,0,0,0.4)',
                  mb: 3
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.5)' }}>INVOICE #001</Typography>
                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 2,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: demoPaid ? 'rgba(34, 197, 94, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                      color: demoPaid ? '#22c55e' : '#eab308',
                      border: `1px solid ${demoPaid ? '#22c55e' : '#eab308'}`
                    }}
                  >
                    {demoPaid ? 'PAID' : 'UNPAID'}
                  </Box>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>$1,250.00</Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                  Midnight Privacy DApp Level 1 Challenge Consultation
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255,255,255,0.4)', mb: 0.5 }}>
                  Payee PK: 0x9f8e...4a12 (Protected Witness)
                </Typography>
                {demoPaid && (
                  <Typography variant="caption" sx={{ display: 'block', color: '#22c55e' }}>
                    Payer PK: 0x3b1c...9d81 (Zero-Knowledge Verified)
                  </Typography>
                )}
              </Box>

              <button
                disabled={demoPaid}
                onClick={() => setDemoPaid(true)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: demoPaid ? '#334155' : 'linear-gradient(90deg, #a855f7 0%, #6366f1 100%)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '1rem',
                  cursor: demoPaid ? 'default' : 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {demoPaid ? 'Invoice Paid ✓' : 'Pay Invoice (Simulate ZK Proof)'}
              </button>
            </Box>
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
