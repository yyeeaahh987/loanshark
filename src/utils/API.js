import {
    changeNumberOfEth, 
    changeUserDepositBalance, 
    changeUserDebtBalance,
    changePriceOfEth,
    changePriceOfBtc,
    changeSmartVaultBtc,
    changeMyETHAmount,
    changeMyBTCAmount
  } from "../actions/loanshark";

const WBTC=process.env.REACT_APP_WBTC;
const WETH=process.env.REACT_APP_WETH;
const USDT=process.env.REACT_APP_USDT;

let refreshPrice = (props) => {
    if (props.myFujiVaultETHBTC) {
        let args = [
            1,
            true
        ]
        props.myFujiVaultETHBTC.methods.getNeededCollateralFor(...args).call({}, (error, result) => {
            props.dispatch(changeNumberOfEth((result / 10000000000)));
        });

        props.myFujiVaultETHBTC.methods.userDepositBalance(props.myAccount).call({}, (error, result) => {
            props.dispatch(changeUserDepositBalance(window.web3.utils.fromWei(result, 'ether')));
        });

        props.myFujiVaultETHBTC.methods.userDebtBalance(props.myAccount).call({}, (error, result) => {
            props.dispatch(changeUserDebtBalance(window.web3.utils.fromWei(result, 'gwei') * 10));
        });

        let argsPriceOfEth = [
            USDT,
            WETH,
            2
        ]
        props.myFujiOracle.methods.getPriceOf(...argsPriceOfEth).call({}, (error, result) => {
            props.dispatch(changePriceOfEth(result));
        });

        let argsPriceOfBtc = [
            USDT,
            WBTC,
            2
        ]
        props.myFujiOracle.methods.getPriceOf(...argsPriceOfBtc).call({}, (error, result) => {
            props.dispatch(changePriceOfBtc(result));
        });

        props.myFujiOracle.methods.getPriceOf(...argsPriceOfBtc).call({}, (error, result) => {
            props.dispatch(changePriceOfBtc(result));
        });

        props.mySmartVault.methods.balances(props.myAccount).call({}, (error, result) => {
            props.dispatch(changeSmartVaultBtc(window.web3.utils.fromWei(result, 'gwei') * 10));
        });

        props.myBTCContract.methods.balanceOf(props.myAccount).call({}, (error, result) => {
            props.dispatch(changeMyBTCAmount(window.web3.utils.fromWei(result, 'gwei') * 10));
        });

        props.myETHContract.methods.balanceOf(props.myAccount).call({}, (error, result) => {
            props.dispatch(changeMyETHAmount(window.web3.utils.fromWei(result, 'ether')));
        });
    }
}

export default refreshPrice;