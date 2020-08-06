import ETHWallet from "./ethWallet";
import MYContract from "./snsToken"
import SyntheticAssets from "./snsSyntheticAssets"
import Decimal from "decimal.js"

import {onChainCall, offChainCall} from "./common";
import {syntheticAddr} from "./constant";

let myToken = null
let syntheticAssetsList = {}

let tokenDecimals = new Decimal(10).pow(MYContract.decimals)

let lastMintingRate = 0

function loadTOKEN() {
  if(myToken === null) {
    let web3Instance = ETHWallet.getWeb3Instance()
    myToken = new web3Instance.eth.Contract(MYContract.abi, MYContract.getAddress())
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
    myToken,
    ETHWallet.getAccount(),
    "approve",
    [synAssetsAddress, amount],
  )
}

async function disableSynthetic(synAssetsAddress, amount) {
  if(!ETHWallet.isConnected()) {
    return
  }

  if(!myToken) {
    loadTOKEN()
  }

  return commonApprove(synAssetsAddress, "0")
}

async function enableSynthetic(synAssetsAddress) {
  if(!ETHWallet.isConnected()) {
    return
  }

  if(!myToken) {
    loadTOKEN()
  }

  Decimal.set({ toExpPos: 256 })
  let maxApprove = new Decimal("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")
  return commonApprove(synAssetsAddress, maxApprove.toString())
}

async function commonERC20Balance(contract, address, outDecimal) {
  let result = await offChainCall(contract, address, "balanceOf", [address])
  if(result !== null) {
    result = new Decimal(result).div(tokenDecimals)
    return outDecimal ? result:result.toDP(6, Decimal.ROUND_DOWN)
  } else {
    return null
  }
}

async function tokenBalance(outDecimal = false) {
  if(!ETHWallet.isConnected()) {
    return null
  }

  if(!myToken) {
    loadTOKEN()
  }

  return  await commonERC20Balance(myToken, ETHWallet.getAccount(), outDecimal)
}

async function synAssetsBalance(synAddress, outDecimal = false) {
  let synAssets = getSynAssets(synAddress)
  if(!synAssets) {
    return
  }

  return  await commonERC20Balance(synAssets, ETHWallet.getAccount(), outDecimal)
}

async function lockedTOKENFor(synAddress, outDecimal = false) {
  let synAssets = getSynAssets(synAddress)
  if(!synAssets) {
    return
  }

  let address = ETHWallet.getAccount()
  let result = await offChainCall(synAssets, address, "lockedSNS", [address])
  if(result !== null) {
    result = new Decimal(result).div(tokenDecimals)

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
  let outAmount = new Decimal(synAmount).mul(tokenDecimals)

  Decimal.set({ toExpPos: 256 })

  outAmount =  outAmount.trunc().toString()

  let ret = await onChainCall(
    synAssets,
    ETHWallet.getAccount(),
    "mint",
    [outAmount],
  ).catch(e=>{
    return null
  })

  return ret
}

async function redeem(synAddress, tokenAmount) {
  if(!ETHWallet.isConnected()) {
    return null
  }

  let synAssets = getSynAssets(synAddress)
  Decimal.set({ toExpPos: 256 })
  tokenAmount = new Decimal(tokenAmount).mul(tokenDecimals)

  return await onChainCall(
    synAssets,
    ETHWallet.getAccount(),
    "redeem",
    [tokenAmount.toString()],
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

async function load(tokenAddress) {
  MYContract.setTokenAddress(tokenAddress)
  return ETHWallet.loadWallet()
}

async function verifyUnlock(synAddr, unlockTOKEN) {
  let lockedAmount = await lockedTOKENFor(syntheticAddr, true)
  if(lockedAmount === null) {
    return "Can't get locked SNS amount."
  }

  if(!lockedAmount.gte(unlockTOKEN)) {
    return "SNS unlocked amount exceeds the locked."
  }

  let synBalance = await synAssetsBalance(synAddr, true)
  if(!synBalance) {
    return "Can't get sETH balance."
  }

  let mintingRate = await currentMintingRate(synAddr, true)
  if(!mintingRate) {
    return "Can't get current burn ratio."
  }

  let amountToBurn = new Decimal(unlockTOKEN).div(mintingRate)
  if(!synBalance.gte(amountToBurn)) {
    return "sETH insufficient"

  }

  return true
}

async function hasEnoughToLock(synAddr, targetAmount) {
  let token = await tokenBalance(true)
  if(!token) {
    return false
  }

  let mintingRate = await currentMintingRate(synAddr, true)
  if(!mintingRate) {
    return false
  }

  let amountToLock = new Decimal(targetAmount).mul(mintingRate)
  return token.gte(amountToLock)
}

async function syntheticEnabled(synAddr) {
  if(!myToken) {
    loadTOKEN()
  }

  let address = ETHWallet.getAccount()
  let result = await offChainCall(myToken, address, "allowance", [address, synAddr])

  if(result !== null) {
    let amount = new Decimal(result).div(tokenDecimals)
    return amount.gt(0)
  } else {
    return false
  }
}

async function tokenToSyn(synAddr, tokenAmount, fast = true) {
  if(fast && lastMintingRate !== 0) {
    return new Decimal(tokenAmount).div(lastMintingRate).toDP(6, Decimal.ROUND_DOWN).toString()
  }

  let mintingRate = await currentMintingRate(synAddr)
  if(!mintingRate) {
    return "0"
  }

  return new Decimal(tokenAmount).div(mintingRate).toDP(6, Decimal.ROUND_DOWN).toString()
}

async function synToToken(synAddr, synAmount, fast = true) {
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
  tokenBalance,
  synAssetsBalance,
  currentMintingRate,
  lockedTOKENFor,

  enableSynthetic,
  syntheticEnabled,
  disableSynthetic,

  mint,
  redeem,

  verifyUnlock,
  hasEnoughToLock,

  tokenToSyn,
  synToToken,
}
