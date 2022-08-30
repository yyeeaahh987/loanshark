import { 
  CHANGE_MY_ACCOUNT,
  CHANGE_SELECTED_PAIR,
  CHANGE_NUMBER_OF_ETH, 
  CHANGE_NUMBER_OF_AVAX, 
  CHANGE_AAVE_BTC_BORROW_RATE, 
  CHANGE_USER_DEPOSIT_BALANCE_ETH, 
  CHANGE_USER_DEPOSIT_BALANCE_AVAX,
  CHANGE_USER_DEBT_BALANCE_BTC,
  CHANGE_USER_DEBT_BALANCE_USDT,
  CHANGE_MY_FUJI_VALUT_ETHBTC, 
  CHANGE_MY_FUJI_VALUT_AVAXUSDT,
  CHANGE_MY_FLIQUIDATORAVAX,
  CHANGE_MY_FUJI_CONTROLLER,
  CHANGE_MY_FUJI_ORACLE,
  CHANGE_MY_SMART_VAULT_BTC,
  CHANGE_MY_SMART_VAULT_USDT,
  CHANGE_MY_ETH_CONTRACT,
  CHANGE_MY_BTC_CONTRACT,
  CHANGE_MY_USDT_CONTRACT,
  CHANGE_PRICE_OF_ETH,
  CHANGE_PRICE_OF_BTC,
  CHANGE_PRICE_OF_AVAX,
  CHANGE_PRICE_OF_USDT,
  CHANGE_ProviderAAVEAVAX,
  CHANGE_ProviderTraderJoe,
  CHANGE_INPUT_BTC_DEBT, 
  CHANGE_INPUT_ETH_DEPOSIT,
  CHANGE_SMART_VAULT_BTC,
  CHANGE_SMART_VAULT_USDT,
  CHANGE_MY_ETH_AMOUNT,
  CHANGE_MY_BTC_AMOUNT,
  CHANGE_MY_AVAX_AMOUNT,
  CHANGE_MY_USDT_AMOUNT,
  CHANGE_LTV,
  CHANGE_LIQUDATION_PRICE
} from '../actions/loanshark';

const defaultState = {
  myAccount: null,
  selectedPair: 'ETHBTC',
  numberOfEth: 0,
  numberOfAvax: 0,
  aaveBtcBorrowRate: 0,
  userDepositBalanceEth: 0,
  userDepositBalanceAvax: 0,
  userDebtBalanceBtc: 0,
  userDebtBalanceUsdt: 0,
  myFujiVaultETHBTC: null,
  myFujiVaultAVAXUSDT: null,
  myFliquidatorAVAX: null,
  myFujiController: null,
  myFujiOracle: null,
  mySmartVaultBtc: null,
  mySmartVaultUsdt: null,
  myETHContract: null,
  myBTCContract: null,
  myUSDTContract: null,
  priceOfEth: null,
  priceOfBtc: null,
  priceOfAvax: null,
  priceOfUsdt: null,
  providerAAVEAVAX: null,
  providerTraderJoe: null,
  smartVaultBtc: 0,
  inputBtcDept: 0,
  inputEthDeposit: 0,
  myETHAmount: 0,
  myBTCAmount: 0,
  myAVAXAmount: 0,
  myUSDTAmount: 0,
  LTV: {"ETHBTC": 0, "AVAXUSDT": 0},
  liquidationPrice: {"ETHBTC": 0, "AVAXUSDT": 0},
}

export default function loansharkReducer(state = defaultState, action) {
  switch (action.type) {
    case CHANGE_MY_ACCOUNT:
      return {...state,myAccount: action.payload};
    case CHANGE_SELECTED_PAIR:
      return {...state,selectedPair: action.payload};
    case CHANGE_NUMBER_OF_ETH:
      return {...state,numberOfEth: action.payload};
    case CHANGE_NUMBER_OF_AVAX:
      return {...state,numberOfAvax: action.payload};
    case CHANGE_AAVE_BTC_BORROW_RATE:
      return {...state,aaveBtcBorrowRate: action.payload};
    case CHANGE_USER_DEPOSIT_BALANCE_ETH:
      return {...state,userDepositBalanceEth: action.payload};
    case CHANGE_USER_DEPOSIT_BALANCE_AVAX:
      return {...state,userDepositBalanceAvax: action.payload};
    case CHANGE_USER_DEBT_BALANCE_BTC:
      return {...state,userDebtBalanceBtc: action.payload};
    case CHANGE_USER_DEBT_BALANCE_USDT:
      return {...state,userDebtBalanceUsdt: action.payload};
    case CHANGE_MY_FUJI_VALUT_ETHBTC:
      return {...state,myFujiVaultETHBTC: action.payload};
    case CHANGE_MY_FUJI_VALUT_AVAXUSDT:
      return {...state,myFujiVaultAVAXUSDT: action.payload};
    case CHANGE_MY_FLIQUIDATORAVAX:
      return {...state,myFliquidatorAVAX: action.payload};
    case CHANGE_MY_FUJI_CONTROLLER:
     return {...state,myFujiController: action.payload};
    case CHANGE_MY_FUJI_ORACLE:
      return {...state,myFujiOracle: action.payload};
    case CHANGE_MY_SMART_VAULT_BTC:
      return {...state,mySmartVaultBtc: action.payload};
    case CHANGE_MY_SMART_VAULT_USDT:
      return {...state,mySmartVaultUsdt: action.payload};
    case CHANGE_MY_ETH_CONTRACT:
      return {...state,myETHContract: action.payload};
    case CHANGE_MY_BTC_CONTRACT:
      return {...state,myBTCContract: action.payload};
    case CHANGE_MY_USDT_CONTRACT:
        return {...state,myUSDTContract: action.payload};
    case CHANGE_PRICE_OF_ETH:
        return {...state,priceOfEth: action.payload};
    case CHANGE_PRICE_OF_BTC:
      return {...state,priceOfBtc: action.payload};
    case CHANGE_PRICE_OF_AVAX:
      return {...state,priceOfAvax: action.payload};
    case CHANGE_PRICE_OF_USDT:
      return {...state,priceOfUsdt: action.payload};
    case CHANGE_ProviderAAVEAVAX:
      return {...state,providerAAVEAVAX: action.payload};
    case CHANGE_ProviderTraderJoe:
      return {...state,providerTraderJoe: action.payload};
    case CHANGE_SMART_VAULT_BTC:
      return {...state,smartVaultBtc: action.payload};
    case CHANGE_SMART_VAULT_USDT:
      return {...state,smartVaultUsdt: action.payload};
    case CHANGE_INPUT_BTC_DEBT:
      return {...state,inputBtcDept: action.payload};
    case CHANGE_INPUT_ETH_DEPOSIT:
      return {...state,inputEthDeposit: action.payload};
    case CHANGE_MY_ETH_AMOUNT:
      return {...state,myETHAmount: action.payload};
    case CHANGE_MY_BTC_AMOUNT:
      return {...state,myBTCAmount: action.payload};
    case CHANGE_MY_AVAX_AMOUNT:
      return {...state,myAVAXAmount: action.payload};
    case CHANGE_MY_USDT_AMOUNT:
      return {...state,myUSDTAmount: action.payload};
    case CHANGE_LTV:
      var newState = state;
      if (action.payload.ETHBTC) {
        newState.LTV.ETHBTC = action.payload.ETHBTC;
      }
      if (action.payload.AVAXUSDT) {
        newState.LTV.AVAXUSDT = action.payload.AVAXUSDT;
      }
      return {...state,LTV: newState.LTV};
    case CHANGE_LIQUDATION_PRICE:
      var newState2 = state;
      if (action.payload.ETHBTC) {
        newState2.liquidationPrice.ETHBTC = action.payload.ETHBTC;
      }
      if (action.payload.AVAXUSDT) {
        newState2.liquidationPrice.AVAXUSDT = action.payload.AVAXUSDT;
      }
      return {...state,liquidationPrice: newState2.liquidationPrice};
     default:
      return state;
  }
}
