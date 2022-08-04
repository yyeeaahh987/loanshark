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
        // this.calltoggleLoading = this.calltoggleLoading.bind(this);
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
            maxDepositeAmount:0,
            depositeCurrencyIconPath: "",
            debitCurrency: "",
            debitAmount: 0,
            maxDebitAmount:0,
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
                depositeAmount: this.props.userDepositBalanceAvax,
                maxDepositeAmount: 9999,
                depositeCurrencyIconPath: `/assets/icon/${deposite.toLowerCase()}-logo.svg`,
                debitCurrency: debit,
                debitAmount: this.props.userDebtBalanceUsdt,
                maxDebitAmount:9999,
                debitCurrencyIconPath: `/assets/icon/${debit.toLowerCase()}-logo.svg`,
            })
        }
        if (deposite === "ETH") {
            this.setState({
                depositeCurrency: deposite,
                depositeAmount: this.props.userDepositBalanceEth,
                depositeCurrencyIconPath: `/assets/icon/${deposite.toLowerCase()}-logo.svg`,
                debitCurrency: debit,
                debitAmount: this.props.userDebtBalanceBtc,
                debitCurrencyIconPath: `/assets/icon/${debit.toLowerCase()}-logo.svg`,
            })
        }
    }


    render() {
        if ((this.props?.location?.state?.pair ?? "") === "") {
            //redirect for no pair get from history
            return <Redirect to="/app/main/dashboard" />
        }
        return (
            <div>
                <Grid container>
                    {/* main info table */}
                    <Grid item xs={12}>
                        <Grid container spacing={2}>


                            <Grid xs={7} item>
                                <Grid container
                                    abc={console.log(this.state)}
                                >
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
                                                                <span>{`$${(this.props.userDepositBalanceEth * this.props.priceOfEth / 100).toFixed(2)}`}</span>
                                                            </Grid>
                                                            <Grid xs={12}>
                                                                <span>{this.props.userDepositBalanceEth} ETH</span>
                                                            </Grid>
                                                        </Grid>
                                                    </td>
                                                    <td className="middle">
                                                        <Grid container>
                                                            <Grid xs={12}>
                                                                <span>{`$${(this.props.userDebtBalanceBtc * this.props.priceOfBtc / 100).toFixed(2)}`}</span>
                                                            </Grid>
                                                            <Grid xs={12}>
                                                                <span>{`${(this.props.userDebtBalanceBtc).toFixed(2)}`} BTC</span>
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
                                                    maxBalance={this.state.maxDepositeAmount}
                                                    openBorrowingPower={false}
                                                    bottomButtonTitle={"Deposit"}
                                                    action={this.state.collateralAction}
                                                    onClickSelect={(e) => {
                                                        console.log(e)
                                                        console.log(e.target)
                                                        console.log(e.target.name)
                                                        console.log(this.state.collateralAction)
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
                                                    maxBalance={this.state.maxDebitAmount}
                                                    amount={this.state.debitAmount}
                                                    openBorrowingPower={true}
                                                    bottomButtonTitle={"Borrow"}
                                                    action={this.state.debitAction}
                                                    onClickSelect={(e) => {
                                                        if (e.target.name === this.state.collateralAction) return
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
                                                        this.setState({
                                                            debitAmount: this.state.maxDebitAmount,
                                                        })
                                                    }}
                                                    onClickBorrowingPowerChange={(e)=>{
                                                        let finalAmount= (this.state.maxDebitAmount*e.target.name/100).toFixed(2)
                                                        this.setState({
                                                            debitAmount: finalAmount,
                                                        })
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
                                            title={<p style={{ fontWeight: 700 }}>Deposited Borrowed ealth Factory</p>}
                                            customDropDown={false}
                                        >
                                            <Grid container>
                                                <Grid item XS={12}>
                                                    <div style={{ minWidth: "300px", minHeight: "300px" }}>
                                                        <MDBContainer>
                                                            <Doughnut width={10} data={{
                                                                labels: ["$ETH", "$BTC"],
                                                                datasets: [
                                                                    {
                                                                        data: [0.2, 0.5],
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
                                                                        let text = 20,
                                                                            textX = Math.round((width - ctx.measureText(2).width) / 2),
                                                                            textY = height / 2 + 5;
                                                                        ctx.fillText(text, textX, textY);
                                                                        ctx.save();
                                                                    }
                                                                    // beforeDraw: (chart) => {
                                                                    //     var width = chart.width,
                                                                    //         height = chart.height,
                                                                    //         ctx = chart.ctx;
                                                                    //     ctx.restore();
                                                                    //     var fontSize = (height / 200).toFixed(2);
                                                                    //     ctx.font = fontSize + "em sans-serif";
                                                                    //     ctx.fillStyle = "#fff";
                                                                    //     ctx.textBaseline = "top";
                                                                    //     var text = (!(
                                                                    //         (this.props.selectedPair === "ETHBTC" ? Number(this.props.userDebtBalanceBtc) : Number(this.props.userDebtBalanceUsdt))
                                                                    //         + Number(this.props.inputBtcDept)
                                                                    //     ) > 0 ? "" :
                                                                    //         (
                                                                    //             (
                                                                    //                 (
                                                                    //                     (this.props.selectedPair === "ETHBTC" ? Number(this.props.userDepositBalanceEth) : Number(this.props.userDepositBalanceAvax))
                                                                    //                     + Number(this.props.inputEthDeposit)
                                                                    //                 )
                                                                    //                 * (this.props.selectedPair === "ETHBTC" ? this.props.priceOfEth : this.props.selectedPair === "AVAXUSDT" ? this.props.priceOfAvax : 0) / 100)
                                                                    //             * this.props.LTV[this.props.selectedPair]
                                                                    //             /
                                                                    //             (
                                                                    //                 (
                                                                    //                     (this.props.selectedPair === "ETHBTC" ? Number(this.props.userDebtBalanceBtc) : Number(this.props.userDebtBalanceUsdt))
                                                                    //                     + Number(this.props.inputBtcDept)
                                                                    //                 )
                                                                    //                 * (this.props.selectedPair === "ETHBTC" ? this.props.priceOfBtc : this.props.selectedPair === "AVAXUSDT" ? this.props.priceOfUsdt : 0) / 100)
                                                                    //         ).toFixed(2)),
                                                                    //         textX = Math.round((width - ctx.measureText(text).width) / 2),
                                                                    //         textY = height / 2 + 5;
                                                                    //     ctx.fillText(text, textX, textY);
                                                                    //     ctx.save();
                                                                    // }
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
            </div>
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
        LTV: store.loanshark.LTV,
    };
}

export default connect(mapStateToProps)(Manage);


