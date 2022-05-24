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
  CHANGE_MY_BTC_CONTRACT
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
  myBTCContract: null
}

export default function alertsReducer(state = defaultState, action) {
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
    default:
      return state;
  }
}
