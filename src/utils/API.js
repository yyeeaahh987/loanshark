import {
    changeNumberOfEth, 
    changeNumberOfAvax, 
    changeUserDepositBalanceEth, 
    changeUserDepositBalanceAvax, 
    changeUserDebtBalanceBtc,
    changeUserDebtBalanceUsdt,
    changePriceOfEth,
    changePriceOfBtc,
    changePriceOfAvax,
    changePriceOfUsdt,
    changeSmartVaultBtc,
    changeSmartVaultUsdt,
    changeMyETHAmount,
    changeMyBTCAmount,
    changeMyAVAXAmount,
    changeMyUSDTAmount,
    changeLTV,
    changeLiqudationPrice
  } from "../actions/loanshark";

import {
  changeLpPoolBtc,
  changeLpTokenBtc,
  changeVaultBtc,
  changeTopupAction,
  changeMyBtcLpAmount,
  changeMyProtection,
  changeTotalBtcLpAmount,
} from "../actions/backd";
  
const WBTC=process.env.REACT_APP_WBTC;
const AVAX=process.env.REACT_APP_AVAX;
const WETH=process.env.REACT_APP_WETH;
const USDT=process.env.REACT_APP_USDT;

let refreshPrice = (props) => {
    if (props.myFujiVaultETHBTC) {
        let args = [1,true]

        // ETH-BTC Vaults
        props.myFujiVaultETHBTC.methods.getNeededCollateralFor(...args).call({}, (error, result) => {
            props.dispatch(changeNumberOfEth((result / 10000000000)));
        });

        props.myFujiVaultETHBTC.methods.userDepositBalance(props.myAccount).call({}, (error, result) => {
            props.dispatch(changeUserDepositBalanceEth(window.web3.utils.fromWei(result, 'ether')));
        });
        props.myFujiVaultETHBTC.methods.userDebtBalance(props.myAccount).call({}, (error, result) => {
            props.dispatch(changeUserDebtBalanceBtc(window.web3.utils.fromWei(result, 'gwei') * 10));
        });
        props.myFujiVaultETHBTC.methods.collatF().call({}, (error, result) => {
            props.dispatch(changeLTV({"ETHBTC": result.b / result.a}));
        });
        props.myFujiVaultETHBTC.methods.safetyF().call({}, (error, result) => {
            props.dispatch(changeLiqudationPrice({"ETHBTC": result.b / result.a}));
        });
        
        // AVAX-USDT Vaults
        props.myFujiVaultAVAXUSDT.methods.getNeededCollateralFor(...args).call({}, (error, result) => {
            props.dispatch(changeNumberOfAvax((result / 1000000000000)));
        });

        props.myFujiVaultAVAXUSDT.methods.userDepositBalance(props.myAccount).call({}, (error, result) => {
            props.dispatch(changeUserDepositBalanceAvax(window.web3.utils.fromWei(result, 'ether')));
        });
        props.myFujiVaultAVAXUSDT.methods.userDebtBalance(props.myAccount).call({}, (error, result) => {
            props.dispatch(changeUserDebtBalanceUsdt(window.web3.utils.fromWei(result, 'picoether')));
        });
        props.myFujiVaultAVAXUSDT.methods.collatF().call({}, (error, result) => {
            props.dispatch(changeLTV({"AVAXUSDT": result.b / result.a}));
        });
        props.myFujiVaultAVAXUSDT.methods.safetyF().call({}, (error, result) => {
            props.dispatch(changeLiqudationPrice({"AVAXUSDT": result.b / result.a}));
        });

        let argsPriceOfEth = [USDT,WETH,2]
        props.myFujiOracle.methods.getPriceOf(...argsPriceOfEth).call({}, (error, result) => {
            props.dispatch(changePriceOfEth(result));
        });
        let argsPriceOfBtc = [USDT,WBTC,2]
        props.myFujiOracle.methods.getPriceOf(...argsPriceOfBtc).call({}, (error, result) => {
            props.dispatch(changePriceOfBtc(result));
        });
        let argsPriceOfAvax = [USDT,AVAX,2]
        props.myFujiOracle.methods.getPriceOf(...argsPriceOfAvax).call({}, (error, result) => {
            props.dispatch(changePriceOfAvax(result));
        });
        let argsPriceOfUsdt = [USDT,USDT,2]
        props.myFujiOracle.methods.getPriceOf(...argsPriceOfUsdt).call({}, (error, result) => {
            props.dispatch(changePriceOfUsdt(result));
        });

        if (props.mySmartVaultBtc) {
            props.mySmartVaultBtc.methods.balances(props.myAccount).call({}, (error, result) => {
                props.dispatch(changeSmartVaultBtc(window.web3.utils.fromWei(result, 'gwei') * 10));
            });
        }

        if (props.mySmartVaultUsdt) {
            props.mySmartVaultUsdt.methods.balances(props.myAccount).call({}, (error, result) => {
                props.dispatch(changeSmartVaultUsdt(window.web3.utils.fromWei(result, 'picoether')));
            });
        }

        props.myBTCContract.methods.balanceOf(props.myAccount).call({}, (error, result) => {
            props.dispatch(changeMyBTCAmount(window.web3.utils.fromWei(result, 'gwei') * 10));
        });
        props.myETHContract.methods.balanceOf(props.myAccount).call({}, (error, result) => {
            props.dispatch(changeMyETHAmount(window.web3.utils.fromWei(result, 'ether')));
        });
        props.myUSDTContract.methods.balanceOf(props.myAccount).call({}, (error, result) => {
            props.dispatch(changeMyUSDTAmount(window.web3.utils.fromWei(result, 'picoether')));
        });

        window.web3.eth.getBalance(props.myAccount, function(err, result) {
            if (err) {
            } else {
                props.dispatch(changeMyAVAXAmount(window.web3.utils.fromWei(result, 'ether')));
            }
        })

        //Backd
        props.lpTokenBtc.methods.balanceOf(props.myAccount).call({},  (error, result) => {
            props.dispatch(changeMyBtcLpAmount(window.web3.utils.fromWei(result, 'gwei') * 10));
        });

        let argsGetPosition = [
            props.myAccount,
            props.myAccount + "000000000000000000000000",
            "0x66756a6964616f00000000000000000000000000000000000000000000000000"
        ];

        props.topupAction.methods.getPosition(...argsGetPosition).call({},  (error, result) => {
            props.dispatch(changeMyProtection(result));
        });

        props.lpTokenBtc.methods.totalSupply().call({}, (error, result) => {
            props.dispatch(changeTotalBtcLpAmount(window.web3.utils.fromWei(result, 'gwei') * 10));
        });
    }
}

export default refreshPrice;