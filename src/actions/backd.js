export const CHANGE_LP_POOL_BTC = 'CHANGE_LP_POOL_BTC';
export const CHANGE_LP_POOL_ETH = 'CHANGE_LP_POOL_ETH';
export const CHANGE_LP_TOKEN_BTC = 'CHANGE_LP_TOKEN_BTC';
export const CHANGE_LP_TOKEN_ETH = 'CHANGE_LP_TOKEN_ETH';
export const CHANGE_VAULT_BTC = 'CHANGE_VAULT_BTC';
export const CHANGE_VAULT_ETH = 'CHANGE_VAULT_ETH';
export const CHANGE_TOPUP_ACTION = 'CHANGE_TOPUP_ACTION';
export const CHANGE_GAS_BANK = 'CHANGE_GAS_BANK';
export const CHANGE_MY_BTC_LP_AMOUNT = 'CHANGE_MY_BTC_LP_AMOUNT';
export const CHANGE_MY_ETH_LP_AMOUNT = 'CHANGE_MY_ETH_LP_AMOUNT';
export const CHANGE_TOTAL_BTC_LP_AMOUNT = 'CHANGE_TOTAL_BTC_LP_AMOUNT';
export const CHANGE_TOTAL_ETH_LP_AMOUNT = 'CHANGE_TOTAL_ETH_LP_AMOUNT';
export const CHANGE_BTC_LP_EXCHANGE_RATE = 'CHANGE_BTC_LP_EXCHANGE_RATE';
export const CHANGE_ETH_LP_EXCHANGE_RATE = 'CHANGE_ETH_LP_EXCHANGE_RATE';
export const CHANGE_MY_PROTECTION = 'CHANGE_MY_PROTECTION';
export const CHANGE_MY_PROTECTION_ETH = 'CHANGE_MY_PROTECTION_ETH';
export const CHANGE_MY_GAS_BANK_BALANCE = 'CHANGE_MY_GAS_BANK_BALANCE';

export function changeLpPoolBtc(payload) {
  return {type: CHANGE_LP_POOL_BTC,payload};
}
export function changeLpPoolEth(payload) {
  return {type: CHANGE_LP_POOL_ETH,payload};
}
export function changeLpTokenBtc(payload) {
  return {type: CHANGE_LP_TOKEN_BTC,payload};
}
export function changeLpTokenEth(payload) {
  return {type: CHANGE_LP_TOKEN_ETH,payload};
}
export function changeVaultBtc(payload) {
  return {type: CHANGE_VAULT_BTC,payload};
}
export function changeVaultEth(payload) {
  return {type: CHANGE_VAULT_ETH,payload};
}
export function changeTopupAction(payload) {
  return {type: CHANGE_TOPUP_ACTION,payload};
}
export function changeGasBank(payload) {
  return {type: CHANGE_GAS_BANK,payload};
}
export function changeMyBtcLpAmount(payload) {
  return {type: CHANGE_MY_BTC_LP_AMOUNT,payload};
}
export function changeMyEthLpAmount(payload) {
  return {type: CHANGE_MY_ETH_LP_AMOUNT,payload};
}
export function changeTotalBtcLpAmount(payload) {
  return {type: CHANGE_TOTAL_BTC_LP_AMOUNT,payload};
}
export function changeTotalEthLpAmount(payload) {
  return {type: CHANGE_TOTAL_ETH_LP_AMOUNT,payload};
}
export function changeBtcLpExchangeRateAmount(payload) {
  return {type: CHANGE_BTC_LP_EXCHANGE_RATE,payload};
}
export function changeEthLpExchangeRateAmount(payload) {
  return {type: CHANGE_ETH_LP_EXCHANGE_RATE,payload};
}
export function changeMyProtection(payload) {
  return {type: CHANGE_MY_PROTECTION,payload};
}
export function changeMyProtectionEth(payload) {
  return {type: CHANGE_MY_PROTECTION_ETH,payload};
}
export function changeMyGasBankBalance(payload) {
  return {type: CHANGE_MY_GAS_BANK_BALANCE,payload};
}