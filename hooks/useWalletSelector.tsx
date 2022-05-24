import React, { useEffect, useState } from 'react';
// import NearWalletSelector, { AccountInfo } from '@near-wallet-selector/core';
// import { setupNearWallet } from '@near-wallet-selector/near-wallet';
import { setupSender } from '@near-wallet-selector/sender';
import { setupLedger } from '@near-wallet-selector/ledger';
import { setupMathWallet } from '@near-wallet-selector/math-wallet';
import dynamic from 'next/dynamic';
// import { Account } from '../interfaces';

const NearWalletSelector = dynamic(
  () => import('@near-wallet-selector/core/') as unknown as any,
  {
    ssr: false,
  }
);
// const AccountInfo = dynamic(
//   () => import('@near-wallet-selector/core/lib/wallet/wallet') as any,
//   {
//     ssr: false,
//   }
// );
const setupNearWallet = dynamic(
  () => import('@near-wallet-selector/near-wallet/src/lib/near-wallet') as any,
  {
    ssr: false,
  }
);

function useWalletSelector() {
  const [selector, setSelector] = useState<any>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  // const [accounts, setAccounts] = useState<Array<AccountInfo>>([]);

  // const syncAccountState = (
  //   currentAccountId: string | null,
  //   newAccounts: Array<AccountInfo>
  // ) => {
  //   if (!newAccounts.length) {
  //     localStorage.removeItem('accountId');
  //     setAccountId(null);
  //     setAccounts([]);

  //     return;
  //   }

  //   const validAccountId =
  //     currentAccountId &&
  //     newAccounts.some((x) => x.accountId === currentAccountId);
  //   const newAccountId = validAccountId
  //     ? currentAccountId
  //     : newAccounts[0].accountId;

  //   localStorage.setItem('accountId', newAccountId);
  //   setAccountId(newAccountId);
  //   setAccounts(newAccounts);
  // };
  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const selector = await NearWalletSelector.init({
      network: 'testnet',
      contractId: 'skiran017.testnet',
      wallets: [
        setupNearWallet,
        // setupSender(),
        // setupLedger(),
        // setupMathWallet(),
      ],
    })
      .then((instance: any) => {
        return instance.getAccounts().then(async (newAccounts: any) => {
          // syncAccountState(localStorage.getItem('accountId'), newAccounts);
          // eslint-disable-next-line
          // @ts-ignore-next-line
          window.selector = instance;
          setSelector(instance);
        });
      })
      .catch((err: any) => {
        console.error(err);
        alert('Failed to initialise wallet selector');
      });
    setSelector(selector);
  };

  // useEffect(() => {
  //   if (!selector) {
  //     return;
  //   }

  //   const subscription = selector.on('accountsChanged', (e: any) => {
  //     syncAccountState(accountId, e.accounts);
  //   });

  //   return () => subscription.remove();
  // }, [selector, accountId]);

  return { selector, accountId };
}

export default useWalletSelector;
