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
export const CHANGE_MY_USDT_CONTRACT = 'CHANGE_MY_USDT_CONTRACT';
export const CHANGE_PRICE_OF_ETH = 'CHANGE_PRICE_OF_ETH';
export const CHANGE_PRICE_OF_BTC = 'CHANGE_PRICE_OF_BTC';
export const CHANGE_ProviderAAVEAVAX = 'CHANGE_ProviderAAVEAVAX';
export const CHANGE_INPUT_ETH_DEPOSIT = 'CHANGE_INPUT_ETH_DEPOSIT';
export const CHANGE_INPUT_BTC_DEBT = 'CHANGE_INPUT_BTC_DEBT';

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
export function changeMyUsdtContract(payload) {
  return {type: CHANGE_MY_USDT_CONTRACT,payload};
}
export function changePriceOfEth(payload) {
  return {type: CHANGE_PRICE_OF_ETH,payload};
}
export function changePriceOfBtc(payload) {
  return {type: CHANGE_PRICE_OF_BTC,payload};
}
export function changeProviderAAVEAVAX(payload) {
  return {type: CHANGE_ProviderAAVEAVAX,payload};
}
export function changeInputEthDeposit(payload) {
  return {type: CHANGE_INPUT_ETH_DEPOSIT,payload};
}
export function changeInputBtcDebt(payload) {
  return {type: CHANGE_INPUT_BTC_DEBT,payload};
}