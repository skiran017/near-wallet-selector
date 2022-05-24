import React from 'react';

import { useWalletSelector } from '../contexts/WalletSelectorContext';

function SwapBody() {
  // const { selector, accountId } = useWalletSelector();

  return (
    <>
      <div
        style={{ border: '1px, solid, black', height: '100px', width: '200px' }}
      >
        SwapBody
      </div>
    </>
  );
}

export default SwapBody;
