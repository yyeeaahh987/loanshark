import {
    changeNumberOfEth,
    changeNumberOfAvax,
    changeAaveBtcBorrowRate,
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
    changeMyBtcLpAmount,
    changeMyProtection,
    changeMyProtectionEth,
    changeTotalBtcLpAmount,
    changeBtcLpExchangeRateAmount,
    changeMyGasBankBalance,


    changeMyEthLpAmount,
    changeTotalEthLpAmount,
    changeEthLpExchangeRateAmount,
} from "../actions/backd";

const WBTC = process.env.REACT_APP_WBTC;
const AVAX = process.env.REACT_APP_AVAX;
const WETH = process.env.REACT_APP_WETH;
const USDT = process.env.REACT_APP_USDT;

let refreshPrice = (props) => {
    if (props.myFujiVaultETHBTC) {
        let args = [1, true]

        // ETH-BTC Vaults
        props.myFujiVaultETHBTC.methods.getNeededCollateralFor(...args).call({}, (error, result) => {
            props.dispatch(changeNumberOfEth((result / 10000000000)));
        });

        props.myFujiVaultETHBTC.methods.userDepositBalance(props.myAccount).call({}, (error, result) => {
            props.dispatch(changeUserDepositBalanceEth(window.web3.utils.fromWei(result, 'ether')));
        });
        props.myFujiVaultETHBTC.methods.userDebtBalance(props.myAccount).call({}, (error, result) => {
            props.dispatch(changeUserDebtBalanceBtc(parseFloat((window.web3.utils.fromWei(result, 'gwei') * 10).toFixed(8))));
        });
        props.myFujiVaultETHBTC.methods.collatF().call({}, (error, result) => {
            props.dispatch(changeLTV({ "ETHBTC": result.b / result.a }));
        });
        props.myFujiVaultETHBTC.methods.safetyF().call({}, (error, result) => {
            props.dispatch(changeLiqudationPrice({ "ETHBTC": result.b / result.a }));
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
            props.dispatch(changeLTV({ "AVAXUSDT": result.b / result.a }));
        });
        props.myFujiVaultAVAXUSDT.methods.safetyF().call({}, (error, result) => {
            props.dispatch(changeLiqudationPrice({ "AVAXUSDT": result.b / result.a }));
        });

        let argsPriceOfEth = [USDT, WETH, 2]
        props.myFujiOracle.methods.getPriceOf(...argsPriceOfEth).call({}, (error, result) => {
            props.dispatch(changePriceOfEth(result));
        });
        let argsPriceOfBtc = [USDT, WBTC, 2]
        props.myFujiOracle.methods.getPriceOf(...argsPriceOfBtc).call({}, (error, result) => {
            props.dispatch(changePriceOfBtc(result));
        });
        let argsPriceOfAvax = [USDT, AVAX, 2]
        props.myFujiOracle.methods.getPriceOf(...argsPriceOfAvax).call({}, (error, result) => {
            props.dispatch(changePriceOfAvax(result));
        });
        let argsPriceOfUsdt = [USDT, USDT, 2]
        props.myFujiOracle.methods.getPriceOf(...argsPriceOfUsdt).call({}, (error, result) => {
            props.dispatch(changePriceOfUsdt(result));
        });

        if (props.providerAAVEAVAX) {
            props.providerAAVEAVAX.methods.getBorrowRateFor(WBTC).call({}, (error, result) => {
                var APR = result /1000000000000000000000000000;
                props.dispatch(changeAaveBtcBorrowRate(parseFloat((Math.pow(1 + APR/365, 365) - 1)*100).toFixed(2)));
            });
        }
        
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

        window.web3.eth.getBalance(props.myAccount, function (err, result) {
            if (err) {
            } else {
                props.dispatch(changeMyAVAXAmount(window.web3.utils.fromWei(result, 'ether')));
            }
        })

        //Backd
        if (props.lpTokenBtc) {
            props.lpTokenBtc.methods.balanceOf(props.myAccount).call({}, (error, result) => {
                let argsGetPosition = [
                    props.myAccount,
                    props.myAccount + "000000000000000000000000",
                    "0x66756a6964616f00000000000000000000000000000000000000000000000000"
                ];

                if (props.topupAction) {
                    props.topupAction.methods.getPosition(...argsGetPosition).call({}, (error, resultStakerVault) => {
                        let stakerVault = parseFloat(window.web3.utils.fromWei(resultStakerVault[7], 'gwei') * 10);
                        props.dispatch(changeMyBtcLpAmount(stakerVault + window.web3.utils.fromWei(result, 'gwei') * 10));
                    });
                }
                
                props.dispatch(changeMyBtcLpAmount(window.web3.utils.fromWei(result, 'gwei') * 10));
            });
        }

        if (props.lpPoolBtc) {
            props.lpPoolBtc.methods.exchangeRate().call({}, (error, resultExchangeRate) => {
                props.dispatch(changeBtcLpExchangeRateAmount(window.web3.utils.fromWei(resultExchangeRate, 'ether')));
            });
        }

        let argsGetPosition = [
            props.myAccount,
            props.myAccount + "000000000000000000000000",
            "0x66756a6964616f00000000000000000000000000000000000000000000000000"
        ];

        if (props.topupAction) {
            props.topupAction.methods.getPosition(...argsGetPosition).call({}, (error, result) => {
                props.dispatch(changeMyProtection(result));
            });
        }

        let argsGetPositionEth = [
            props.myAccount,
            props.myAccount + "000000000000000000000000",
            "0x66756a6964616f65746800000000000000000000000000000000000000000000"
        ];

        if (props.topupAction) {
            props.topupAction.methods.getPosition(...argsGetPositionEth).call({}, (error, result) => {
                props.dispatch(changeMyProtectionEth(result));
            });
        }

        if (props.lpTokenBtc) {
            props.lpTokenBtc.methods.totalSupply().call({}, (error, result) => {
                props.dispatch(changeTotalBtcLpAmount(window.web3.utils.fromWei(result, 'gwei') * 10));
            });
        }

        if (props.gasBank) {
            props.gasBank.methods.balanceOf(props.myAccount).call({}, (error, result) => {
                props.dispatch(changeMyGasBankBalance(window.web3.utils.fromWei(result, 'ether')));
            });
        }



        if (props.lpTokenEth) {
            props.lpTokenEth.methods.balanceOf(props.myAccount).call({}, (error, result) => {
                let argsGetPosition = [
                    props.myAccount,
                    props.myAccount + "000000000000000000000000",
                    "0x66756a6964616f65746800000000000000000000000000000000000000000000"
                ];

                if (props.topupAction) {
                    props.topupAction.methods.getPosition(...argsGetPosition).call({}, (error, resultStakerVault) => {
                        let stakerVault = parseFloat(window.web3.utils.fromWei(resultStakerVault[7], 'ether') * 1);
                        props.dispatch(changeMyEthLpAmount(stakerVault + window.web3.utils.fromWei(result, 'ether') * 1));
                    });
                }
                
                props.dispatch(changeMyEthLpAmount(window.web3.utils.fromWei(result, 'ether') * 1));
            });
        }

        if (props.lpPoolEth) {
            props.lpPoolEth.methods.exchangeRate().call({}, (error, resultExchangeRate) => {
                props.dispatch(changeEthLpExchangeRateAmount(window.web3.utils.fromWei(resultExchangeRate, 'ether')));
            });
        }

        if (props.lpTokenEth) {
            props.lpTokenEth.methods.totalSupply().call({}, (error, result) => {
                props.dispatch(changeTotalEthLpAmount(window.web3.utils.fromWei(result, 'ether') * 1));
            });
        }
    }
}

export default refreshPrice;