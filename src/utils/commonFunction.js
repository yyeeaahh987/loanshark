import { getAddress } from '@ethersproject/address'
import mainnet from "../token/mainnet.json"
import polygon from "../token/polygon.json"

export function toDecimalNumber(number, decimalPlace) {
    return Number.parseFloat(number).toFixed(decimalPlace);
}

export function getToken() {
    let resultTokenList = []
    resultTokenList = resultTokenList.concat(mainnet, polygon)
    return resultTokenList
}

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value) {
    
    try {
        console.log(getAddress(value))
        return getAddress(value)
    } catch (e){
        console.error(e)
        return false
    }
}