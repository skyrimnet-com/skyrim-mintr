import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from "web3";

let provider = null
let web3Instance = null

async function loadWallet() {
  provider = await detectEthereumProvider();

  if (provider) {
    if (provider !== window.ethereum) {
      console.error('Do you have multiple wallets installed?');
      return null
    }

    setupEventHandler()
    web3Instance = new Web3(provider)
    return window.ethereum
  } else {
    return null
  }
}

let currentChainId = null;
let currentAccount = null;

function setupEventHandler() {
  currentChainId = ethereum.chainId

  ethereum.on('chainChanged', handleChainChanged);

  function handleChainChanged(_chainId) {
    // We recommend reloading the page, unless you must do otherwise
    window.location.reload();
  }

  ethereum
    .request({ method: 'eth_accounts' })
    .then(handleAccountsChanged)
    .catch((err) => {
      // Some unexpected error.
      // For backwards compatibility reasons, if no accounts are available,
      // eth_accounts will return an empty array.
      console.error(err);
    });


  ethereum.on('accountsChanged', handleAccountsChanged);
}

function handleAccountsChanged(accounts) {
  if (accounts.length === 0) {
    currentAccount = null
  } else if (accounts[0] !== currentAccount) {
    currentAccount = accounts[0];
  }

  return currentAccount
}

async function connect() {
  return ethereum
    .request({ method: 'eth_requestAccounts' })
    .then((accounts)=>{return handleAccountsChanged(accounts)})
    .catch((err) => {
      if (err.code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        console.log('Please connect to MetaMask.');
      } else {
        console.error(err);
      }

      return null
    });
}

function isConnected() {
  return !!currentAccount
}

function getAccount() {
  return currentAccount
}

function getWeb3Instance() {
  return web3Instance
}

export default {
  loadWallet,
  connect,
  isConnected,
  getWeb3Instance,
  getAccount,
}
