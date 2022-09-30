import React from "react";
import { connect } from "react-redux";
import 'chart.js/auto';
import { Bar } from "react-chartjs-2";

import Widget from "../../components/Widget";

class HealthFactorPieChart extends React.Component {

    componentDidUpdate(prevProps) {
        if (prevProps.userDepositBalanceEth !== this.props.userDepositBalanceEth
            ||
            prevProps.userDebtBalanceBtc !== this.props.userDebtBalanceBtc
            ) {
            this.forceUpdate();
        }
    }

    render() {
        var text = (!(
            (this.props.selectedPair === "ETHBTC" ? Number(this.props.userDebtBalanceBtc) : Number(this.props.userDebtBalanceUsdt))
            + Number(this.props.inputBtcDept)
        ) > 0 ? "" :
            (
                (
                    (
                        (this.props.selectedPair === "ETHBTC" ? Number(this.props.userDepositBalanceEth) : Number(this.props.userDepositBalanceAvax))
                        + Number(this.props.inputEthDeposit)
                    )
                    * (this.props.selectedPair === "ETHBTC" ? this.props.priceOfEth : this.props.selectedPair === "AVAXUSDT" ? this.props.priceOfAvax : 0) / 100)
                * this.props.LTV[this.props.selectedPair]
                /
                (
                    (
                        (this.props.selectedPair === "ETHBTC" ? Number(this.props.userDebtBalanceBtc) : Number(this.props.userDebtBalanceUsdt))
                        + Number(this.props.inputBtcDept)
                    )
                    * (this.props.selectedPair === "ETHBTC" ? this.props.priceOfBtc : this.props.selectedPair === "AVAXUSDT" ? this.props.priceOfUsdt : 0) / 100)
            ).toFixed(2))

        return (
            <Widget
            theme={this.props.theme }
                title={<p style={{ fontWeight: 700 }}>Deposited, Borrowed and Health Factor</p>
                }
                customDropDown
            >
                <div>
                        <Bar data={{
                            labels: [this.props.selectedPair === "ETHBTC" ? "ETH $" : "AVAX $", this.props.selectedPair === "ETHBTC" ? "BTC $" : "USDT $"],
                            datasets: [
                                {
                                    label: ["Amount $"],
                                    data: [
                                        (
                                            (this.props.selectedPair === "ETHBTC" ? Number(this.props.userDepositBalanceEth) : Number(this.props.userDepositBalanceAvax))
                                            + Number(this.props.inputEthDeposit)
                                        ) 
                                        * (this.props.selectedPair === "ETHBTC" ? this.props.priceOfEth : this.props.selectedPair === "AVAXUSDT" ? this.props.priceOfAvax : 0) / 100,
                                        (
                                            (this.props.selectedPair === "ETHBTC" ? Number(this.props.userDebtBalanceBtc) : Number(this.props.userDebtBalanceUsdt))
                                            + Number(this.props.inputBtcDept)
                                        )
                                        * (this.props.selectedPair === "ETHBTC" ? this.props.priceOfBtc : this.props.selectedPair === "AVAXUSDT" ? this.props.priceOfUsdt : 0) / 100
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
                        options={{
                            animation: false,
                            indexAxis: 'y',
                            elements: {
                                bar: {
                                    borderWidth: 2,
                                },
                            },
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'right',
                                    display: false
                                },
                                title: {
                                    display: true,
                                    text: "Health Factor: " + text,
                                    font: {
                                        size: 18
                                    },
                                    color: '#fff'
                                },
                            },
                        }} />
                </div>
            </Widget>
        )
    }
};

function mapStateToProps(store) {
    return {
        selectedPair: store.loanshark.selectedPair,
        numberOfEth: store.loanshark.numberOfEth,
        numberOfAvax: store.loanshark.numberOfAvax,
        userDepositBalanceEth: store.loanshark.userDepositBalanceEth,
        userDepositBalanceAvax: store.loanshark.userDepositBalanceAvax,
        userDebtBalanceBtc: store.loanshark.userDebtBalanceBtc,
        userDebtBalanceUsdt: store.loanshark.userDebtBalanceUsdt,
        priceOfEth: store.loanshark.priceOfEth,
        priceOfBtc: store.loanshark.priceOfBtc,
        priceOfUsdt: store.loanshark.priceOfUsdt,
        priceOfAvax: store.loanshark.priceOfAvax,
        inputBtcDept: store.loanshark.inputBtcDept,
        inputEthDeposit: store.loanshark.inputEthDeposit,
        LTV: store.loanshark.LTV,

        theme: store.layout.theme,
    };
}

export default connect(mapStateToProps)(HealthFactorPieChart);
