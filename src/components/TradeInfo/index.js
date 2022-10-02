import React from "react";
import { connect } from "react-redux";
import {
    Row,
    Col
} from "reactstrap";
import Widget from "../../components/Widget";
import "./trade.less";
import "./trade.scss"

class TradeInfo extends React.Component {
    render() {
        var borrowPower = (
            this.props.inputEthDeposit
            * (this.props.selectedPair === "ETHBTC" ? this.props.priceOfEth : this.props.priceOfAvax)
            * this.props.LTV[this.props.selectedPair]
            * this.props.liquidationPrice[this.props.selectedPair]
            / (this.props.selectedPair === "ETHBTC" ? this.props.priceOfBtc : this.props.priceOfUsdt)
        ).toFixed(2);

        var liquidationPrice = (
            (parseFloat(this.props.inputBtcDept) + parseFloat(this.props.userDebtBalanceBtc)) 
            * (this.props.selectedPair === "ETHBTC" ? this.props.priceOfBtc : this.props.priceOfUsdt) / 100
            / (parseFloat(this.props.inputEthDeposit) + parseFloat(this.props.userDepositBalanceEth))
            / this.props.LTV[this.props.selectedPair]
        ).toFixed(2);
        
        return (
            <Widget title={' '} theme={this.props.theme}>
                <Row style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 0, marginTop: 0 }}>
                    <Col>
                        Current Price of {this.props.selectedPair === "ETHBTC" ? "ETH" : "AVAX"}:
                    </Col>
                    <Col style={{ textAlign: 'right' }} >
                        {(this.props.selectedPair === "ETHBTC" ? this.props.priceOfEth : this.props.priceOfAvax) / 100}
                    </Col>
                </Row>
                <Row style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 0, marginTop: 0 }}>
                    <Col>
                        Current Price of {this.props.selectedPair === "ETHBTC" ? "BTC" : "USDT"}:
                    </Col>
                    <Col style={{ textAlign: 'right' }} >
                        {(this.props.selectedPair === "ETHBTC" ? this.props.priceOfBtc : this.props.priceOfUsdt) / 100}
                    </Col>
                </Row>
                <Row style={{ marginBottom: 9, marginTop: 20 }}>

                </Row>
                <Row style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 0, marginTop: 0 }}>
                    <Col>
                        LTV:
                    </Col>
                    <Col style={{ textAlign: 'right' }} >
                        {(this.props.LTV[this.props.selectedPair] * this.props.liquidationPrice[this.props.selectedPair] * 100).toFixed(2)} %
                    </Col>
                </Row>
                <Row style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 0, marginTop: 0 }}>
                    <Col>
                        Max Borrowing Capacity:
                    </Col>
                    <Col style={{ textAlign: 'right' }} >
                        {isNaN(borrowPower) === true ? 0 : borrowPower} {this.props.selectedPair === "ETHBTC" ? "BTC" : "USDT"}
                    </Col>
                </Row>

                <Row style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 0, marginTop: 0 }}>
                    <Col>
                        Liquidity Threshold:
                    </Col>
                    <Col style={{ textAlign: 'right' }} >
                        {(this.props.LTV[this.props.selectedPair] * 100).toFixed(2)} %
                    </Col>
                </Row>
                <Row style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 0, marginTop: 0 }}>
                    <Col>
                        Liquidation Price of {this.props.selectedPair === "ETHBTC" ? "ETH" : "AVAX"}:
                    </Col>
                    <Col style={{ textAlign: 'right' }} >
                        {
                           liquidationPrice
                        }
                    </Col>
                </Row>
            </Widget>
        )
    }
};

function mapStateToProps(store) {
    return {
        myAccount: store.loanshark.myAccount,
        selectedPair: store.loanshark.selectedPair,
        numberOfEth: store.loanshark.numberOfEth,
        numberOfAvax: store.loanshark.numberOfAvax,
        userDepositBalanceEth: store.loanshark.userDepositBalanceEth,
        userDebtBalanceBtc: store.loanshark.userDebtBalanceBtc,
        myFujiVaultETHBTC: store.loanshark.myFujiVaultETHBTC,
        myFujiVaultAVAXUSDT: store.loanshark.myFujiVaultAVAXUSDT,
        myFliquidatorAVAX: store.loanshark.myFliquidatorAVAX,
        myFujiController: store.loanshark.myFujiController,
        myFujiOracle: store.loanshark.myFujiOracle,
        myETHContract: store.loanshark.myETHContract,
        myBTCContract: store.loanshark.myBTCContract,
        myUSDTContract: store.loanshark.myUSDTContract,
        inputBtcDept: store.loanshark.inputBtcDept,
        inputEthDeposit: store.loanshark.inputEthDeposit,
        priceOfEth: store.loanshark.priceOfEth,
        priceOfBtc: store.loanshark.priceOfBtc,
        priceOfAvax: store.loanshark.priceOfAvax,
        priceOfUsdt: store.loanshark.priceOfUsdt,
        myETHAmount: store.loanshark.myETHAmount,
        myBTCAmount: store.loanshark.myBTCAmount,
        myAVAXAmount: store.loanshark.myAVAXAmount,
        myUSDTAmount: store.loanshark.myUSDTAmount,
        LTV: store.loanshark.LTV,
        liquidationPrice: store.loanshark.liquidationPrice,

        theme: store.layout.theme,
    };
}

export default connect(mapStateToProps)(TradeInfo);