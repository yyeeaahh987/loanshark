export const CHANGE_LP_POOL_BTC = 'CHANGE_LP_POOL_BTC';
export const CHANGE_LP_TOKEN_BTC = 'CHANGE_LP_TOKEN_BTC';
export const CHANGE_VAULT_BTC = 'CHANGE_VAULT_BTC';
export const CHANGE_TOPUP_ACTION = 'CHANGE_TOPUP_ACTION';
export const CHANGE_MY_BTC_LP_AMOUNT = 'CHANGE_MY_BTC_LP_AMOUNT';
export const CHANGE_TOTAL_BTC_LP_AMOUNT = 'CHANGE_TOTAL_BTC_LP_AMOUNT';
export const CHANGE_BTC_LP_EXCHANGE_RATE = 'CHANGE_BTC_LP_EXCHANGE_RATE';
export const CHANGE_MY_PROTECTION = 'CHANGE_MY_PROTECTION';

export function changeLpPoolBtc(payload) {
  return {type: CHANGE_LP_POOL_BTC,payload};
}
export function changeLpTokenBtc(payload) {
  return {type: CHANGE_LP_TOKEN_BTC,payload};
}
export function changeVaultBtc(payload) {
  return {type: CHANGE_VAULT_BTC,payload};
}
export function changeTopupAction(payload) {
  return {type: CHANGE_TOPUP_ACTION,payload};
}
export function changeMyBtcLpAmount(payload) {
  return {type: CHANGE_MY_BTC_LP_AMOUNT,payload};
}
export function changeTotalBtcLpAmount(payload) {
  return {type: CHANGE_TOTAL_BTC_LP_AMOUNT,payload};
}
export function changeBtcLpExchangeRateAmount(payload) {
  return {type: CHANGE_BTC_LP_EXCHANGE_RATE,payload};
}
export function changeMyProtection(payload) {
  return {type: CHANGE_MY_PROTECTION,payload};
}