// This file is part of midnightntwrk/example-invoice.
// Copyright (C) Midnight Foundation
// SPDX-License-Identifier: Apache-2.0
// Licensed under the Apache License, Version 2.0 (the "License");
// You may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React, { useState } from 'react';
import { type ContractAddress } from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';
import { CardActions, CardContent, IconButton, Tooltip, Typography } from '@mui/material';
import InvoiceAddIcon from '@mui/icons-material/PostAddOutlined';
import CreateInvoiceIcon from '@mui/icons-material/AddCircleOutlined';
import JoinInvoiceIcon from '@mui/icons-material/AddLinkOutlined';
import { TextPromptDialog } from './TextPromptDialog';

/**
 * The props required by the {@link EmptyCardContent} component.
 *
 * @internal
 */
export interface EmptyCardContentProps {
  /** A callback that will be called to create a new bulletin invoice. */
  onCreateInvoiceCallback: () => void;
  /** A callback that will be called to join an existing bulletin invoice. */
  onJoinInvoiceCallback: (contractAddress: ContractAddress) => void;
}

/**
 * Used when there is no invoice deployment to render a UI allowing the user to join or deploy bulletin invoices.
 *
 * @internal
 */
export const EmptyCardContent: React.FC<Readonly<EmptyCardContentProps>> = ({
  onCreateInvoiceCallback,
  onJoinInvoiceCallback,
}) => {
  const [textPromptOpen, setTextPromptOpen] = useState(false);

  return (
    <React.Fragment>
      <CardContent>
        <Typography align="center" variant="h1" color="primary.dark">
          <InvoiceAddIcon fontSize="large" />
        </Typography>
        <Typography data-testid="invoice-posted-message" align="center" variant="body2" color="primary.dark">
          Create a new Invoice, or join an existing one...
        </Typography>
      </CardContent>
      <CardActions disableSpacing sx={{ justifyContent: 'center' }}>
        <Tooltip title="Create a new invoice">
          <IconButton data-testid="invoice-deploy-btn" onClick={onCreateInvoiceCallback}>
            <CreateInvoiceIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Join an existing invoice">
          <IconButton
            data-testid="invoice-join-btn"
            onClick={() => {
              setTextPromptOpen(true);
            }}
          >
            <JoinInvoiceIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
      <TextPromptDialog
        prompt="Enter contract address"
        isOpen={textPromptOpen}
        onCancel={() => {
          setTextPromptOpen(false);
        }}
        onSubmit={(text) => {
          setTextPromptOpen(false);
          onJoinInvoiceCallback(text);
        }}
      />
    </React.Fragment>
  );
};
