import React from "react";
import { connect } from "react-redux";
import { Grid } from '@mui/material';
import PropTypes from 'prop-types';
import {
    Input,
    Button,
} from 'reactstrap';

import './Card.scss'
import Widget from '../../../components/Widget';



class Card extends React.Component {
    static propTypes = {
        widgetSize: PropTypes.oneOf(["full", "left", "right"]),
        title: PropTypes.string,
        leftSelectButton: PropTypes.string,
        rightSelectButton: PropTypes.string,
        currency: PropTypes.string,
        currencyIconPath: PropTypes.string,
        openBorrowingPower: PropTypes.bool,
        bottomButtonTitle: PropTypes.string,
        onClickDeposite: PropTypes.func,
        onClickWithdraw: PropTypes.func,
        action: PropTypes.string,
        onClickSelect: PropTypes.func,
        onChangeInput: PropTypes.func,
        amount: PropTypes.number,
        maxBalance: PropTypes.number,
        onClickMax: PropTypes.func,
        onClickBorrowingPowerChange: PropTypes.func,
        onClickBorrow: PropTypes.func,
        onClickPayback: PropTypes.func,
    };

    static defaultProps = {
        widgetSize: "full",
        title: "",
        leftSelectButton: "",
        rightSelectButton: "",
        currency: "",
        currencyIconPath: "",
        openBorrowingPower: false,
        bottomButtonTitle: "",
        onClickDeposite: () => { },
        onClickWithdraw: () => { },
        action: "",
        onClickSelect: () => { },
        onChangeInput: () => { },
        amount: 0,
        maxBalance: 0,
        onClickMax: () => { },
        onClickBorrowingPowerChange: () => { },
        onClickBorrow: () => { },
        onClickPayback: () => { },
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
            openBorrowingPower: false,
            bottomButtonTitle: "Deposit",
            iconPath: `/assets/icon/${this.props.currency}-logo.svg`,
        };
    }

    componentDidMount() {
        // console.log(this.props.currency)
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
                                    className={`customButton${this.props.action === this.props.leftSelectButton ? `__select` : ``} pairButton__left`}
                                    style={{ textTransform: "capitalize" }}
                                    name={this.props.leftSelectButton}
                                    onClick={this.props.onClickSelect}
                                >{this.props.leftSelectButton}</Button>
                            </div>
                        </Grid>
                        <Grid item xs={6}>
                            <div>
                                <Button
                                    className={`customButton${this.props.action === this.props.rightSelectButton ? `__select` : ``} pairButton__right`}
                                    style={{ textTransform: "capitalize" }}
                                    name={this.props.rightSelectButton}
                                    onClick={this.props.onClickSelect}
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

    switchBottomButton(param, action) {
        switch (param) {
            case "Collateral":
                return (<>
                    <Grid item xs={12} style={{ minHeight: "72px" }}>
                    </Grid>
                    <br></br>
                    <br></br>
                    <br></br>
                    <Grid item xs={12}>
                        <Button className={"deposite-button"}
                            onClick={() => {
                                switch (action) {
                                    case "deposit":
                                        this.props.onClickDeposite()
                                        break;
                                    case "withdraw":
                                        this.props.onClickWithdraw()
                                        break;
                                    default:
                                }
                            }}
                        >{action}</Button>
                    </Grid>
                </>)
            case "Debt":
                return (<>
                    <br></br>
                    <br></br>
                    <br></br>
                    <Grid item xs={12}>
                        <Grid container spacing={1} style={{ paddingTop: "5%" }}>
                            <Grid item>
                                <span
                                    style={{
                                        fontSize: "20px",
                                    }}
                                >Borrowing Power: </span>
                            </Grid>
                            <Grid item>
                                <Button className={"customButton__select borrowing-power-button"}
                                    name={25}
                                    onClick={this.props.onClickBorrowingPowerChange}
                                >25%</Button>
                            </Grid>
                            <Grid item>
                                <Button className={"customButton__select borrowing-power-button"}
                                    name={50}
                                    onClick={this.props.onClickBorrowingPowerChange}
                                >50%</Button>
                            </Grid>
                            <Grid item>
                                <Button className={"customButton__select borrowing-power-button"}
                                    name={75}
                                    onClick={this.props.onClickBorrowingPowerChange}
                                >75%</Button>
                            </Grid>
                            <Grid item>
                                <Button className={"customButton__select borrowing-power-button"}
                                    name={100}
                                    onClick={this.props.onClickBorrowingPowerChange}
                                >100%</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <br></br>
                    <br></br>
                    <br></br>
                    <Grid item xs={12}>
                        <Button className={"deposite-button"} onClick={() => {
                            console.log(action)
                            switch (action) {
                                case "borrow":
                                    this.props.onClickBorrow()
                                    break;
                                case "payback":
                                    this.props.onClickPayback()
                                    break;
                                default:
                            }
                        }}
                        >{action}</Button>
                    </Grid>
                </>)
            case "Current Smart Vault Balance":
                return (<>
                    <Grid item xs={12}>
                        <Button className={"deposite-button"}>Withdraw</Button>
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
                                                            value={this.props.amount}
                                                            onChange={this.props.onChangeInput}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={5}>
                                                        <Grid container spacing={1}>
                                                            <Grid item xs={12} style={{
                                                                textAlign: "end",
                                                                // padding: "5px",
                                                            }}>
                                                                <div>
                                                                    <span style={{
                                                                        fontSize: "16px",
                                                                        fontWeight: "bold",
                                                                    }}>balance: {`${this.props.maxBalance}`}</span>
                                                                </div>
                                                                <div>
                                                                    <span style={{
                                                                        fontSize: "16px",
                                                                        fontWeight: "bold",
                                                                    }}>{this.props.currency.toUpperCase()}</span>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={12} style={{ textAlign: "end" }}>
                                                                <Grid container justifyContent={"end"} spacing={1}>
                                                                    <Grid item>
                                                                        <Button className={"customButton__select max-button"}
                                                                            onClick={this.props.onClickMax}
                                                                        >MAX</Button>
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
                                                                                src={this.props.currencyIconPath}
                                                                                // src={this.state.iconPath}
                                                                                alt="x"></img>
                                                                            <span style={{ color: "black" }}>{this.props.currency.toUpperCase()}</span>
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
                            {this.switchBottomButton(this.props.title, this.props.action)}
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


