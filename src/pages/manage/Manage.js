import React from "react";
import { connect } from "react-redux";
import { Switch, Route, withRouter, Redirect } from "react-router";
import PropTypes from "prop-types";
import usersImg from "../../images/usersImg.svg";
import smileImg from "../../images/smileImg.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from "@fortawesome/free-solid-svg-icons"
import { Grid } from '@mui/material';
import {
    Row, Col, Table,
    Input,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from 'reactstrap';
import { MDBContainer } from "mdbreact";
import { Doughnut } from "react-chartjs-2";
import {
    toggleLoading,
} from "../../actions/navigation";
import './Manage.scss'

import API from '../../utils/API'
import DisplayBox from '../../components/DisplayBox/DisplayBox'
import Widget from "../../components/Widget";
import TableRow from '../../components/TableRow/TableRow'
import Card from './Card/Card'
import Popup from '../../components/Popup/Popup'


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
        // this.forceUpdate = this.forceUpdate.bind(this);
        // this.toggle = this.toggle.bind(this);
        // this.toggleDeposit = this.toggleDeposit.bind(this);
        // this.toggleBorrow = this.toggleBorrow.bind(this);
        // this.togglePayback = this.togglePayback.bind(this);
        // this.toggleWithdrawn = this.toggleWithdrawn.bind(this);
        this.calltoggleLoading = this.calltoggleLoading.bind(this);
        // this.setInput = this.setInput.bind(this);
        // this.state = {
        //   modal: false,
        //   modalTitle: '',
        //   modalToken: '',
        //   modalAction: '',
        //   modalCall: () => { },
        //   modalInputValue: 0,
        //   loadingActive: false
        // };
        this.state = {
            depositeCurrency: "",
            depositeAmount: 0,
            maxDepositeAmount: 0,
            maxWithdrawAmount: 0,
            depositeCurrencyIconPath: "",
            debitCurrency: "",
            debitAmount: 0,
            maxDebitAmount: 0,
            maxPaybackAmount: 0,
            debitCurrencyIconPath: "",
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
            debitAction: "borrow",
            depositeCurrencyPrice: 0,
            debitCurrencyPrice: 0,
        }
    }

    componentDidMount() {
        if ((this?.props?.location?.state?.pair ?? "") === "") return
        let tempPari = this.props.location.state.pair.split("_")
        let deposite = tempPari[0]
        let debit = tempPari[1]
        if (deposite === "AVAX") {
            this.setState({
                depositeCurrency: deposite,
                depositeCurrencyPrice: Number(this.props.priceOfAvax),
                depositeAmount: Number(this.props.userDepositBalanceAvax),
                maxDepositeAmount: Number(this.props.myAVAXAmount),
                maxWithdrawAmount: Number(this.props.userDepositBalanceAvax),
                depositeCurrencyIconPath: `/assets/icon/${deposite.toLowerCase()}-logo.svg`,
                debitCurrency: debit,
                debitCurrencyPrice: Number(this.props.priceOfUsdt),
                debitAmount: Number(this.props.userDebtBalanceUsdt),
                maxDebitAmount: Number(this.props.myUSDTAmount),
                maxPaybackAmount: Number(this.props.userDebtBalanceUsdt),
                debitCurrencyIconPath: `/assets/icon/${debit.toLowerCase()}-logo.svg`,
            })
        }
        if (deposite === "ETH") {
            this.setState({
                depositeCurrency: deposite,
                depositeCurrencyPrice: Number(this.props.priceOfEth),
                depositeAmount: Number(this.props.userDepositBalanceEth),
                maxDepositeAmount: Number(this.props.myETHAmount),
                maxWithdrawAmount: Number(this.props.userDepositBalanceEth),
                depositeCurrencyIconPath: `/assets/icon/${deposite.toLowerCase()}-logo.svg`,
                debitCurrency: debit,
                debitCurrencyPrice: Number(this.props.priceOfBtc),
                debitAmount: Number(this.props.userDebtBalanceBtc),
                maxDebitAmount: Number(this.props.myBTCAmount),
                maxPaybackAmount: Number(this.props.userDebtBalanceBtc),
                debitCurrencyIconPath: `/assets/icon/${debit.toLowerCase()}-logo.svg`,
            })
        }
    }

    calltoggleLoading() {
        this.props.dispatch(toggleLoading());
    }

    render() {
        if ((this.props?.location?.state?.pair ?? "") === "") {
            //redirect for no pair get from history
            return <Redirect to="/app/main/dashboard" />
        }
        return (
            <div
                def={console.log(this.props)}
                abc={console.log(this.state)}
            >
                <Grid container>
                    {/* main info table */}
                    <Grid item xs={12}>
                        <Grid container spacing={2}>


                            <Grid xs={7} item>
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
                                                    <th key={3} scope="col" className={"customTable__headRow__item"}>
                                                        APY
                                                    </th>
                                                    <th key={4} scope="col" className={"customTable__headRow__item"}>
                                                        Health Factor
                                                    </th>
                                                    <th key={5} scope="col" className={"customTable__headRow__item"}>
                                                        Smart Value
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
                                                            <img className="icon" src={this.state.depositeCurrencyIconPath} alt="x"></img>
                                                        </span>
                                                        /
                                                        <span style={{ padding: "5px" }}>
                                                            <img className="icon" src={this.state.debitCurrencyIconPath} alt="x"></img>
                                                        </span>
                                                        {`${this.state.depositeCurrency}/${this.state.debitCurrency}`}
                                                    </td>
                                                    <td className="middle">
                                                        <Grid container>
                                                            <Grid xs={12}>
                                                                <span>{`$${(this.state.depositeAmount * this.state.depositeCurrencyPrice / 100).toFixed(2)}`}</span>
                                                            </Grid>
                                                            <Grid xs={12}>
                                                                <span>{`${Number(this.state.depositeAmount).toFixed(2)}`} {this.state.depositeCurrency}</span>
                                                            </Grid>
                                                        </Grid>
                                                    </td>
                                                    <td className="middle">
                                                        <Grid container>
                                                            <Grid xs={12}>
                                                                <span>{`$${(this.state.debitAmount * this.state.debitCurrencyPrice / 100).toFixed(2)}`}</span>
                                                            </Grid>
                                                            <Grid xs={12}>
                                                                <span>{`${Number(this.state.debitAmount).toFixed(2)}`} {this.state.debitCurrency}</span>
                                                            </Grid>
                                                        </Grid>
                                                    </td>
                                                    <td className="middle">
                                                        20.4% (hardcode)
                                                    </td>
                                                    <td className="middle">
                                                        <span className="customTable__dataRow__healthFactor__safe">20</span>
                                                    </td>
                                                    <td className="middle">
                                                        $19,294 (hardcode)
                                                    </td>
                                                    <td className="lastOne">
                                                        AAVE (hardcode)
                                                    </td>
                                                </tr>
                                                <br></br>
                                            </tbody>
                                        </Table>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid container>
                                            <Grid item xs={6}>
                                                <Card
                                                    widgetSize={"left"}
                                                    title={"Collateral"}
                                                    leftSelectButton={"deposit"}
                                                    rightSelectButton={"withdraw"}
                                                    currency={this.state.depositeCurrency}
                                                    currencyIconPath={this.state.depositeCurrencyIconPath}
                                                    maxBalance={
                                                        this.state.collateralAction === "deposit" ?
                                                            this.state.maxDepositeAmount : (this.state.collateralAction === "withdraw" ? this.state.maxWithdrawAmount : 0)
                                                    }
                                                    openBorrowingPower={false}
                                                    bottomButtonTitle={"Deposit"}
                                                    action={this.state.collateralAction}
                                                    onClickSelect={(e) => {
                                                        if (e.target.name === this.state.collateralAction) return
                                                        switch (e.target.name) {
                                                            case "deposit":
                                                            case "withdraw":
                                                                this.setState({
                                                                    collateralAction: e.target.name,
                                                                    collateralAmount: 0
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
                                                            collateralAmount: this.state.maxDepositeAmount,
                                                        })
                                                    }}
                                                    onClickDeposite={() => {
                                                        this.calltoggleLoading();
                                                        let pair = `${this.state.depositeCurrency}${this.state.debitCurrency}`
                                                        let approveArgs = []
                                                        switch (pair) {
                                                            case "ETHBTC":
                                                                approveArgs.push(this.props.myFujiVaultETHBTC.options.address)
                                                                break;
                                                            case "AVAXUSDT":
                                                                approveArgs.push(this.props.myFujiVaultAVAXUSDT.options.address)
                                                                break;
                                                            default:
                                                        }
                                                        approveArgs.push(window.web3.utils.toBN(window.web3.utils.toWei(this.state.collateralAmount, 'ether')).toString())

                                                        let args = [
                                                            window.web3.utils.toBN(window.web3.utils.toWei(this.state.collateralAmount, 'ether')).toString(),
                                                        ];

                                                        switch (pair) {
                                                            case "ETHBTC":
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
                                                                break;
                                                            case "AVAXUSDT":
                                                                let a = window.web3.utils.toBN(window.web3.utils.toWei(this.state.collateralAmount, 'ether')).toString();
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
                                                                break;
                                                            default:
                                                        }
                                                    }}
                                                    onClickWithdraw={() => {
                                                        this.calltoggleLoading();
                                                        let args = [
                                                            window.web3.utils.toBN(window.web3.utils.toWei(this.state.collateralAmount, 'ether')).toString(),
                                                        ];
                                                        let pair = `${this.state.depositeCurrency}${this.state.debitCurrency}`
                                                        switch (pair) {
                                                            case "ETHBTC":
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
                                                                break;
                                                            case "AVAXUSDT":
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
                                                                break;
                                                            default:
                                                        }
                                                    }}
                                                ></Card>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Card
                                                    widgetSize={"right"}
                                                    title={"Debt"}
                                                    leftSelectButton={"borrow"}
                                                    rightSelectButton={"payback"}
                                                    currency={this.state.debitCurrency}
                                                    currencyIconPath={this.state.debitCurrencyIconPath}
                                                    maxBalance={
                                                        this.state.debitAction === "borrow" ?
                                                            this.state.maxDebitAmount : (this.state.debitAction === "payback" ? this.state.maxPaybackAmount : 0)
                                                    }


                                                    amount={this.state.debitAmount}
                                                    openBorrowingPower={true}
                                                    bottomButtonTitle={"Borrow"}
                                                    action={this.state.debitAction}
                                                    onClickSelect={(e) => {
                                                        if (e.target.name === this.state.debitAction) return
                                                        switch (e.target.name) {
                                                            case "borrow":
                                                            case "payback":
                                                                this.setState({
                                                                    debitAction: e.target.name,
                                                                    debitAmount: 0
                                                                })
                                                                break;
                                                            default:
                                                                break;
                                                        }
                                                    }}
                                                    onChangeInput={(e) => {
                                                        this.setState({
                                                            debitAmount: e.target.value === "" ? 0 : e.target.value
                                                        })
                                                    }}
                                                    onClickMax={() => {
                                                        switch (this.state.debitAction) {
                                                            case "borrow":
                                                                this.setState({
                                                                    debitAmount: this.state.maxDebitAmount,
                                                                })
                                                                break;
                                                            case "payback":
                                                                this.setState({
                                                                    debitAmount: this.state.maxPaybackAmount,
                                                                })
                                                                break;
                                                            default:
                                                                break;
                                                        }
                                                    }}
                                                    onClickBorrowingPowerChange={(e) => {
                                                        let finalAmount = (this.state.maxDebitAmount * e.target.name / 100).toFixed(2)
                                                        this.setState({
                                                            debitAmount: finalAmount,
                                                        })
                                                    }}
                                                    onClickBorrow={() => {
                                                        this.calltoggleLoading();
                                                        let finalModalInputValue;
                                                        let pair = `${this.state.depositeCurrency}${this.state.debitCurrency}`
                                                        switch (pair) {
                                                            case "ETHBTC":
                                                                finalModalInputValue = Number.parseFloat(this.state.debitAmount * 100000000).toFixed(0);
                                                                break;
                                                            case "AVAXUSDT":
                                                                finalModalInputValue = Number.parseFloat(this.state.debitAmount * 1000000).toFixed(0);
                                                                break;
                                                            default:
                                                        }
                                                        let args = [finalModalInputValue];

                                                        switch (pair) {
                                                            case "ETHBTC":
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
                                                                break;
                                                            case "AVAXUSDT":
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
                                                                break;
                                                            default:
                                                        }
                                                    }}
                                                    onClickPayback={() => {
                                                        this.calltoggleLoading();
                                                        let finalModalInputValue;
                                                        let approveArgs = []
                                                        let pair = `${this.state.depositeCurrency}${this.state.debitCurrency}`
                                                        switch (pair) {
                                                            case "ETHBTC":
                                                                finalModalInputValue = this.state.debitAmount < 0 ? Number.parseFloat(1000000000000).toFixed(0) : Number.parseFloat(this.state.debitAmount * 100000000).toFixed(0);
                                                                approveArgs.push(this.props.myFujiVaultETHBTC.options.address)
                                                                break;
                                                            case "AVAXUSDT":
                                                                finalModalInputValue = this.state.debitAmount < 0 ? Number.parseFloat(1000000000000).toFixed(0) : window.web3.utils.toBN(window.web3.utils.toWei(this.state.debitAmount, 'picoether')).toString();
                                                                approveArgs.push(this.props.myFujiVaultAVAXUSDT.options.address)
                                                                break;
                                                            default:
                                                        }
                                                        approveArgs.push(window.web3.utils.toBN(finalModalInputValue).toString())
                                                        let args = [
                                                            this.state.debitAmount < 0 ? "-1" : window.web3.utils.toBN(finalModalInputValue).toString(),
                                                        ];

                                                        switch (pair) {
                                                            case "ETHBTC":
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
                                                                break;
                                                            case "AVAXUSDT":
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
                                                                break;
                                                            default:
                                                        }
                                                    }}
                                                ></Card>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Card
                                            widgetSize={"full"}
                                            title={"Current Smart Vault Balance"}
                                            leftSelectButton={""}
                                            rightSelectButton={""}
                                            currency={"eth"}
                                            openBorrowingPower={false}
                                            bottomButtonTitle={"Borrow"}
                                        ></Card>
                                    </Grid>
                                </Grid>
                            </Grid>
                            {/* circle table */}
                            <Grid xs={5} item>
                                <Grid container>
                                    <Grid item xs={12} style={{ minHeight: "48px" }}>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Widget
                                            title={<p style={{ fontWeight: 700 }}>Deposited Borrowed health Factory</p>}
                                            customDropDown={false}
                                        >
                                            <Grid container>
                                                <Grid item XS={12}>
                                                    <div style={{ minWidth: "300px", minHeight: "300px" }}>
                                                        <MDBContainer
                                                        def={console.log(`${this.state.depositeCurrency}${this.state.debitCurrency}`.toUpperCase() === "ETHBTC")}
                                                        >
                                                            <Doughnut width={10} data={{
                                                                labels: [`${this.state.depositeCurrency} $`,`${this.state.debitCurrency} $`],
                                                                datasets: [
                                                                    {
                                                                      data: [
                                                                        (
                                                                          (`${this.state.depositeCurrency}${this.state.debitCurrency}`.toUpperCase() === "ETHBTC"? Number(this.props.userDepositBalanceEth) :  Number(this.props.userDepositBalanceAvax))
                                                                        + Number(this.state.collateralAmount)
                                                                        ) 
                                                                        * (`${this.state.depositeCurrency}${this.state.debitCurrency}`.toUpperCase() === "ETHBTC"? this.props.priceOfEth : `${this.state.depositeCurrency}${this.state.debitCurrency}`.toUpperCase() === "AVAXUSDT"? this.props.priceOfAvax : 0) / 100, 
                                                                        (
                                                                          (`${this.state.depositeCurrency}${this.state.debitCurrency}`.toUpperCase() === "ETHBTC"? Number(this.props.userDebtBalanceBtc) :  Number(this.props.userDebtBalanceUsdt))
                                                                          + Number(this.props.debitAmount)
                                                                        ) 
                                                                        * (`${this.state.depositeCurrency}${this.state.debitCurrency}`.toUpperCase() === "ETHBTC"? this.props.priceOfBtc : `${this.state.depositeCurrency}${this.state.debitCurrency}`.toUpperCase() === "AVAXUSDT"? this.props.priceOfUsdt : 0) / 100
                                                                      ],
                                                                      backgroundColor: [
                                                                        "#5CD68A",
                                                                        "#5C83D6",
                                                                      ],
                                                                      hoverBackgroundColor: [
                                                                        "#5CD68A",
                                                                        "#5C83D6",
                                                                      ]
                                                                    }
                                                                  ]
                                                            }}
                                                                plugins={[{
                                                                    beforeDraw: (chart) => {
                                                                        var width = chart.width,
                                                                            height = chart.height,
                                                                            ctx = chart.ctx;
                                                                        ctx.restore();
                                                                        var fontSize = (height / 200).toFixed(2);
                                                                        ctx.font = fontSize + "em sans-serif";
                                                                        ctx.fillStyle = "#fff";
                                                                        ctx.textBaseline = "top";
                                                                        var text = (!(
                                                                            (`${this.state.depositeCurrency}${this.state.debitCurrency}`.toUpperCase() === "ETHBTC" ? Number(this.props.userDebtBalanceBtc) : Number(this.props.userDebtBalanceUsdt))
                                                                            + Number(this.props.inputBtcDept)
                                                                        ) > 0 ? "" :
                                                                            (
                                                                                (
                                                                                    (
                                                                                        (`${this.state.depositeCurrency}${this.state.debitCurrency}`.toUpperCase() === "ETHBTC" ? Number(this.props.userDepositBalanceEth) : Number(this.props.userDepositBalanceAvax))
                                                                                        + Number(this.props.collateralAmount)
                                                                                    )
                                                                                    * (`${this.state.depositeCurrency}${this.state.debitCurrency}`.toUpperCase() === "ETHBTC" ? this.props.priceOfEth : `${this.state.depositeCurrency}${this.state.debitCurrency}`.toUpperCase() === "AVAXUSDT" ? this.props.priceOfAvax : 0) / 100)
                                                                                * this.props.LTV[`${this.state.depositeCurrency}${this.state.debitCurrency}`.toUpperCase()]
                                                                                /
                                                                                (
                                                                                    (
                                                                                        (`${this.state.depositeCurrency}${this.state.debitCurrency}`.toUpperCase() === "ETHBTC" ? Number(this.props.userDebtBalanceBtc) : Number(this.props.userDebtBalanceUsdt))
                                                                                        + Number(this.props.debitAmount)
                                                                                    )
                                                                                    * (`${this.state.depositeCurrency}${this.state.debitCurrency}`.toUpperCase() === "ETHBTC" ? this.props.priceOfBtc : `${this.state.depositeCurrency}${this.state.debitCurrency}`.toUpperCase() === "AVAXUSDT" ? this.props.priceOfUsdt : 0) / 100)
                                                                            ).toFixed(2)),
                                                                            textX = Math.round((width - ctx.measureText(text).width) / 2),
                                                                            textY = height / 2 + 5;
                                                                        ctx.fillText(text, textX, textY);
                                                                        ctx.save();
                                                                    }
                                                                }]}
                                                                options={{ responsive: true }} />
                                                        </MDBContainer>
                                                    </div>
                                                </Grid>
                                            </Grid>
                                        </Widget>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Widget
                                            title={<p style={{ fontWeight: 700 }}></p>}
                                            customDropDown={false}
                                        >
                                            <Grid container>
                                                <Grid item xs={12}>
                                                    <Grid container justifyContent={"space-between"}>
                                                        <Grid item>
                                                            <span>Current Price of ETH:</span>
                                                        </Grid>
                                                        <Grid item>
                                                            <span>$1,031</span>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Grid container justifyContent={"space-between"}>
                                                        <Grid item>
                                                            <span>Current Price of BTC:</span>
                                                        </Grid>
                                                        <Grid item>
                                                            <span>$19,224</span>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Grid container justifyContent={"space-between"}>
                                                        <Grid item>
                                                            <span>LTV:</span>
                                                        </Grid>
                                                        <Grid item>
                                                            <span>14%</span>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Grid container justifyContent={"space-between"}>
                                                        <Grid item>
                                                            <span>Max Borrow Power:</span>
                                                        </Grid>
                                                        <Grid item>
                                                            <span>13.45</span>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Grid container justifyContent={"space-between"}>
                                                        <Grid item>
                                                            <span>Liquidity Threshold:</span>
                                                        </Grid>
                                                        <Grid item>
                                                            <span>20.534%</span>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Grid container justifyContent={"space-between"}>
                                                        <Grid item>
                                                            <span>Liquidation Price of ETH:</span>
                                                        </Grid>
                                                        <Grid item>
                                                            <span>$350</span>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Widget>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>


                </Grid>

                <Popup
                    modal={this.state.modal}
                    close={() => {
                        this.setState({
                            modal: !this.state.modal
                        })
                    }}
                    modalTitle={this.state.modalTitle}
                    subHeading={this.state.modalSubHeading}
                    modalAction={""}
                    modalToken={""}
                    value={this.state.modalValue}
                    onChange={this.state.modalOnChange}
                    modalCall={this.state.modalOnCall}
                >
                </Popup >
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

        lpPoolBtc: store.backd.lpPoolBtc,
        lpTokenBtc: store.backd.lpTokenBtc,
        myBtcLpAmount: store.backd.myBtcLpAmount,
        totalBtcLpAmount: store.backd.totalBtcLpAmount,
        topupAction: store.backd.topupAction,
    };
}

export default connect(mapStateToProps)(Manage);


