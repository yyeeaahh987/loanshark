import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import PropTypes from "prop-types";
import { Grid } from '@mui/material';
import { Row, Col, Table, Input, Button, Modal, ModalBody } from 'reactstrap';

import TradeInfo from "../../components/TradeInfo";
import HealthFactorPieChart from "../../components/HealthFactorPieChart";
import { changeSelectedPair } from "../../actions/loanshark";
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

    componentDidMount() {
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
                maxdepositAmount: Number(this.props.myAVAXAmount).toFixed(6),
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

            this.setState({
                depositCurrency: deposit,
                depositAmount: this.props.userDepositBalanceEth,
                maxdepositAmount: Number(this.props.myETHAmount).toFixed(6),
                depositCurrencyIconPath: `/assets/icon/${deposit.toLowerCase()}-logo.svg`,
                debtCurrency: debt,
                debtAmount: 0,
                maxdebtAmount: Number(borrowPower).toFixed(6),
                debtCurrencyIconPath: `/assets/icon/${debt.toLowerCase()}-logo.svg`,

                maxWithdrawAmount: Number(this.props.userDepositBalanceEth),
                debtCurrencyPrice: Number(this.props.priceOfBtc),
                maxDetAmount: Number(this.props.myBTCAmount),
                maxPaybackAmount: Number(this.props.userDebtBalanceBtc),
            })
            this.props.dispatch(changeSelectedPair("ETHBTC"));
        }
        this.forceUpdate();
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
        console.log(`depositAmouont`, depositAmouont)
        console.log(`debtAmount`, debtAmount)
        if (debtAmount === undefined || debtAmount === null || debtAmount === 0) return "-"
        return ((depositAmouont * priceOfdeposit / 100) * LTV / (debtAmount * priceOfDebt / 100)).toFixed(2)
    }

    toggleDeposit(inputModalToken, inputModalAction, pair) {
        this.setState({
            modal: !this.state.modal,
            modalTitle: inputModalAction + " " + inputModalToken,
            modalToken: inputModalToken,
            modalAction: inputModalAction,
            modalInputValue: this.state.collateralAmount,
            modalCall: () => {
                let approveArgs = [
                    (pair === "ETHBTC" ? this.props.myFujiVaultETHBTC.options.address : pair === "AVAXUSDT" ? this.props.myFujiVaultAVAXUSDT.options.address : ""),
                    window.web3.utils.toBN(window.web3.utils.toWei(this.state.modalInputValue, 'ether')).toString()
                ]

                let args = [
                    window.web3.utils.toBN(window.web3.utils.toWei(this.state.modalInputValue, 'ether')).toString(),
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

                    let a = window.web3.utils.toBN(window.web3.utils.toWei(this.state.modalInputValue, 'ether')).toString();
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

    toggleWithdrawn(inputModalToken, inputModalAction, pair) {
        this.setState({
            modal: !this.state.modal,
            modalTitle: inputModalAction + " " + inputModalToken,
            modalToken: inputModalToken,
            modalAction: inputModalAction,
            modalInputValue: this.state.collateralAmount,
            modalCall: () => {
                let args = [
                    window.web3.utils.toBN(window.web3.utils.toWei(this.state.modalInputValue, 'ether')).toString(),
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

    toggleBorrow(inputModalToken, inputModalAction, pair) {
        this.setState({
            modal: !this.state.modal,
            modalTitle: inputModalAction + " " + inputModalToken,
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

    togglePayback(inputModalToken, inputModalAction, pair) {
        this.setState({
            modal: !this.state.modal,
            modalTitle: inputModalAction + " " + inputModalToken,
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

    toggleLeaveSmartVault(inputModalToken, inputModalAction, pair) {
        this.setState({
            modal: !this.state.modal,
            modalTitle: inputModalAction,
            modalToken: inputModalToken,
            modalAction: inputModalAction,
            modalInputValue: this.props.myBtcLpAmount,
            modalCall: () => {
                let args = [
                    window.web3.utils.toBN((this.state.modalInputValue * 100000000).toFixed(0)).toString(),
                ];

                this.toggle();
                this.calltoggleLoading();

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
        });
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
                                        {debt === "BTC" ?
                                            this.props.myBtcLpAmount * this.props.priceOfBtc
                                            :
                                            '-'
                                        }
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
                                                            maxdepositAmount: (deposit === "ETH" ? Number(this.props.myETHAmount).toFixed(6) : Number(this.props.myAVAXAmount).toFixed(6))
                                                        })

                                                        break;
                                                    case "withdraw":
                                                        this.setState({
                                                            collateralAction: e.target.name,
                                                            collateralAmount: 0,
                                                            maxdepositAmount: deposit === "ETH" ? Number(this.props.userDepositBalanceEth).toFixed(6) : Number(this.props.userDepositBalanceAvax).toFixed(6)
                                                        })
                                                        break;
                                                    default:
                                                        break;
                                                }
                                            }}
                                            onChangeInput={(e) => {
                                                this.setState({
                                                    collateralAmount: e.target.value === "" ? 0 : e.target.value
                                                })
                                            }}
                                            amount={this.state.collateralAmount}
                                            onClickMax={() => {
                                                this.setState({
                                                    collateralAmount: this.state.maxdepositAmount,
                                                })
                                            }}
                                            onClickDeposit={() => {
                                                this.toggleDeposit(deposit, 'Deposit', deposit + debt)
                                            }}
                                            onClickWithdraw={() => {
                                                this.toggleWithdrawn(deposit, 'Withdraw', deposit + debt)
                                            }}
                                        ></Card>
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

                                                        this.setState({
                                                            debtAction: e.target.name,
                                                            debtAmount: 0,
                                                            maxdebtAmount: borrowPower.toFixed(6)
                                                        })
                                                        break;
                                                    case "payback":
                                                        this.setState({
                                                            debtAction: e.target.name,
                                                            debtAmount: 0,
                                                            maxdebtAmount: debt === "BTC" ? Number(this.props.userDebtBalanceBtc).toFixed(6) : Number(this.props.userDebtBalanceUsdt).toFixed(6)
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
                                            }}
                                            onClickMax={() => {
                                                this.setState({
                                                    debtAmount: this.state.maxdebtAmount,
                                                })
                                            }}
                                            onClickBorrowingPowerChange={(e) => {
                                                let finalAmount = (this.state.maxdebtAmount * e.target.name / 100).toFixed(6)
                                                this.setState({
                                                    debtAmount: finalAmount,
                                                })
                                            }}
                                            onClickPayback={() => {
                                                this.togglePayback(debt, 'Payback', deposit + debt)
                                            }}
                                            onClickBorrow={() => {
                                                this.toggleBorrow(debt, 'Borrow', deposit + debt)
                                            }}
                                        ></Card>
                                    </Grid>
                                    {debt === "BTC" ?
                                        <Grid item lg={6} md={12}>
                                            <Card
                                                widgetSize={"full"}
                                                title={"Current Smart Vault Balance"}
                                                currencyIconPath={this.state.debtCurrencyIconPath}
                                                leftSelectButton={""}
                                                rightSelectButton={""}
                                                currency={"btc"}
                                                openBorrowingPower={false}
                                                amount={this.props.myBtcLpAmount}
                                                maxBalance={this.props.myBtcLpAmount}
                                                onChangeInput={(e) => {
                                                    this.setState({
                                                        debtAmount: e.target.value === "" ? 0 : e.target.value
                                                    })
                                                }}
                                                onClickWithdraw={() => {
                                                    this.toggleLeaveSmartVault(debt, 'Leave Smart Vault', deposit + debt)
                                                }}
                                            ></Card>
                                        </Grid>
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
                                <Input disabled className={`amount-text`}
                                    style={{ backgroundColor: 'transparent', color: '#ffffff' }}
                                    value={Number(this.state.modalInputValue)}>
                                </Input>
                            </Col>
                            <Col style={{ paddingTop: '20px', paddingLeft: '40px', paddingRight: '40px' }} sm={12}>
                                <Button block color={'light'} style={{ padding: '5px', color: '#000000' }} onClick={this.state.modalCall}>Confirm</Button>
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
        totalBtcLpAmount: store.backd.totalBtcLpAmount,
        topupAction: store.backd.topupAction,
    };
}

export default connect(mapStateToProps)(Manage);