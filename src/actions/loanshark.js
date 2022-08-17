export const RESET = 'RESET';
export const CHANGE_MY_ACCOUNT = 'CHANGE_MY_ACCOUNT';
export const CHANGE_SELECTED_PAIR = 'CHANGE_SELECTED_PAIR';
export const CHANGE_NUMBER_OF_ETH = 'CHANGE_NUMBER_OF_ETH';
export const CHANGE_NUMBER_OF_AVAX = 'CHANGE_NUMBER_OF_AVAX';
export const CHANGE_AAVE_BTC_BORROW_RATE = 'CHANGE_AAVE_BTC_BORROW_RATE';
export const CHANGE_USER_DEPOSIT_BALANCE_ETH = 'CHANGE_USER_DEPOSIT_BALANCE_ETH';
export const CHANGE_USER_DEPOSIT_BALANCE_AVAX = 'CHANGE_USER_DEPOSIT_BALANCE_AVAX';
export const CHANGE_USER_DEBT_BALANCE_BTC = 'CHANGE_USER_DEBT_BALANCE_BTC';
export const CHANGE_USER_DEBT_BALANCE_USDT = 'CHANGE_USER_DEBT_BALANCE_USDT';
export const CHANGE_MY_FUJI_VALUT_ETHBTC = 'CHANGE_MY_FUJI_VALUT_ETHBTC';
export const CHANGE_MY_FUJI_VALUT_AVAXUSDT = 'CHANGE_MY_FUJI_VALUT_AVAXUSDT';
export const CHANGE_MY_FLIQUIDATORAVAX = 'CHANGE_MY_FLIQUIDATORAVAX';
export const CHANGE_MY_FUJI_CONTROLLER = 'CHANGE_MY_FUJI_CONTROLLER';
export const CHANGE_MY_FUJI_ORACLE = 'CHANGE_MY_FUJI_ORACLE';
export const CHANGE_MY_SMART_VAULT_BTC = 'CHANGE_MY_SMART_VAULT_BTC';
export const CHANGE_MY_SMART_VAULT_USDT = 'CHANGE_MY_SMART_VAULT_USDT';
export const CHANGE_MY_ETH_CONTRACT = 'CHANGE_MY_ETH_CONTRACT';
export const CHANGE_MY_BTC_CONTRACT = 'CHANGE_MY_BTC_CONTRACT';
export const CHANGE_MY_USDT_CONTRACT = 'CHANGE_MY_USDT_CONTRACT';
export const CHANGE_PRICE_OF_ETH = 'CHANGE_PRICE_OF_ETH';
export const CHANGE_PRICE_OF_BTC = 'CHANGE_PRICE_OF_BTC';
export const CHANGE_PRICE_OF_AVAX = 'CHANGE_PRICE_OF_AVAX';
export const CHANGE_PRICE_OF_USDT = 'CHANGE_PRICE_OF_USDT';
export const CHANGE_ProviderAAVEAVAX = 'CHANGE_ProviderAAVEAVAX';
export const CHANGE_ProviderTraderJoe = 'CHANGE_ProviderTraderJoe';
export const CHANGE_SMART_VAULT_BTC = 'CHANGE_SMART_VAULT_BTC';
export const CHANGE_SMART_VAULT_USDT = 'CHANGE_SMART_VAULT_USDT';
export const CHANGE_INPUT_ETH_DEPOSIT = 'CHANGE_INPUT_ETH_DEPOSIT';
export const CHANGE_INPUT_BTC_DEBT = 'CHANGE_INPUT_BTC_DEBT';
export const CHANGE_MY_ETH_AMOUNT = 'CHANGE_MY_ETH_AMOUNT';
export const CHANGE_MY_BTC_AMOUNT = 'CHANGE_MY_BTC_AMOUNT';
export const CHANGE_MY_AVAX_AMOUNT = 'CHANGE_MY_AVAX_AMOUNT';
export const CHANGE_MY_USDT_AMOUNT = 'CHANGE_MY_USDT_AMOUNT';
export const CHANGE_LTV = 'CHANGE_LTV';
export const CHANGE_LIQUDATION_PRICE = 'CHANGE_LIQUDATION_PRICE';

export function reset(payload) {
  return {type: RESET,payload};
}
export function changeMyAccount(payload) {
  return {type: CHANGE_MY_ACCOUNT,payload};
}
export function changeSelectedPair(payload) {
  return {type: CHANGE_SELECTED_PAIR,payload};
}
export function changeNumberOfEth(payload) {
  return {type: CHANGE_NUMBER_OF_ETH,payload};
}
export function changeNumberOfAvax(payload) {
  return {type: CHANGE_NUMBER_OF_AVAX,payload};
}
export function changeAaveBtcBorrowRate(payload) {
  return {type: CHANGE_AAVE_BTC_BORROW_RATE,payload};
}
export function changeUserDepositBalanceEth(payload) {
  return {type: CHANGE_USER_DEPOSIT_BALANCE_ETH,payload};
}
export function changeUserDepositBalanceAvax(payload) {
  return {type: CHANGE_USER_DEPOSIT_BALANCE_AVAX,payload};
}
export function changeUserDebtBalanceBtc(payload) {
  return {type: CHANGE_USER_DEBT_BALANCE_BTC,payload};
}
export function changeUserDebtBalanceUsdt(payload) {
  return {type: CHANGE_USER_DEBT_BALANCE_USDT,payload};
}
export function changeMyFujiVaultETHBTC(payload) {
  return {type: CHANGE_MY_FUJI_VALUT_ETHBTC,payload};
}
export function changeMyFujiVaultAVAXUSDT(payload) {
  return {type: CHANGE_MY_FUJI_VALUT_AVAXUSDT,payload};
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
export function changeMySmartVaultBtc(payload) {
  return {type: CHANGE_MY_SMART_VAULT_BTC,payload};
}
export function changeMySmartVaultUsdt(payload) {
  return {type: CHANGE_MY_SMART_VAULT_USDT,payload};
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
export function changePriceOfAvax(payload) {
  return {type: CHANGE_PRICE_OF_AVAX,payload};
}
export function changePriceOfUsdt(payload) {
  return {type: CHANGE_PRICE_OF_USDT,payload};
}
export function changeProviderAAVEAVAX(payload) {
  return {type: CHANGE_ProviderAAVEAVAX,payload};
}
export function changeProviderTraderJoe(payload) {
  return {type: CHANGE_ProviderTraderJoe,payload};
}
export function changeSmartVaultBtc(payload) {
  return {type: CHANGE_SMART_VAULT_BTC,payload};
}
export function changeSmartVaultUsdt(payload) {
  return {type: CHANGE_SMART_VAULT_USDT,payload};
}
export function changeInputEthDeposit(payload) {
  return {type: CHANGE_INPUT_ETH_DEPOSIT,payload};
}
export function changeInputBtcDebt(payload) {
  return {type: CHANGE_INPUT_BTC_DEBT,payload};
}
export function changeMyETHAmount(payload) {
  return {type: CHANGE_MY_ETH_AMOUNT,payload};
}
export function changeMyBTCAmount(payload) {
  return {type: CHANGE_MY_BTC_AMOUNT,payload};
}
export function changeMyAVAXAmount(payload) {
  return {type: CHANGE_MY_AVAX_AMOUNT,payload};
}
export function changeMyUSDTAmount(payload) {
  return {type: CHANGE_MY_USDT_AMOUNT,payload};
}
export function changeLTV(payload) {
  return {type: CHANGE_LTV,payload};
}
export function changeLiqudationPrice(payload) {
  return {type: CHANGE_LIQUDATION_PRICE,payload};
}