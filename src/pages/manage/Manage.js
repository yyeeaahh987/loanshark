import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import PropTypes from "prop-types";
import { Grid } from '@mui/material';
import { Row, Col, Table, Input, Button, Modal, ModalBody } from 'reactstrap';

import TradeInfo from "../../components/TradeInfo";
import HealthFactorPieChart from "../../components/HealthFactorPieChart";
import { changeInputEthDeposit, changeInputBtcDebt, changeSelectedPair } from "../../actions/loanshark";
import Card from './Card/Card'
import { toggleLoading } from "../../actions/navigation";
import API from '../../utils/API'

import './Manage.scss'

class Manage extends React.Component {
    static propTypes = {
        location: PropTypes.shape({
            pathname: PropTypes.string,
            state: PropTypes.shape({
                pair: PropTypes.string,
            }),
        }).isRequired,
    };

    constructor(props) {
        super(props);
        this.calltoggleLoading = this.calltoggleLoading.bind(this);
        this.toggle = this.toggle.bind(this);
        this.roundDown = this.roundDown.bind(this);
        this.state = {
            depositCurrency: "",
            depositAmount: 0,
            maxDepositAmount: 0,
            maxWithdrawAmount: 0,
            depositCurrencyIconPath: "",
            debtCurrency: "",
            debtAmount: 0,
            maxDebtAmount: 0,
            maxPaybackAmount: 0,
            debtCurrencyIconPath: "",
            modal: false,
            modalTitle: '',
            modalMessage: '',
            subHeading: "",
            modalToken: '',
            modalAction: '',
            modalCall: () => { },
            modalInputValue: 0,
            modalValue: 0,
            modalOnChange: () => { },
            modalOnCall: () => { },
            loadingActive: false,
            collateralAction: "deposit",
            collateralAmount: 0,
            debtAction: "borrow",
            depositCurrencyPrice: 0,
            debtCurrencyPrice: 0,
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.myETHAmount !== this.props.myETHAmount) {
            this.setState({
                maxdepositAmount: Number(this.props.myETHAmount),
                depositAmount: 0,
            });
            this.props.dispatch(changeInputEthDeposit(0));
        }

        if (prevProps.userDepositBalanceEth !== this.props.userDepositBalanceEth ||
            prevProps.userDebtBalanceBtc !== this.props.userDebtBalanceBtc
        ) {
            var borrowPower = 0;
            borrowPower = this.props.userDepositBalanceEth;
            borrowPower = borrowPower * this.props.priceOfEth;
            borrowPower = borrowPower * this.props.LTV[this.props.selectedPair];
            borrowPower = borrowPower * this.props.liquidationPrice[this.props.selectedPair];
            borrowPower = borrowPower / this.props.priceOfBtc;
            borrowPower = borrowPower - this.props.userDebtBalanceBtc;

            this.setState({
                maxdebtAmount: this.state.debtAction === 'borrow' ? Number(borrowPower).toFixed(8) : Number(this.props.userDebtBalanceBtc).toFixed(8),
                maxdepositAmount: this.state.collateralAction === "deposit" ? Number(this.props.myETHAmount) : this.props.userDepositBalanceEth,
                debtAmount: 0,
                depositAmount: 0
            });
            this.props.dispatch(changeInputEthDeposit(0));
            this.props.dispatch(changeInputBtcDebt(0));
        }
    }

    updateBorrowPower = () => {
        if ((this?.props?.location?.state?.pair ?? "") === "") return
        let tempPari = this.props.location.state.pair.split("_")
        let deposit = tempPari[0]
        let debt = tempPari[1]
        var borrowPower = 0;
        if (deposit === "AVAX") {
            borrowPower = (this.props.userDepositBalanceAvax);
            borrowPower = borrowPower * (this.props.priceOfAvax);
            borrowPower = borrowPower * this.props.LTV["AVAXUSDT"];
            borrowPower = borrowPower * this.props.liquidationPrice["AVAXUSDT"];
            borrowPower = borrowPower / this.props.priceOfUsdt;

            this.setState({
                depositCurrency: deposit,
                depositAmount: this.props.userDepositBalanceAvax,
                depositCurrencyPrice: Number(this.props.priceOfAvax),
                maxdepositAmount: Number(this.props.myAVAXAmount),
                maxWithdrawAmount: Number(this.props.userDepositBalanceAvax),
                depositCurrencyIconPath: `/assets/icon/${deposit.toLowerCase()}-logo.svg`,
                debtCurrency: debt,
                debtCurrencyIconPath: `/assets/icon/${debt.toLowerCase()}-logo.svg`,

                debtCurrencyPrice: Number(this.props.priceOfUsdt),
                debtAmount: Number(this.props.userDebtBalanceUsdt),
                maxDebtAmount: Number(this.props.myUSDTAmount),
                maxPaybackAmount: Number(this.props.userDebtBalanceUsdt),
            })
            this.props.dispatch(changeSelectedPair("AVAXUSDT"));
        }

        if (deposit === "ETH") {
            borrowPower = this.props.userDepositBalanceEth;
            borrowPower = borrowPower * this.props.priceOfEth;
            borrowPower = borrowPower * this.props.LTV[this.props.selectedPair];
            borrowPower = borrowPower * this.props.liquidationPrice[this.props.selectedPair];
            borrowPower = borrowPower / this.props.priceOfBtc;
            borrowPower = borrowPower - this.props.userDebtBalanceBtc;

            this.setState({
                depositCurrency: deposit,
                depositAmount: this.props.userDepositBalanceEth,
                maxdepositAmount: Number(this.props.myETHAmount),
                depositCurrencyIconPath: `/assets/icon/${deposit.toLowerCase()}-logo.svg`,
                debtCurrency: debt,
                debtAmount: 0,
                maxdebtAmount: Number(borrowPower).toFixed(8),
                debtCurrencyIconPath: `/assets/icon/${debt.toLowerCase()}-logo.svg`,

                maxWithdrawAmount: Number(this.props.userDepositBalanceEth),
                debtCurrencyPrice: Number(this.props.priceOfBtc),
                maxPaybackAmount: Number(this.props.userDebtBalanceBtc).toFixed(8),
            })
            this.props.dispatch(changeSelectedPair("ETHBTC"));
        }
    }

    componentDidMount() {
        this.updateBorrowPower();
        this.forceUpdate();
    }

    componentWillUnmount() {
        this.props.dispatch(changeInputEthDeposit(0));
        this.props.dispatch(changeInputBtcDebt(0));
    }

    toggle() {
        this.setState({
            modal: !this.state.modal,
        })
    }

    calltoggleLoading() {
        this.props.dispatch(toggleLoading());
    }

    calculateHealthFactor(depositAmouont, priceOfdeposit, LTV, debtAmount, priceOfDebt) {
        if (debtAmount === undefined || debtAmount === null || debtAmount === 0) return "-"
        return ((depositAmouont * priceOfdeposit / 100) * LTV / (debtAmount * priceOfDebt / 100)).toFixed(2)
    }

    toggleDeposit(inputModalToken, inputModalAction, inputModalMessage, pair) {
        this.setState({
            modal: !this.state.modal,
            modalTitle: inputModalAction,
            modalMessage: inputModalMessage,
            modalToken: inputModalToken,
            modalAction: inputModalAction,
            modalInputValue: this.state.collateralAmount,
            modalCall: () => {
                let approveArgs = [
                    (pair === "ETHBTC" ? this.props.myFujiVaultETHBTC.options.address : pair === "AVAXUSDT" ? this.props.myFujiVaultAVAXUSDT.options.address : ""),
                    window.web3.utils.toBN(window.web3.utils.toWei((this.state.modalInputValue + ""), 'ether')).toString()
                ]

                let args = [
                    window.web3.utils.toBN(window.web3.utils.toWei((this.state.modalInputValue + ""), 'ether')).toString(),
                ];

                if (pair === "ETHBTC") {
                    this.toggle();
                    this.calltoggleLoading();

                    this.props.myETHContract.methods
                        .approve(...approveArgs)
                        .send({ from: this.props.myAccount })
                        .on("error", (error, receipt) => {
                            this.calltoggleLoading();
                        })
                        .then((receipt) => {
                            this.props.myFujiVaultETHBTC.methods
                                .deposit(...args)
                                .send({ from: this.props.myAccount })
                                .on("error", (error, receipt) => {
                                    this.calltoggleLoading();
                                })
                                .then((receipt) => {
                                    this.calltoggleLoading();
                                    API(this.props);
                                })
                        });
                }

                if (pair === "AVAXUSDT") {
                    this.toggle();
                    this.calltoggleLoading();

                    let a = window.web3.utils.toBN(window.web3.utils.toWei(Number.parseFloat(this.state.modalInputValue), 'ether')).toString();
                    this.props.myFujiVaultAVAXUSDT.methods
                        .deposit(...args)
                        .send({ from: this.props.myAccount, value: a })
                        .on("error", (error, receipt) => {
                            this.calltoggleLoading();
                        })
                        .then((receipt) => {
                            this.calltoggleLoading();
                            API(this.props);
                        })
                }

            }
        });
    }

    toggleWithdrawn(inputModalToken, inputModalAction, inputModalMessage, pair) {
        this.setState({
            modal: !this.state.modal,
            modalTitle: inputModalAction,
            modalMessage: inputModalMessage,
            modalToken: inputModalToken,
            modalAction: inputModalAction,
            modalInputValue: this.state.collateralAmount,
            modalCall: () => {
                let args = [
                    window.web3.utils.toBN(window.web3.utils.toWei((this.state.modalInputValue) + "", 'ether')).toString(),
                ];

                if (pair === "ETHBTC") {
                    this.toggle();
                    this.calltoggleLoading();

                    this.props.myFujiVaultETHBTC.methods
                        .withdraw(...args)
                        .send({ from: this.props.myAccount })
                        .on("error", (error, receipt) => {
                            this.calltoggleLoading();
                        })
                        .then((receipt) => {
                            this.calltoggleLoading();
                            API(this.props);
                        });
                }

                if (pair === "AVAXUSDT") {
                    this.toggle();
                    this.calltoggleLoading();

                    this.props.myFujiVaultAVAXUSDT.methods
                        .withdraw(...args)
                        .send({ from: this.props.myAccount })
                        .on("error", (error, receipt) => {
                            this.calltoggleLoading();
                        })
                        .then((receipt) => {
                            this.calltoggleLoading();
                            API(this.props);
                        });
                }
            }
        });
    }

    toggleBorrow(inputModalToken, inputModalAction, inputModalMessage, pair) {
        this.setState({
            modal: !this.state.modal,
            modalTitle: inputModalAction,
            modalMessage: inputModalMessage,
            modalToken: inputModalToken,
            modalAction: inputModalAction,
            modalInputValue: this.state.debtAmount,
            modalCall: () => {
                var finalModalInputValue;
                if (pair === "ETHBTC") {
                    finalModalInputValue = Number.parseFloat(this.state.modalInputValue * 100000000).toFixed(0);
                }
                if (pair === "AVAXUSDT") {
                    finalModalInputValue = Number.parseFloat(this.state.modalInputValue * 1000000).toFixed(0);
                }

                let args = [
                    finalModalInputValue
                ];

                this.toggle();
                this.calltoggleLoading();

                if (pair === "ETHBTC") {
                    this.props.myFujiVaultETHBTC.methods
                        .borrow(...args)
                        .send({ from: this.props.myAccount })
                        .on("error", (error, receipt) => {
                            this.calltoggleLoading();
                        })
                        .then((receipt) => {
                            this.calltoggleLoading();
                            API(this.props);
                        });
                }

                if (pair === "AVAXUSDT") {
                    this.props.myFujiVaultAVAXUSDT.methods
                        .borrow(...args)
                        .send({ from: this.props.myAccount })
                        .on("error", (error, receipt) => {
                            this.calltoggleLoading();
                        })
                        .then((receipt) => {
                            this.calltoggleLoading();
                            API(this.props);
                        });
                }
            }
        });
    }

    togglePayback(inputModalToken, inputModalAction, inputModalMessage, pair) {
        this.setState({
            modal: !this.state.modal,
            modalTitle: inputModalAction,
            modalMessage: inputModalMessage,
            modalToken: inputModalToken,
            modalAction: inputModalAction,
            modalInputValue: this.state.debtAmount,
            modalCall: () => {
                var finalModalInputValue;
                if (pair === "ETHBTC") {
                    finalModalInputValue = this.state.modalInputValue < 0 ? Number.parseFloat(1000000000000).toFixed(0) : Number.parseFloat(this.state.modalInputValue * 100000000).toFixed(0);
                }
                if (pair === "AVAXUSDT") {
                    finalModalInputValue = this.state.modalInputValue < 0 ? Number.parseFloat(1000000000000).toFixed(0) : window.web3.utils.toBN(window.web3.utils.toWei(this.state.modalInputValue, 'picoether')).toString();
                }

                let approveArgs = [
                    (pair === "ETHBTC" ? this.props.myFujiVaultETHBTC.options.address : pair === "AVAXUSDT" ? this.props.myFujiVaultAVAXUSDT.options.address : ""),
                    window.web3.utils.toBN(finalModalInputValue).toString()
                ]

                let args = [
                    this.state.modalInputValue < 0 ? "-1" : window.web3.utils.toBN(finalModalInputValue).toString(),
                ];

                if (pair === "ETHBTC") {
                    this.toggle();
                    this.calltoggleLoading();

                    this.props.myBTCContract.methods
                        .approve(...approveArgs)
                        .send({ from: this.props.myAccount })
                        .on("error", (error, receipt) => {
                            this.calltoggleLoading();
                        })
                        .then((receipt) => {
                            this.props.myFujiVaultETHBTC.methods
                                .payback(...args)
                                .send({ from: this.props.myAccount })
                                .on("error", (error, receipt) => {
                                    this.calltoggleLoading();
                                })
                                .then((receipt) => {
                                    this.calltoggleLoading();
                                    API(this.props);
                                })
                        });
                }

                if (pair === "AVAXUSDT") {
                    this.toggle();
                    this.calltoggleLoading();

                    this.props.myUSDTContract.methods
                        .approve(...approveArgs)
                        .send({ from: this.props.myAccount })
                        .on("error", (error, receipt) => {
                            this.calltoggleLoading();
                        })
                        .then((receipt) => {
                            this.props.myFujiVaultAVAXUSDT.methods
                                .payback(...args)
                                .send({ from: this.props.myAccount })
                                .on("error", (error, receipt) => {
                                    this.calltoggleLoading();
                                })
                                .then((receipt) => {
                                    this.calltoggleLoading();
                                    API(this.props);
                                })
                        });
                }
            }
        });
    }
    toggleNoAction(inputModalToken, inputModalAction, inputModalMessage, pair) {
        this.setState({
            modal: !this.state.modal,
            modalTitle: inputModalAction,
            modalMessage: inputModalMessage,
            modalToken: inputModalToken,
            modalAction: inputModalAction,
            modalInputValue: this.state.debtAmount,
            modalCall: null
        });
    }

    toggleLeaveSmartVault(inputModalToken, inputModalAction, inputModalMessage, pair) {
        this.setState({
            modal: !this.state.modal,
            modalTitle: inputModalAction,
            modalMessage: inputModalMessage,
            modalToken: inputModalToken,
            modalAction: inputModalAction,
            modalInputValue: this.props.myBtcLpAmount,
            modalCall: () => {
                let args = [
                    window.web3.utils.toBN((this.state.modalInputValue * 100000000).toFixed(0)).toString(),
                ];

                this.toggle();
                this.calltoggleLoading();

                let argsUnregister = [
                    this.props.myAccount + "000000000000000000000000",
                    "0x66756a6964616f00000000000000000000000000000000000000000000000000",
                    1
                ];

                if (this.props.myProtection && this.props.myProtection[0] > 0) {

                    this.props.topupAction.methods
                        .resetPosition(...argsUnregister)
                        .send({ from: this.props.myAccount })
                        .on("error", (error, receipt) => {
                            this.calltoggleLoading();
                        })
                        .then((receipt) => {
                            this.props.lpPoolBtc.methods
                                .redeem(...args)
                                .send({ from: this.props.myAccount })
                                .on("error", (error, receipt) => {
                                    this.calltoggleLoading();
                                })
                                .then((receipt) => {
                                    this.calltoggleLoading();
                                    API(this.props);
                                })
                        })
                } else {
                    this.props.lpPoolBtc.methods
                        .redeem(...args)
                        .send({ from: this.props.myAccount })
                        .on("error", (error, receipt) => {
                            this.calltoggleLoading();
                        })
                        .then((receipt) => {
                            this.calltoggleLoading();
                            API(this.props);
                        })
                }
            }
        });
    }


    toggleLeaveSmartVaultETH(inputModalToken, inputModalAction, inputModalMessage, pair) {
        this.setState({
            modal: !this.state.modal,
            modalTitle: inputModalAction,
            modalMessage: inputModalMessage,
            modalToken: inputModalToken,
            modalAction: inputModalAction,
            modalInputValue: this.props.myEthLpAmount,
            modalCall: () => {
                let args = [
                    window.web3.utils.toBN(window.web3.utils.toWei(String(this.props.myEthLpAmount), 'ether')).toString(),
                ];

                this.toggle();
                this.calltoggleLoading();

                let argsUnregister = [
                    this.props.myAccount + "000000000000000000000000",
                    "0x66756a6964616f65746800000000000000000000000000000000000000000000",
                    1
                ];

                if (this.props.myProtectionEth && this.props.myProtectionEth[0] > 0) {

                    this.props.topupAction.methods
                        .resetPosition(...argsUnregister)
                        .send({ from: this.props.myAccount })
                        .on("error", (error, receipt) => {
                            this.calltoggleLoading();
                        })
                        .then((receipt) => {
                            this.props.lpPoolEth.methods
                                .redeem(...args)
                                .send({ from: this.props.myAccount })
                                .on("error", (error, receipt) => {
                                    this.calltoggleLoading();
                                })
                                .then((receipt) => {
                                    this.calltoggleLoading();
                                    API(this.props);
                                })
                        })
                } else {
                    this.props.lpPoolEth.methods
                        .redeem(...args)
                        .send({ from: this.props.myAccount })
                        .on("error", (error, receipt) => {
                            this.calltoggleLoading();
                        })
                        .then((receipt) => {
                            this.calltoggleLoading();
                            API(this.props);
                        })
                }
            }
        });
    }

    roundDown(number, decimals) {
        decimals = decimals || 0;
        return parseFloat(Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals));
    }

    render() {
        if ((this.props?.location?.state?.pair ?? "") === "") {
            //redirect for no pair get from history
            return <Redirect to="/app/main/dashboard" />
        }

        let tempPari = this.props.location.state.pair.split("_")
        let deposit = tempPari[0]
        let debt = tempPari[1]

        return (
            <div
                def={console.log(this.props)}
                abc={console.log(this.state)}
            >
                <Grid container>
                    <Grid item xs={12}>
                        <Table className={"mb-0"} borderless responsive style={{ borderCollapse: "separate", borderSpacing: "0" }}>
                            <thead className="customTable">
                                <tr className="customTable__headRow">
                                    <th key={0} scope="col" className={"customTable__headRow__item"}>
                                        Asset
                                    </th>
                                    <th key={1} scope="col" className={"customTable__headRow__item"}>
                                        Collateral
                                    </th>
                                    <th key={2} scope="col" className={"customTable__headRow__item"}>
                                        Debt
                                    </th>
                                    <th key={4} scope="col" className={"customTable__headRow__item"}>
                                        Health Factor
                                    </th>
                                    <th key={5} scope="col" className={"customTable__headRow__item"}>
                                        Smart Vault
                                    </th>
                                    <th key={6} scope="col" className={"customTable__headRow__item"}>
                                        Provider
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="customTable">
                                <tr key={0} className="customTable__dataRow">
                                    <td className="firstOne">
                                        <span style={{ paddingRight: "5px" }}>
                                            <img className="icon" src={this.state.depositCurrencyIconPath} alt="x"></img>
                                        </span>
                                        /
                                        <span style={{ padding: "5px" }}>
                                            <img className="icon" src={this.state.debtCurrencyIconPath} alt="x"></img>
                                        </span>
                                        {`${this.state.depositCurrency}/${this.state.debtCurrency}`}
                                    </td>
                                    <td className="middle">
                                        <Grid container>
                                            <Grid xs={12}>
                                                {deposit === "ETH" ?
                                                    <span>{`$${(this.props.userDepositBalanceEth * this.props.priceOfEth / 100).toFixed(2)}`}</span>
                                                    :
                                                    <span>{`$${(this.props.userDepositBalanceAvax * this.props.userDepositBalanceAvax / 100).toFixed(2)}`}</span>
                                                }
                                            </Grid>
                                            <Grid xs={12}>
                                                {deposit === "ETH" ?
                                                    <span>{this.props.userDepositBalanceEth} ETH</span>
                                                    :
                                                    <span>{this.props.userDepositBalanceAvax} AVAX</span>
                                                }
                                            </Grid>
                                        </Grid>
                                    </td>
                                    <td className="middle">
                                        <Grid container>
                                            <Grid xs={12}>
                                                {debt === "BTC" ?
                                                    <span>{`$${(this.props.userDebtBalanceBtc * this.props.priceOfBtc / 100).toFixed(2)}`}</span>
                                                    :
                                                    <span>{`$${(this.props.userDebtBalanceUsdt * this.props.priceOfUsdt / 100).toFixed(2)}`}</span>
                                                }
                                            </Grid>
                                            <Grid xs={12}>
                                                {debt === "BTC" ?
                                                    <span>{`${(this.props.userDebtBalanceBtc)}`} BTC</span>
                                                    :
                                                    <span>{`${(this.props.userDebtBalanceUsdt)}`} USDT</span>
                                                }
                                            </Grid>
                                        </Grid>
                                    </td>
                                    <td className="middle">
                                        {debt === "BTC" ?
                                            <span
                                                className={
                                                    `customTable__dataRow__healthFactor__
                                            ${(this.calculateHealthFactor(this.props.userDepositBalanceEth, this.props.priceOfEth, this.props.LTV["ETHBTC"], this.props.userDebtBalanceBtc, this.props.priceOfBtc) === "" || this.calculateHealthFactor(this.props.priceOfEth, this.props.priceOfEth, this.props.LTV["ETHBTC"], this.props.userDebtBalanceBtc, this.props.priceOfBtc) < 5
                                                    ) ? "safe" : "danger"}`
                                                }
                                            >
                                                {
                                                    `${this.calculateHealthFactor(this.props.userDepositBalanceEth, this.props.priceOfEth, this.props.LTV["ETHBTC"], this.props.userDebtBalanceBtc, this.props.priceOfBtc) !== "-" ? " " : ""}
                                            ${this.calculateHealthFactor(this.props.userDepositBalanceEth, this.props.priceOfEth, this.props.LTV["ETHBTC"], this.props.userDebtBalanceBtc, this.props.priceOfBtc)}`
                                                }
                                            </span>
                                            :
                                            <span
                                                className={
                                                    `customTable__dataRow__healthFactor__
                                            ${(this.calculateHealthFactor(this.props.userDepositBalanceAvax, this.props.priceOfAvax, this.props.LTV["AVAXUSDT"], this.props.userDebtBalanceUsdt, this.props.priceOfUsdt) === "" || this.calculateHealthFactor(this.props.priceOfEth, this.props.priceOfEth, this.props.LTV["ETHBTC"], this.props.userDebtBalanceBtc, this.props.priceOfBtc) < 5
                                                    ) ? "safe" : "danger"}`
                                                }
                                            >
                                                {
                                                    `${this.calculateHealthFactor(this.props.userDepositBalanceAvax, this.props.priceOfEth, this.props.LTV["AVAXUSDT"], this.props.userDebtBalanceUsdt, this.props.priceOfUsdt) !== "-" ? " " : ""}
                                            ${this.calculateHealthFactor(this.props.userDepositBalanceAvax, this.props.priceOfEth, this.props.LTV["AVAXUSDT"], this.props.userDebtBalanceUsdt, this.props.priceOfUsdt)}`
                                                }
                                            </span>
                                        }
                                    </td>
                                    <td className="middle">
                                        ${debt === "BTC" ?
                                            parseFloat(this.props.myBtcLpAmount * this.props.btcLpExchangeRate * this.props.priceOfBtc / 100).toFixed(2)
                                            :
                                            '-'
                                        }<br />
                                        {parseFloat(this.props.myBtcLpAmount * this.props.btcLpExchangeRate).toFixed(8)} BTC
                                    </td>
                                    <td className="lastOne">
                                        AAVE
                                    </td>
                                </tr>
                                <br></br>
                            </tbody>
                        </Table>
                    </Grid>
                    {/* main info table */}
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid lg={7} md={12} item>
                                <Grid container spacing={2}>
                                    <Grid item lg={6} md={12}>
                                        <Card
                                            widgetSize={"left"}
                                            title={"Collateral"}
                                            leftSelectButton={"deposit"}
                                            rightSelectButton={"withdraw"}
                                            currency={this.state.depositCurrency}
                                            currencyIconPath={this.state.depositCurrencyIconPath}
                                            maxBalance={this.state.maxdepositAmount}
                                            openBorrowingPower={false}
                                            bottomButtonTitle={"Deposit"}
                                            action={this.state.collateralAction}
                                            onClickSelect={(e) => {
                                                if (e.target.name === this.state.collateralAction) return;
                                                switch (e.target.name) {
                                                    case "deposit":
                                                        this.setState({
                                                            collateralAction: e.target.name,
                                                            collateralAmount: 0,
                                                            maxdepositAmount: (deposit === "ETH" ? Number(this.props.myETHAmount) : Number(this.props.myAVAXAmount))
                                                        })

                                                        break;
                                                    case "withdraw":
                                                        this.setState({
                                                            collateralAction: e.target.name,
                                                            collateralAmount: 0,
                                                            maxdepositAmount: deposit === "ETH" ? Number(this.props.userDepositBalanceEth) : Number(this.props.userDepositBalanceAvax)
                                                        })
                                                        break;
                                                    default:
                                                        break;
                                                }
                                            }}
                                            onClickDepositChange={(e) => {
                                                let finalAmount = this.roundDown(this.state.maxdepositAmount * e.target.name / 100, 18)
                                                this.setState({
                                                    collateralAmount: finalAmount,
                                                })
                                                this.props.dispatch(changeInputEthDeposit(finalAmount * (this.state.collateralAction === "deposit" ? 1 : -1)));
                                            }}
                                            onChangeInput={(e) => {
                                                this.setState({
                                                    collateralAmount: e.target.value === "" ? 0 : e.target.value
                                                })
                                                this.props.dispatch(changeInputEthDeposit(e.target.value * (this.state.collateralAction === "deposit" ? 1 : -1)));
                                            }}
                                            amount={this.state.collateralAmount}
                                            onClickMax={() => {
                                                this.setState({
                                                    collateralAmount: this.state.maxdepositAmount,
                                                })
                                            }}
                                            onClickDeposit={() => {
                                                let newHealthFactor =
                                                    this.calculateHealthFactor(
                                                        parseFloat(this.props.userDepositBalanceEth) + parseFloat(this.state.collateralAmount),
                                                        this.props.priceOfEth,
                                                        this.props.LTV["ETHBTC"],
                                                        this.props.userDebtBalanceBtc,
                                                        this.props.priceOfBtc);
                                                if (this.state.collateralAmount <= 0 || isNaN(this.state.collateralAmount)) {
                                                    this.toggleNoAction(
                                                        deposit,
                                                        'Unable to deposit',
                                                        'Please enter the amount that you want to deposit.',
                                                        deposit + debt
                                                    )
                                                } else if (Number(this.state.collateralAmount) > Number(this.props.myETHAmount)) {
                                                    this.toggleNoAction(
                                                        deposit,
                                                        'Unable to deposit',
                                                        'You do not have enough ETH to deposit.',
                                                        deposit + debt
                                                    )
                                                } else if (newHealthFactor < 1.06) {
                                                    this.toggleNoAction(
                                                        deposit,
                                                        'Unable to deposit',
                                                        'You are unable to deposit <span class="fw-bold">' +
                                                        this.state.collateralAmount + ' ' + deposit +
                                                        ' (~$' +
                                                        Number(this.state.collateralAmount * this.props.priceOfEth / 100).toFixed(2) +
                                                        ')</span>. <br/>The new health factor will be <span class="fw-bold" style="color: #ff7d47">' + newHealthFactor + '</span> which is below 1.05.',
                                                        deposit + debt
                                                    )
                                                } else {
                                                    this.toggleDeposit(
                                                        deposit,
                                                        'Confirm to deposit?',
                                                        'You are depositing <span class="fw-bold">' +
                                                        this.state.collateralAmount + ' ' + deposit +
                                                        ' (~$' +
                                                        Number(this.state.collateralAmount * this.props.priceOfEth / 100).toFixed(2) +
                                                        ')</span>. <br/>Your new health factor will be <span class="fw-bold" style="color: #68ca66">' + newHealthFactor + '</span>.',
                                                        deposit + debt)
                                                }
                                            }}
                                            onClickWithdraw={() => {
                                                let newHealthFactor =
                                                    this.calculateHealthFactor(
                                                        parseFloat(this.props.userDepositBalanceEth) - parseFloat(this.state.collateralAmount),
                                                        this.props.priceOfEth,
                                                        this.props.LTV["ETHBTC"],
                                                        this.props.userDebtBalanceBtc,
                                                        this.props.priceOfBtc);
                                                if (this.state.collateralAmount <= 0 || isNaN(this.state.collateralAmount)) {
                                                    this.toggleNoAction(
                                                        deposit,
                                                        'Unable to withdraw',
                                                        'Please enter the amount that you want to withdraw.',
                                                        deposit + debt
                                                    )
                                                } else if (this.state.collateralAmount > this.state.maxdepositAmount) {
                                                    this.toggleNoAction(
                                                        deposit,
                                                        'Unable to withdraw',
                                                        'You do not have so much ETH to withdraw.',
                                                        deposit + debt
                                                    )
                                                } else if (newHealthFactor < 1.06) {
                                                    this.toggleNoAction(
                                                        deposit,
                                                        'Unable to withdraw',
                                                        'You are unable to withdraw <span class="fw-bold">' +
                                                        this.state.collateralAmount + ' ' + deposit +
                                                        ' (~$' +
                                                        Number(this.state.collateralAmount * this.props.priceOfEth / 100).toFixed(2) +
                                                        ')</span>. <br/>The new health factor will be <span class="fw-bold" style="color: #ff7d47">' + newHealthFactor + '</span> which is below 1.05.',
                                                        deposit + debt
                                                    )
                                                } else {
                                                    this.toggleWithdrawn(
                                                        deposit,
                                                        'Confirm to withdraw?',
                                                        'You are withdrawing <span class="fw-bold">' +
                                                        this.state.collateralAmount + ' ' + deposit +
                                                        ' (~$' +
                                                        Number(this.state.collateralAmount * this.props.priceOfEth / 100).toFixed(2) +
                                                        ')</span>. <br/>Your new health factor will be <span class="fw-bold" style="color: #68ca66">' + newHealthFactor + '</span>.',
                                                        deposit + debt)
                                                }
                                            }}
                                        >
                                        </Card>
                                    </Grid>
                                    <Grid item lg={6} md={12}>
                                        <Card
                                            widgetSize={"right"}
                                            title={"Debt"}
                                            leftSelectButton={"borrow"}
                                            rightSelectButton={"payback"}
                                            currency={this.state.debtCurrency}
                                            currencyIconPath={this.state.debtCurrencyIconPath}
                                            maxBalance={this.state.maxdebtAmount}
                                            amount={this.state.debtAmount}
                                            openBorrowingPower={true}
                                            bottomButtonTitle={"Borrow"}
                                            action={this.state.debtAction}
                                            onClickSelect={(e) => {
                                                if (e.target.name === this.state.collateralAction) return
                                                switch (e.target.name) {
                                                    case "borrow":
                                                        var borrowPower = (this.props.selectedPair === "ETHBTC" ? this.props.userDepositBalanceEth : this.props.userDepositBalanceAvax);
                                                        borrowPower = borrowPower * (this.props.selectedPair === "ETHBTC" ? this.props.priceOfEth : this.props.priceOfAvax);
                                                        borrowPower = borrowPower * this.props.LTV[this.props.selectedPair];
                                                        borrowPower = borrowPower * this.props.liquidationPrice[this.props.selectedPair];
                                                        borrowPower = borrowPower / (this.props.selectedPair === "ETHBTC" ? this.props.priceOfBtc : this.props.priceOfUsdt);
                                                        borrowPower = borrowPower - this.props.userDebtBalanceBtc;

                                                        this.setState({
                                                            debtAction: e.target.name,
                                                            debtAmount: 0,
                                                            maxdebtAmount: borrowPower.toFixed(8)
                                                        })
                                                        break;
                                                    case "payback":
                                                        this.setState({
                                                            debtAction: e.target.name,
                                                            debtAmount: 0,
                                                            maxdebtAmount: debt === "BTC" ? Number(this.props.userDebtBalanceBtc).toFixed(8) : Number(this.props.userDebtBalanceUsdt).toFixed(8)
                                                        })
                                                        break;
                                                    default:
                                                        break;
                                                }
                                            }}
                                            onChangeInput={(e) => {
                                                this.setState({
                                                    debtAmount: e.target.value === "" ? 0 : e.target.value
                                                })
                                                this.props.dispatch(changeInputBtcDebt(e.target.value * (this.state.debtAction === "borrow" ? 1 : -1)));
                                            }}
                                            onClickMax={() => {
                                                this.setState({
                                                    debtAmount: this.state.maxdebtAmount,
                                                })
                                            }}
                                            onClickBorrowingPowerChange={(e) => {
                                                let finalAmount = this.roundDown(this.state.maxdebtAmount * e.target.name / 100, 8)
                                                this.setState({
                                                    debtAmount: finalAmount,
                                                })
                                                this.props.dispatch(changeInputBtcDebt(finalAmount * (this.state.debtAction === "borrow" ? 1 : -1)));
                                            }}
                                            onClickPayback={() => {
                                                let newHealthFactor =
                                                    this.calculateHealthFactor(
                                                        parseFloat(this.props.userDepositBalanceEth),
                                                        this.props.priceOfEth,
                                                        this.props.LTV["ETHBTC"],
                                                        parseFloat(this.props.userDebtBalanceBtc) - parseFloat(this.state.debtAmount),
                                                        this.props.priceOfBtc);
                                                if (Number(this.state.debtAmount) <= 0 || isNaN(this.state.debtAmount)) {
                                                    this.toggleNoAction(
                                                        deposit,
                                                        'Unable to payback',
                                                        'Please enter the amount that you want to payback.',
                                                        deposit + debt
                                                    )
                                                } else if (Number(this.state.debtAmount) > (this.props.myBTCAmount)) {
                                                    this.toggleNoAction(
                                                        deposit,
                                                        'Unable to payback',
                                                        'You do not have enough BTC to payback.',
                                                        deposit + debt
                                                    )
                                                } else if (Number(newHealthFactor) < 1.06) {
                                                    this.toggleNoAction(
                                                        deposit,
                                                        'Unable to payback',
                                                        'You are unable to payback <span class="fw-bold">' +
                                                        this.state.debtAmount + ' ' + debt +
                                                        ' (~$' +
                                                        Number(this.state.debtAmount * this.props.priceOfBtc / 100).toFixed(2) +
                                                        ')</span>. <br/>The new health factor will be <span class="fw-bold" style="color: #ff7d47">' + newHealthFactor + '</span> which is below 1.05.',
                                                        deposit + debt
                                                    )

                                                } else {
                                                    this.togglePayback(
                                                        deposit,
                                                        'Confirm to payback?',
                                                        'You are paying back <span class="fw-bold">' +
                                                        this.state.debtAmount + ' ' + debt +
                                                        ' (~$' +
                                                        Number(this.state.debtAmount * this.props.priceOfBtc / 100).toFixed(2) +
                                                        ')</span>. <br/>Your new health factor will be <span class="fw-bold" style="color: #68ca66">' + newHealthFactor + '</span>.',
                                                        deposit + debt)
                                                }
                                            }}
                                            onClickBorrow={() => {
                                                let newHealthFactor =
                                                    this.calculateHealthFactor(
                                                        parseFloat(this.props.userDepositBalanceEth),
                                                        this.props.priceOfEth,
                                                        this.props.LTV["ETHBTC"],
                                                        parseFloat(this.props.userDebtBalanceBtc) + parseFloat(this.state.debtAmount),
                                                        this.props.priceOfBtc);
                                                if (Number(this.state.debtAmount) <= 0 || isNaN(this.state.debtAmount)) {
                                                    this.toggleNoAction(
                                                        deposit,
                                                        'Unable to borrow',
                                                        'Please enter the amount that you want to borrow.',
                                                        deposit + debt
                                                    )
                                                } else if (Number(newHealthFactor) < 1.06) {
                                                    this.toggleNoAction(
                                                        deposit,
                                                        'Unable to borrow',
                                                        'You are unable to borrow <span class="fw-bold">' +
                                                        this.state.debtAmount + ' ' + debt +
                                                        ' (~$' +
                                                        Number(this.state.debtAmount * this.props.priceOfBtc / 100).toFixed(2) +
                                                        ')</span>. <br/>The new health factor will be <span class="fw-bold" style="color: #ff7d47">' + newHealthFactor + '</span> which is below 1.05.',
                                                        deposit + debt
                                                    )
                                                } else {
                                                    this.toggleBorrow(
                                                        deposit,
                                                        'Confirm to borrow?',
                                                        'You are borrowing <span class="fw-bold">' +
                                                        this.state.debtAmount + ' ' + debt +
                                                        ' (~$' +
                                                        Number(this.state.debtAmount * this.props.priceOfBtc / 100).toFixed(2) +
                                                        ')</span>. <br/>Your new health factor will be <span class="fw-bold" style="color: #68ca66">' + newHealthFactor + '</span>.',
                                                        deposit + debt
                                                    )
                                                }
                                            }}
                                        ></Card>
                                    </Grid>
                                    {debt === "BTC" ?
                                        <>
                                            <Grid item lg={6} md={12}>
                                                <Card
                                                    widgetSize={"right"}
                                                    title={"Current Smart Vault Balance"}
                                                    extraHtmlContent={"<br /><p style='font-size: 14px'> Trigger Health Factor: "
                                                        + parseFloat( window.web3.utils.fromWei(this.props.myProtectionEth[0], 'ether') )
                                                        + "<br />"
                                                        + "Top-up amount each time: "
                                                        + parseFloat( window.web3.utils.fromWei(this.props.myProtectionEth[5], 'ether') )
                                                        + "<br />"
                                                        + "Remaining prepaid gas fee: "
                                                        + parseFloat(this.props.myGasBankBalance)
                                                        + "</p>"}
                                                    currencyIconPath={this.state.depositCurrencyIconPath}
                                                    leftSelectButton={""}
                                                    rightSelectButton={""}
                                                    currency={"eth"}
                                                    openBorrowingPower={false}
                                                    amount={parseFloat(this.props.myEthLpAmount * this.props.ethLpExchangeRate).toFixed(8)}
                                                    maxBalance={this.props.myEthLpAmount}
                                                    onChangeInput={(e) => {
                                                        this.setState({
                                                            debtAmount: e.target.value === "" ? 0 : e.target.value
                                                        })
                                                    }}
                                                    onClickWithdraw={() => {
                                                        if (this.props.myEthLpAmount <= 0) {
                                                            this.toggleNoAction(
                                                                deposit,
                                                                'Unable to withdraw all from Smart Vault',
                                                                'You do not have any ETH in Smart Vault.',
                                                                deposit + debt
                                                            )
                                                        } else {
                                                            this.toggleLeaveSmartVaultETH(deposit,
                                                                'Confirm to withdraw all from Smart Vault?',
                                                                'You are withdrawing <span class="fw-bold">' +
                                                                parseFloat(this.props.myEthLpAmount * this.props.ethLpExchangeRate).toFixed(8) +
                                                                ' ETH (~$' +
                                                                parseFloat(this.props.myEthLpAmount * this.props.ethLpExchangeRate * this.props.priceOfEth / 100).toFixed(2) +
                                                                ')</span> from Smart Vault. Remaining gas fee of ' + parseFloat(this.props.myGasBankBalance) + ' AVAX will be returned. <span class="fw-bold" style="color: #ff7d47"><br/>Caution: you will lose your automatic loan protection if you withdraw.</span>', 0)
                                                        }
                                                    }}
                                                ></Card>
                                            </Grid>
                                            <Grid item lg={6} md={12}>
                                            <Card
                                                widgetSize={"left"}
                                                title={"Current Smart Vault Balance"}
                                                extraHtmlContent={"<br /><p style='font-size: 14px'> Trigger Health Factor: "
                                                    + parseFloat(window.web3.utils.fromWei(this.props.myProtectionEth[0], 'ether'))
                                                    + "<br />"
                                                    + "Repay amount each time: "
                                                    + parseFloat(this.props.myProtection[5] / 0.9999 / 100000000)
                                                    + "<br />"
                                                    + "Remaining prepaid gas fee: "
                                                    + parseFloat(this.props.myGasBankBalance)
                                                    + "</p>"}
                                                currencyIconPath={this.state.debtCurrencyIconPath}
                                                leftSelectButton={""}
                                                rightSelectButton={""}
                                                currency={"btc"}
                                                openBorrowingPower={false}
                                                amount={parseFloat(this.props.myBtcLpAmount * this.props.btcLpExchangeRate).toFixed(8)}
                                                maxBalance={this.props.myBtcLpAmount}
                                                onChangeInput={(e) => {
                                                    this.setState({
                                                        debtAmount: e.target.value === "" ? 0 : e.target.value
                                                    })
                                                }}
                                                onClickWithdraw={() => {
                                                    if (this.props.myBtcLpAmount <= 0) {
                                                        this.toggleNoAction(
                                                            deposit,
                                                            'Unable to withdraw all from Smart Vault',
                                                            'You do not have any BTC in Smart Vault.',
                                                            deposit + debt
                                                        )
                                                    } else {
                                                        this.toggleLeaveSmartVault(debt,
                                                            'Confirm to withdraw all from Smart Vault?',
                                                            'You are withdrawing <span class="fw-bold">' +
                                                            parseFloat(this.props.myBtcLpAmount * this.props.btcLpExchangeRate).toFixed(8) +
                                                            ' BTC (~$' +
                                                            parseFloat(this.props.myBtcLpAmount * this.props.btcLpExchangeRate * this.props.priceOfBtc / 100).toFixed(2) +
                                                            ')</span> from Smart Vault. Remaining gas fee of ' + parseFloat(this.props.myGasBankBalance) + ' AVAX will be returned. <span class="fw-bold" style="color: #ff7d47"><br/>Caution: you will lose your automatic loan protection if you withdraw.</span>', 0)
                                                    }
                                                }}
                                            ></Card>
                                        </Grid>
                                            </>
                                        :
                                        null
                                    }
                                </Grid>
                            </Grid>
                            {/* circle table */}
                            <Grid lg={5} md={12} item>
                                <Grid container>
                                    <Grid item xs={12}>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <HealthFactorPieChart />
                                        <Grid item xs={12}>
                                            <TradeInfo />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                </Grid>

                <Modal centered isOpen={this.state.modal} toggle={this.toggle} style={{ color: '#000000' }}>
                    <ModalBody style={{ color: '#ffffff', backgroundColor: '#000000', border: 'solid', borderRadius: '5px', borderColor: '#ffffff' }}>
                        <Row>
                            <Col style={{ paddingTop: '20px', paddingLeft: '40px', paddingRight: '40px' }} sm={11}>
                                <h4 className={"fw-bold"}>{this.state.modalTitle}</h4>
                            </Col>
                            <Col sm={1}>
                                <Button close color="secondary" onClick={this.toggle}></Button>
                            </Col>
                            <Col style={{ paddingTop: '20px', paddingLeft: '40px', paddingRight: '40px' }} sm={12}>
                                <div className="content" dangerouslySetInnerHTML={{ __html: this.state.modalMessage }}></div>
                            </Col>
                            <Col style={{ display: 'none' }} sm={12}>
                                <Input disabled className={`amount-text`}
                                    style={{ backgroundColor: 'transparent', color: '#ffffff' }}
                                    value={Number(this.state.modalInputValue)}>
                                </Input> {this.state.modalToken}
                            </Col>
                            <Col style={{ paddingTop: '20px', paddingLeft: '40px', paddingRight: '40px' }} sm={12}>
                                <Button block className={'manage-button'} style={{ padding: '5px' }}
                                    onClick={this.state.modalCall ? this.state.modalCall : this.toggle}>
                                    {this.state.modalCall ? 'Confirm' : 'Close'}
                                </Button>
                            </Col>
                        </Row>
                    </ModalBody>
                </Modal>
            </div >
        );
    }
}

function mapStateToProps(store) {
    return {
        myAccount: store.loanshark.myAccount,
        selectedPair: store.loanshark.selectedPair,
        numberOfEth: store.loanshark.numberOfEth,
        userDepositBalanceEth: store.loanshark.userDepositBalanceEth,
        userDepositBalanceAvax: store.loanshark.userDepositBalanceAvax,
        userDebtBalanceBtc: store.loanshark.userDebtBalanceBtc,
        userDebtBalanceUsdt: store.loanshark.userDebtBalanceUsdt,
        myFujiVaultETHBTC: store.loanshark.myFujiVaultETHBTC,
        myFujiVaultAVAXUSDT: store.loanshark.myFujiVaultAVAXUSDT,
        myFliquidatorAVAX: store.loanshark.myFliquidatorAVAX,
        myFujiController: store.loanshark.myFujiController,
        myFujiOracle: store.loanshark.myFujiOracle,
        mySmartVaultBtc: store.loanshark.mySmartVaultBtc,
        mySmartVaultUsdt: store.loanshark.mySmartVaultUsdt,
        myETHContract: store.loanshark.myETHContract,
        myBTCContract: store.loanshark.myBTCContract,
        myUSDTContract: store.loanshark.myUSDTContract,
        priceOfEth: store.loanshark.priceOfEth,
        priceOfBtc: store.loanshark.priceOfBtc,
        priceOfAvax: store.loanshark.priceOfAvax,
        priceOfUsdt: store.loanshark.priceOfUsdt,
        providerAAVEAVAX: store.loanshark.providerAAVEAVAX,
        smartVaultBtc: store.loanshark.smartVaultBtc,
        smartVaultUsdt: store.loanshark.smartVaultUsdt,
        myETHAmount: store.loanshark.myETHAmount,
        myBTCAmount: store.loanshark.myBTCAmount,
        myAVAXAmount: store.loanshark.myAVAXAmount,
        myUSDTAmount: store.loanshark.myUSDTAmount,
        LTV: store.loanshark.LTV,
        liquidationPrice: store.loanshark.liquidationPrice,

        lpPoolBtc: store.backd.lpPoolBtc,
        lpTokenBtc: store.backd.lpTokenBtc,
        myBtcLpAmount: store.backd.myBtcLpAmount,
        btcLpExchangeRate: store.backd.btcLpExchangeRate,
        totalBtcLpAmount: store.backd.totalBtcLpAmount,
        topupAction: store.backd.topupAction,
        myProtection: store.backd.myProtection,
        myGasBankBalance: store.backd.myGasBankBalance,

        lpPoolEth: store.backd.lpPoolEth,
        lpTokenEth: store.backd.lpTokenEth,
        myEthLpAmount: store.backd.myEthLpAmount,
        ethLpExchangeRate: store.backd.ethLpExchangeRate,
        totalEthLpAmount: store.backd.totalEthLpAmount,
        myProtectionEth: store.backd.myProtectionEth,
    };
}

export default connect(mapStateToProps)(Manage);