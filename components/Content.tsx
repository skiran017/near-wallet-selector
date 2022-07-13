import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { providers, utils } from 'near-api-js';
import type {
  AccountView,
  CodeResult,
} from 'near-api-js/lib/providers/provider';
import { Transaction } from '@near-wallet-selector/core';

import type { Account, Message } from '../interfaces';
import { useWalletSelector } from '../contexts/WalletSelectorContext';
// import { CONTRACT_ID } from '../constants';

const SUGGESTED_DONATION = '0';
// eslint-disable-next-line
const BOATLOAD_OF_GAS = utils.format.parseNearAmount('0.00000000003')!;

const Content: React.FC = () => {
  const { selector, modal, accounts, accountId } = useWalletSelector();
  const [account, setAccount] = useState<Account | null>(null);
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getAccount = useCallback(async (): Promise<Account | null> => {
    if (!accountId) {
      return null;
    }

    const { network } = selector.options;
    const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

    return provider
      .query<AccountView>({
        request_type: 'view_account',
        finality: 'final',
        account_id: accountId,
      })
      .then((data) => ({
        ...data,
        account_id: accountId,
      }));
  }, [accountId, selector.options]);

  // const getMessages = useCallback(() => {
  //   const { network } = selector.options;
  //   const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

  //   return provider
  //     .query<CodeResult>({
  //       request_type: 'call_function',
  //       account_id: CONTRACT_ID,
  //       method_name: 'getMessages',
  //       args_base64: '',
  //       finality: 'optimistic',
  //     })
  //     .then((res) => JSON.parse(Buffer.from(res.result).toString()));
  // }, [selector]);

  // useEffect(() => {
  //   // TODO: don't just fetch once; subscribe!
  //   getMessages().then(setMessages);

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    if (!accountId) {
      return setAccount(null);
    }

    setLoading(true);

    getAccount().then((nextAccount) => {
      setAccount(nextAccount);
      setLoading(false);
    });
  }, [accountId, getAccount]);

  const handleSignIn = () => {
    console.log(modal);
    modal.show();
  };

  const handleSignOut = async () => {
    const wallet = await selector.wallet();

    wallet.signOut().catch((err) => {
      console.log('Failed to sign out');
      console.error(err);
    });
  };

  const handleSwitchWallet = () => {
    modal.show();
  };

  const handleSwitchAccount = () => {
    const currentIndex = accounts.findIndex((x) => x.accountId === accountId);
    const nextIndex = currentIndex < accounts.length - 1 ? currentIndex + 1 : 0;

    const nextAccountId = accounts[nextIndex].accountId;

    selector.setActiveAccount(nextAccountId);

    alert('Switched account to ' + nextAccountId);
  };

  // const handleSubmit = useCallback(
  //   async (e: SubmitEvent) => {
  //     e.preventDefault();

  //     // TODO: Fix the typing so that target.elements exists..
  //     // eslint-disable-next-line
  //     //@typescript-eslint/ban-ts-comment
  //     // @ts-ignore.
  //     const { fieldset, message, donation, multiple } = e.target.elements;

  //     fieldset.disabled = true;

  //     return addMessages(message.value, donation.value || '0', multiple.checked)
  //       .then(() => {
  //         return getMessages()
  //           .then((nextMessages) => {
  //             setMessages(nextMessages);
  //             message.value = '';
  //             donation.value = SUGGESTED_DONATION;
  //             fieldset.disabled = false;
  //             message.focus();
  //           })
  //           .catch((err) => {
  //             alert('Failed to refresh messages');
  //             console.log('Failed to refresh messages');

  //             throw err;
  //           });
  //       })
  //       .catch((err) => {
  //         console.error(err);

  //         fieldset.disabled = false;
  //       });
  //   },
  //   [addMessages, getMessages]
  // );

  if (loading) {
    return null;
  }

  if (!account) {
    return (
      <Fragment>
        <div>
          <button onClick={handleSignIn}>Log in</button>
        </div>
        <div style={{ color: 'white' }}>Click to Login</div>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <div>
        <button onClick={handleSignOut}>Log out</button>
        <button onClick={handleSwitchWallet}>Switch Wallet</button>
        {accounts.length > 1 && (
          <button onClick={handleSwitchAccount}>Switch Account</button>
        )}
      </div>
      {/* <Form
        account={account}
        onSubmit={(e) => handleSubmit(e as unknown as SubmitEvent)}
      />
      <Messages messages={messages} /> */}
    </Fragment>
  );
};

export default Content;
