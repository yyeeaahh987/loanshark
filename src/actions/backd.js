export const CHANGE_LP_POOL_BTC = 'CHANGE_LP_POOL_BTC';
export const CHANGE_LP_TOKEN_BTC = 'CHANGE_LP_TOKEN_BTC';
export const CHANGE_VAULT_BTC = 'CHANGE_VAULT_BTC';
export const CHANGE_TOPUP_ACTION = 'CHANGE_TOPUP_ACTION';

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