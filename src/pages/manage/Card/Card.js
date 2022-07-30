import React from "react";
import { connect } from "react-redux";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from "@fortawesome/free-solid-svg-icons"
import { Grid } from '@mui/material';
import PropTypes from 'prop-types';
import {
    Row, Col, Table,
    Input,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from 'reactstrap';

import {
    toggleLoading,
} from "../../../actions/navigation";
import './Card.scss'

import API from '../../../utils/API'
import DisplayBox from '../../../components/DisplayBox/DisplayBox'
import Widget from '../../../components/Widget';
import TableRow from '../../../components/TableRow/TableRow'



class Card extends React.Component {
    static propTypes = {
        widgetSize: PropTypes.oneOf(["full", "left", "right"]),
        title: PropTypes.string,
        leftSelectButton: PropTypes.string,
        rightSelectButton: PropTypes.string,
        currency: PropTypes.string,
        openBorrowingPower: PropTypes.bool,
        bottomButtonTitle: PropTypes.string,
    };

    static defaultProps = {
        widgetSize: "full",
        title: "",
        leftSelectButton: "",
        rightSelectButton: "",
        currency: "",
        openBorrowingPower: false,
        bottomButtonTitle: "",
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
        this.state = {
            leftSelect: true,
            rightSelect: false,
            title: "Collateral",
            leftSelectTitle: "Collateral",
            rightSelectTitle: "",
            amount: 0.00,
            balanceAmount: 30.00,
            currency: "eth",
            openBorrowingPower: false,
            bottomButtonTitle: "Deposit",
            iconPath: `/assets/icon/${this.props.currency}-logo.svg`,
        };

    }

    switchPairButton(param) {
        switch (param) {

            case "Debt":
            case "Collateral":
                return (
                    <>
                        <Grid item xs={6}>
                            <div>
                                <Button
                                    className={`customButton${this.state.leftSelect === true ? `__select` : ``} pairButton__left`}
                                    onClick={() => {
                                        if (this.state.leftSelect === false) {
                                            this.setState({
                                                leftSelect: !this.state.leftSelect,
                                                rightSelect: !this.state.rightSelect,
                                            })
                                        }
                                    }}
                                >{this.props.leftSelectButton}</Button>
                            </div>
                        </Grid>
                        <Grid item xs={6}>
                            <div>
                                <Button
                                    className={`customButton${this.state.rightSelect === true ? `__select` : ``} pairButton__right`}
                                    onClick={() => {
                                        if (this.state.rightSelect === false) {
                                            console.log(`select right`)
                                            this.setState({
                                                leftSelect: !this.state.leftSelect,
                                                rightSelect: !this.state.rightSelect,
                                            })
                                        }
                                    }}
                                >{this.props.rightSelectButton}</Button>
                            </div>
                        </Grid>
                    </>
                )
                break;
            case "Current Smart Vault Balance":
                return (
                <>
                                    <br></br>
                    <br></br>
                    <br></br>
                </>)
                break;
            default:
                return (<></>)
        }
    }
    switchBottomButton(param) {
        switch (param) {
            case "Collateral":
                return (<>
                    <Grid item xs={12} style={{ minHeight: "72px" }}>
                    </Grid>
                    <br></br>
                    <br></br>
                    <br></br>
                    <Grid item xs={12}>
                        <Button className={"deposite-button"} color={"danger"}>Deposit</Button>
                    </Grid>
                </>)
            case "Debt":
                return (<>
                    <Grid item xs={12} style={{ minHeight: "72px" }}>
                        <span >
                            <span
                                style={{
                                    fontSize: "26px",
                                }}
                            >Borrowing Power: </span>
                            <Button>25%</Button>
                            <Button>50%</Button>
                        </span>
                    </Grid>
                    <br></br>
                    <br></br>
                    <br></br>
                    <Grid item xs={12}>
                        <Button className={"deposite-button"} color={"danger"}>Borrow</Button>
                    </Grid>
                </>)
            case "Current Smart Vault Balance":
                return (<>
                    <Grid item xs={12}>
                        <Button className={"deposite-button"} color={"danger"}>Withdraw</Button>
                    </Grid>
                    <br></br>
                    <br></br>
                    <br></br>
                    <Grid item xs={12}>
                        <Button className={"delete-button"}>Delete Smart Vault Position</Button>
                    </Grid>
                </>)
            default:
                return (<></>)
        }
    }

    render() {
        return (
            <Grid container>
                <Grid item xs={12}>
                    <Widget
                        title={<p style={{ fontWeight: 700 }}>{this.props.title}</p>}
                        customDropDown={false}
                        widgetSize={this.props.widgetSize}
                    >
                        <Grid container>
                            {this.switchPairButton(this.props.title)}
                            <br></br>
                            <br></br>
                            <br></br>
                            <Grid item xs={12}>
                                <div style={{
                                    // width:"100%",
                                    borderRadius: "8px 8px 8px 8px",
                                    border: "1px solid white",
                                }}
                                >
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <div style={{
                                                padding: "5px 12px",
                                            }}>
                                                <Grid container>
                                                    <Grid item xs={7}>
                                                        <Input
                                                            className={`amount-text`}
                                                            title="Input"
                                                            // placeholder="Enter deposit amount..."
                                                            value={this.state.amount}
                                                            onChange={(e) => {
                                                                this.setState({
                                                                    amount: e.target.value
                                                                })
                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={5}>
                                                        <Grid container spacing={1}>
                                                            <Grid item xs={12} style={{
                                                                textAlign: "end",
                                                                // padding: "5px",
                                                            }}>

                                                                <span style={{
                                                                    fontSize: "16px",
                                                                    fontWeight: "bold",
                                                                }}>balance: {`${this.state.balanceAmount} ${this.state.currency.toUpperCase()}`}</span>

                                                            </Grid>
                                                            <Grid item xs={12} style={{ textAlign: "end" }}>
                                                                <Grid container justifyContent={"end"} spacing={1}>
                                                                    <Grid item>
                                                                        <Button className={"customButton__select max-button"}>MAX</Button>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <label
                                                                            style={{
                                                                                border: "1px solid white",
                                                                                borderRadius: "16px",
                                                                                backgroundColor: "white",
                                                                                padding: "3px 10px"
                                                                            }}
                                                                        >
                                                                            <img className="icon"
                                                                                src={this.state.iconPath}
                                                                                alt="x"></img>
                                                                            <span style={{ color: "black" }}>{this.state.currency.toUpperCase()}</span>
                                                                        </label>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </div>
                            </Grid>
                            <br></br>
                            <br></br>
                            {this.switchBottomButton(this.props.title)}
                        </Grid>
                    </Widget>
                </Grid>
            </Grid>
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

export default connect(mapStateToProps)(Card);


