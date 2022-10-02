import {
    CHANGE_THEME,
    // CHANGE_LP_POOL_ETH,
    // CHANGE_LP_TOKEN_BTC,
    // CHANGE_LP_TOKEN_ETH,
    // CHANGE_VAULT_BTC,
    // CHANGE_VAULT_ETH,
    // CHANGE_TOPUP_ACTION,
    // CHANGE_GAS_BANK,
    // CHANGE_MY_BTC_LP_AMOUNT,
    // CHANGE_MY_ETH_LP_AMOUNT,
    // CHANGE_TOTAL_BTC_LP_AMOUNT,
    // CHANGE_TOTAL_ETH_LP_AMOUNT,
    // CHANGE_MY_PROTECTION,
    // CHANGE_MY_PROTECTION_ETH,
    // CHANGE_BTC_LP_EXCHANGE_RATE,
    // CHANGE_ETH_LP_EXCHANGE_RATE,
    // CHANGE_MY_GAS_BANK_BALANCE
  } from '../actions/layout';
  
  const defaultState = {
    theme:"dark",
    // lpPoolBtc: null,
    // lpPoolEth: null,
    // lpTokenBtc: null,
    // lpTokenEth: null,
    // vaultBtc: null,
    // vaultEth: null,
    // topupAction: null,
    // gasBank: null,
    // myBtcLpAmount: null,
    // myEthLpAmount: null,
    // totalBtcLpAmount: null,
    // totalEthLpAmount: null,
    // btcLpExchangeRate: 0,
    // ethLpExchangeRate: 0,
    // myProtection: [],
    // myProtectionEth: [],
    // myGasBankBalance: null,
  }
  
  export default function backdReducer(state = defaultState, action) {
    switch (action.type) {
      case CHANGE_THEME:
        return { ...state, theme: action.payload };
    //   case CHANGE_LP_TOKEN_BTC:
    //     return { ...state, lpTokenBtc: action.payload };
    //   case CHANGE_VAULT_BTC:
    //     return { ...state, vaultBtc: action.payload };
    //   case CHANGE_TOPUP_ACTION:
    //     return { ...state, topupAction: action.payload };
    //   case CHANGE_GAS_BANK:
    //     return { ...state, gasBank: action.payload };
    //   case CHANGE_MY_BTC_LP_AMOUNT:
    //     return { ...state, myBtcLpAmount: action.payload };
    //   case CHANGE_TOTAL_BTC_LP_AMOUNT:
    //     return { ...state, totalBtcLpAmount: action.payload };
    //   case CHANGE_BTC_LP_EXCHANGE_RATE:
    //     return { ...state, btcLpExchangeRate: action.payload };
    //   case CHANGE_MY_PROTECTION:
    //     return { ...state, myProtection: action.payload };
    //   case CHANGE_MY_PROTECTION_ETH:
    //     return { ...state, myProtectionEth: action.payload };
    //   case CHANGE_MY_GAS_BANK_BALANCE:
    //     return { ...state, myGasBankBalance: action.payload };
  
  
    //   case CHANGE_LP_POOL_ETH:
    //     return { ...state, lpPoolEth: action.payload };
    //   case CHANGE_LP_TOKEN_ETH:
    //     return { ...state, lpTokenEth: action.payload };
    //   case CHANGE_VAULT_ETH:
    //     return { ...state, vaultEth: action.payload };
    //   case CHANGE_MY_ETH_LP_AMOUNT:
    //     return { ...state, myEthLpAmount: action.payload };
    //   case CHANGE_TOTAL_ETH_LP_AMOUNT:
    //     return { ...state, totalEthLpAmount: action.payload };
    //   case CHANGE_ETH_LP_EXCHANGE_RATE:
    //     return { ...state, ethLpExchangeRate: action.payload };
  
  
      default:
        return state;
    }
  }
  