import React, { useEffect, useState } from 'react';
import {
  WalletConnection,
  Contract,
  ConnectedWalletAccount,
} from 'near-api-js';
import { getIncomingStreams, createStream } from '@roketo/sdk';
import type { Action as NearAction } from 'near-api-js/lib/transaction';
import { FTContract, RoketoContract, TransactionMediator } from '@roketo/sdk/dist/types';

import defaultCat from './img/defaultCat.png';
import fedCat from './img/fedCat.png';
import hungryCat from './img/hungryCat.png';

const FEEDING_SPEED_THRESHOLD = 10000;

export interface IAppProps {
  account: ConnectedWalletAccount;
  contract: RoketoContract;
  transactionMediator: TransactionMediator<NearAction>;
  roketoContractName: string;
  financeContractName: string;
  wNearContractName: string;
  walletConnection: WalletConnection;
}

function App({
  account,
  contract,
  transactionMediator,
  roketoContractName,
  financeContractName,
  wNearContractName,
  walletConnection,
}: IAppProps) {
  const isLoggedIn = Boolean(account.accountId);

  const [catImage, setCatImage] = useState(defaultCat);

  const [feedingSpeed, setFeedingSpeed] = useState<number | null>(null);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const streams = await getIncomingStreams({
        from: 0,
        limit: 500,
        accountId: 'cat.lebedev.testnet',
        contract,
      });

      const currentFeedingSpeed = streams.reduce((speed, { tokens_per_sec }) => speed + Number(tokens_per_sec), 0);

      setCatImage((currentCat) => {
        if (currentCat !== defaultCat) {
          return defaultCat;
        } else {
          return currentFeedingSpeed >= FEEDING_SPEED_THRESHOLD ? fedCat : hungryCat;
        }
      });

      setFeedingSpeed(currentFeedingSpeed);
    }, 2000);

    return () => clearInterval(intervalId);
  }, [contract]);

  const handleClick = async () => {
    if (!isLoggedIn) {
      await walletConnection.requestSignIn(roketoContractName, 'Feed-a-cat');
    } else {
      const fishTokenAccountId = 'fish.lebedev.testnet';

      const fishContract = new Contract(account, fishTokenAccountId, {
        viewMethods: ['ft_balance_of', 'ft_metadata', 'storage_balance_of'],
        changeMethods: ['ft_transfer_call', 'storage_deposit', 'near_deposit'],
      }) as FTContract;

      await createStream({
        comment: '',
        deposit: '1000000',
        commissionOnCreate: '0',
        receiverId: 'cat.lebedev.testnet',
        tokenAccountId: fishTokenAccountId,
        tokensPerSec: '1000',
        color: null,
        accountId: account.accountId,
        tokenContract: fishContract,
        transactionMediator,
        roketoContractName,
        wNearId: wNearContractName,
        financeContractName,
      });
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={catImage} className="cat" alt="cat" />
        <p>
          <a href="https://github.com/roke-to/roketo-sdk-sample#how-to-feed-the-cat">The guide to cat feeding.</a>
        </p>
        {feedingSpeed !== null ? (
          <>
            <p>Current feeding speed is {feedingSpeed}/{FEEDING_SPEED_THRESHOLD} FISH tokens per second.</p>
            <p>{feedingSpeed > FEEDING_SPEED_THRESHOLD ? 'The cat is fed.' : 'The cat is hungry.'}</p>
          </>
        ) : (
          <p>Loading...</p>
        )}
        <button onClick={handleClick}>
          {isLoggedIn ? 'Feed the cat 1000 FISH tokens per second' : 'Log in'}
        </button>
      </header>
    </div>
  );
}

export default App;
