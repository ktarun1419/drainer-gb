import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'

import { WagmiConfig } from 'wagmi'

import {  mainnet , bsc } from 'viem/chains'

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = 'bc9d6883c609c7f108a6492128674ec6'

// 2. Create wagmiConfig
const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [mainnet, bsc]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })



// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, chains })
console.log({wagmiConfig})


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
    <WagmiConfig config={wagmiConfig}>
    <App />
    </WagmiConfig>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
