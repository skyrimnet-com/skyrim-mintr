import ETHWallet from "./ethWallet";
import SNSContract from "./snsToken"
import SyntheticAssets from "./snsSyntheticAssets"
import Decimal from "decimal.js"

import {onChainCall, offChainCall} from "./common";
import {syntheticAddr} from "./constant";

let snsToken = null
let syntheticAssetsList = {}

let snsDecimals = new Decimal(10).pow(SNSContract.decimals)

let lastMintingRate = 0

function loadSNS() {
  if(snsToken === null) {
    let web3Instance = ETHWallet.getWeb3Instance()
    snsToken = new web3Instance.eth.Contract(SNSContract.abi, SNSContract.getAddress())
  }
}

function getSynAssets(address) {
  if(!ETHWallet.isConnected()) {
    return null
  }

  let assets = syntheticAssetsList[address]
  if(assets) {
    return assets
  }

  let web3Instance = ETHWallet.getWeb3Instance()
  assets = new web3Instance.eth.Contract(SyntheticAssets.abi, address)

  syntheticAssetsList[address] = assets
  return assets
}

async function commonApprove(synAssetsAddress, amount) {
  return await onChainCall(
    snsToken,
    ETHWallet.getAccount(),
    "approve",
    [synAssetsAddress, amount],
  )
}

async function disableSynthetic(synAssetsAddress, amount) {
  if(!ETHWallet.isConnected()) {
    return
  }

  if(!snsToken) {
    loadSNS()
  }

  return commonApprove(synAssetsAddress, "0")
}

async function enableSynthetic(synAssetsAddress) {
  if(!ETHWallet.isConnected()) {
    return
  }

  if(!snsToken) {
    loadSNS()
  }

  Decimal.set({ toExpPos: 256 })
  let maxApprove = new Decimal("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")
  return commonApprove(synAssetsAddress, maxApprove.toString())
}

async function commonERC20Balance(contract, address, outDecimal) {
  let result = await offChainCall(contract, address, "balanceOf", [address])
  if(result !== null) {
    result = new Decimal(result).div(snsDecimals)
    return outDecimal ? result:result.toDP(6, Decimal.ROUND_DOWN)
  } else {
    return null
  }
}

async function snsBalance(outDecimal = false) {
  if(!ETHWallet.isConnected()) {
    return null
  }

  if(!snsToken) {
    loadSNS()
  }

  return  await commonERC20Balance(snsToken, ETHWallet.getAccount(), outDecimal)
}

async function synAssetsBalance(synAddress, outDecimal = false) {
  let synAssets = getSynAssets(synAddress)
  if(!synAssets) {
    return
  }

  return  await commonERC20Balance(synAssets, ETHWallet.getAccount(), outDecimal)
}

async function lockedSNSFor(synAddress, outDecimal = false) {
  let synAssets = getSynAssets(synAddress)
  if(!synAssets) {
    return
  }

  let address = ETHWallet.getAccount()
  let result = await offChainCall(synAssets, address, "lockedSNS", [address])
  if(result !== null) {
    result = new Decimal(result).div(snsDecimals)

    return outDecimal ? result:result.toDP(6, Decimal.ROUND_DOWN)
  }

  return result
}

async function currentMintingRate(assetAddress, outDecimal = false) {
  if(!ETHWallet.isConnected()) {
    return null
  }

  let synAssets = getSynAssets(assetAddress)
  return await offChainCall(synAssets,
    ETHWallet.getAccount(),
    "mintingRate",
    [])
    .then(r=>{
      let ret = new Decimal(r).div(1e6)
      lastMintingRate = ret.toDP(6, Decimal.ROUND_DOWN)
      return outDecimal ? ret:lastMintingRate
    })

}

async function mint(assetAddress, synAmount) {
  if(!ETHWallet.isConnected()) {
    return null
  }

  let synAssets = getSynAssets(assetAddress)
  let outAmount = new Decimal(synAmount).mul(snsDecimals)

  Decimal.set({ toExpPos: 256 })

  outAmount =  outAmount.trunc().toString()

  return await onChainCall(
    synAssets,
    ETHWallet.getAccount(),
    "mint",
    [outAmount],
  )
}

async function redeem(synAddress, snsAmount) {
  if(!ETHWallet.isConnected()) {
    return null
  }

  let synAssets = getSynAssets(synAddress)
  Decimal.set({ toExpPos: 256 })
  snsAmount = new Decimal(snsAmount).mul(snsDecimals)

  return await onChainCall(
    synAssets,
    ETHWallet.getAccount(),
    "redeem",
    [snsAmount.toString()],
  )
}

async function ethBalance() {
  let address = ETHWallet.getAccount()
  return ETHWallet.getWeb3Instance().eth.getBalance(address)
    .then(r=>{
      return new Decimal(r).div(1e18).toDP(6, Decimal.ROUND_DOWN)
    })
    .catch(_=>{
      return null
    })
}

async function load(snsAddress) {
  SNSContract.setTokenAddress(snsAddress)
  return ETHWallet.loadWallet()
}

async function validUnlock(synAddr, unlockSNS) {
  let lockedAmount = await lockedSNSFor(syntheticAddr, true)
  if(lockedAmount === null) {
    return false
  }

  if(!lockedAmount.gte(unlockSNS)) {
    return false
  }

  let synBalance = await synAssetsBalance(synAddr, true)
  if(!synBalance) {
    return false
  }

  let mintingRate = await currentMintingRate(synAddr, true)
  if(!mintingRate) {
    return false
  }

  let amountToBurn = new Decimal(unlockSNS).div(mintingRate)
  return synBalance.gte(amountToBurn);
}

async function hasEnoughToLock(synAddr, targetAmount) {
  let sns = await snsBalance(true)
  if(!sns) {
    return false
  }

  let mintingRate = await currentMintingRate(synAddr, true)
  if(!mintingRate) {
    return false
  }

  let amountToLock = new Decimal(targetAmount).mul(mintingRate)
  return sns.gte(amountToLock)
}

async function syntheticEnabled(synAddr) {
  if(!snsToken) {
    loadSNS()
  }

  let address = ETHWallet.getAccount()
  let result = await offChainCall(snsToken, address, "allowance", [address, synAddr])
  if(result !== null) {
    let amount = new Decimal(result).div(snsDecimals)
    return amount.gt(0)
  } else {
    return false
  }
}

async function snsToSyn(synAddr, snsAmount, fast = true) {
  if(fast && lastMintingRate !== 0) {
    return new Decimal(snsAmount).div(lastMintingRate).toDP(6, Decimal.ROUND_DOWN).toString()
  }

  let mintingRate = await currentMintingRate(synAddr)
  if(!mintingRate) {
    return "0"
  }

  return new Decimal(snsAmount).div(mintingRate).toDP(6, Decimal.ROUND_DOWN).toString()
}

async function synToSNS(synAddr, synAmount, fast = true) {
  if(fast && lastMintingRate !== 0) {
    return new Decimal(synAmount).mul(lastMintingRate).toDP(6, Decimal.ROUND_DOWN).toString()
  }

  let mintingRate = await currentMintingRate(synAddr)
  if(!mintingRate) {
    return "0"
  }

  return new Decimal(synAmount).mul(mintingRate).toDP(6, Decimal.ROUND_DOWN).toString()
}

export default {
  load,

  ethBalance,
  snsBalance,
  synAssetsBalance,
  currentMintingRate,
  lockedSNSFor,

  enableSynthetic,
  syntheticEnabled,
  disableSynthetic,

  mint,
  redeem,

  validUnlock,
  hasEnoughToLock,

  snsToSyn,
  synToSNS,
}
