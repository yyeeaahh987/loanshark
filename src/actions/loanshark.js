export const CHANGE_MY_ACCOUNT = 'CHANGE_MY_ACCOUNT';
export const CHANGE_NUMBER_OF_ETH = 'CHANGE_NUMBER_OF_ETH';
export const CHANGE_USER_DEPOSIT_BALANCE = 'CHANGE_USER_DEPOSIT_BALANCE';
export const CHANGE_USER_DEBT_BALANCE = 'CHANGE_USER_DEBT_BALANCE';
export const CHANGE_MY_FUJI_VALUT_ETHBTC = 'CHANGE_MY_FUJI_VALUT_ETHBTC';
export const CHANGE_MY_FLIQUIDATORAVAX = 'CHANGE_MY_FLIQUIDATORAVAX';
export const CHANGE_MY_FUJI_CONTROLLER = 'CHANGE_MY_FUJI_CONTROLLER';
export const CHANGE_MY_FUJI_ORACLE = 'CHANGE_MY_FUJI_ORACLE';
export const CHANGE_MY_ETH_CONTRACT = 'CHANGE_MY_ETH_CONTRACT';
export const CHANGE_MY_BTC_CONTRACT = 'CHANGE_MY_BTC_CONTRACT';

export function changeMyAccount(payload) {
  return {type: CHANGE_MY_ACCOUNT,payload};
}
export function changeNumberOfEth(payload) {
  return {type: CHANGE_NUMBER_OF_ETH,payload};
}
export function changeUserDepositBalance(payload) {
  return {type: CHANGE_USER_DEPOSIT_BALANCE,payload};
}
export function changeUserDebtBalance(payload) {
  return {type: CHANGE_USER_DEBT_BALANCE,payload};
}
export function changeMyFujiVaultETHBTC(payload) {
  return {type: CHANGE_MY_FUJI_VALUT_ETHBTC,payload};
}
export function changeMyFliquidatorAvax(payload) {
  return {type: CHANGE_MY_FLIQUIDATORAVAX,payload};
}
export function changeMyFujiController(payload) {
  return {type: CHANGE_MY_FUJI_CONTROLLER,payload};
}
export function changeMyFujiOracle(payload) {
  return {type: CHANGE_MY_FUJI_ORACLE,payload};
}
export function changeMyEthContract(payload) {
  return {type: CHANGE_MY_ETH_CONTRACT,payload};
}
export function changeMyBtcContract(payload) {
  return {type: CHANGE_MY_BTC_CONTRACT,payload};
}
