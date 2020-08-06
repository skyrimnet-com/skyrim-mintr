let transactionResultGetter = function (resolve, err, data) {
  let result = null
  if(!err) {
    result = data
  }

  resolve(result)
}

function getContractMethod(contract, methodName, param) {
  let method = contract.methods[methodName]
  if(!method) {
    return null
  }

  let prop = method(...param)._method

  return {
    prop: prop,
    func: method
  }
}

async function onChainCall(contract, from, methodName, param, amount, gasLimit, gasPrice) {
  param = param || []

  let method = getContractMethod(contract, methodName, param)
  if(!method) {
    return null
  }

  let sendParam = {
    from: from,
    gasPrice: gasPrice,
    gas: gasLimit
  }

  if(method.prop.payable) {
    sendParam.value = web3.toWei(amount)
  }

  return await new Promise(rs => {
    method.func(...param)
      .send(sendParam, (err, tx) =>  {
        transactionResultGetter(rs, err, tx)
      })
      .catch(e=>{
        transactionResultGetter(rs, e, null)
      })
  })
}

async function offChainCall(contract, from, methodName, param = []) {
  param = param || []

  let method = getContractMethod(contract, methodName, param)
  if(!method) {
    return null
  }

  return  await new Promise(resolve => {
    method.func(...param).call({from: from}, (err, result) => {
      transactionResultGetter(resolve, err, result)
    }).catch(reason => {
      transactionResultGetter(resolve, reason, null)
    })
  })
}

export {
  onChainCall,
  offChainCall,
}
