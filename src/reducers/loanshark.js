import { 
  CHANGE_MY_ACCOUNT,
  CHANGE_NUMBER_OF_ETH, 
  CHANGE_USER_DEPOSIT_BALANCE, 
  CHANGE_USER_DEBT_BALANCE,
  CHANGE_MY_FUJI_VALUT_ETHBTC, 
  CHANGE_MY_FLIQUIDATORAVAX,
  CHANGE_MY_FUJI_CONTROLLER,
  CHANGE_MY_FUJI_ORACLE,
  CHANGE_MY_ETH_CONTRACT,
  CHANGE_MY_BTC_CONTRACT,
  CHANGE_MY_USDT_CONTRACT,
  CHANGE_PRICE_OF_ETH,
  CHANGE_PRICE_OF_BTC,
  CHANGE_ProviderAAVEAVAX,
  CHANGE_INPUT_BTC_DEBT, 
  CHANGE_INPUT_ETH_DEPOSIT,
} from '../actions/loanshark';

const defaultState = {
  myAccount: null,
  numberOfEth: 0,
  userDepositBalance: 0,
  userDebtBalance: 0,
  myFujiVaultETHBTC: null,
  myFliquidatorAVAX: null,
  myFujiController: null,
  myFujiOracle: null,
  myETHContract: null,
  myBTCContract: null,
  myUSDTContract: null,
  priceOfEth: null,
  priceOfBtc: null,
  providerAAVEAVAX: null,
  inputBtcDept: 0,
  inputEthDeposit: 0,
}

export default function loansharkReducer(state = defaultState, action) {
  switch (action.type) {
    case CHANGE_MY_ACCOUNT:
      return {...state,myAccount: action.payload};
    case CHANGE_NUMBER_OF_ETH:
      return {...state,numberOfEth: action.payload};
    case CHANGE_USER_DEPOSIT_BALANCE:
      return {...state,userDepositBalance: action.payload};
    case CHANGE_USER_DEBT_BALANCE:
      return {...state,userDebtBalance: action.payload};
    case CHANGE_MY_FUJI_VALUT_ETHBTC:
      return {...state,myFujiVaultETHBTC: action.payload};
    case CHANGE_MY_FLIQUIDATORAVAX:
      return {...state,myFliquidatorAVAX: action.payload};
    case CHANGE_MY_FUJI_CONTROLLER:
     return {...state,myFujiController: action.payload};
    case CHANGE_MY_FUJI_ORACLE:
      return {...state,myFujiOracle: action.payload};
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
    case CHANGE_ProviderAAVEAVAX:
      return {...state,providerAAVEAVAX: action.payload};
    case CHANGE_INPUT_BTC_DEBT:
      return {...state,inputBtcDept: action.payload};
    case CHANGE_INPUT_ETH_DEPOSIT:
      return {...state,inputEthDeposit: action.payload};
    default:
      return state;
  }
}
