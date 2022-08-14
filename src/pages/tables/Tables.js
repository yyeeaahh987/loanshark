import React from "react";
import { connect } from "react-redux";
import 'chart.js/auto';
import {
  Row,
  Col,
} from "reactstrap";

import Widget from "../../components/Widget";
import Trade from "../../components/Trade";
import HealthFactorPieChart from "../../components/HealthFactorPieChart";
import TradeInfo from "../../components/TradeInfo";
import s from "./Tables.modules.scss";

class Tables extends React.Component {

  state = {
    initEchartsOptions: {
      renderer: 'canvas'
    }
  }

  parseDate(date) {
    this.dateSet = date.toDateString().split(" ");

    return `${date.toLocaleString("en-us", { month: "long" })} ${this.dateSet[2]
      }, ${this.dateSet[3]}`;
  }

  checkAll(ev, checkbox) {
    const checkboxArr = new Array(this.state[checkbox].length).fill(
      ev.target.checked
    );
    this.setState({
      [checkbox]: checkboxArr
    });
  }

  changeCheck(ev, checkbox, id) {
    //eslint-disable-next-line
    this.state[checkbox][id] = ev.target.checked;
    if (!ev.target.checked) {
      //eslint-disable-next-line
      this.state[checkbox][0] = false;
    }
    this.setState({
      [checkbox]: this.state[checkbox]
    });
  }

  render() {
    return (
      <div 
      className={s.root}
      >
        <Row>
          <Col xl={7} lg={7}>
            <Widget
              title={
                <p style={{ fontWeight: 700 }}>
                  Borrow
                </p>
              }
              customDropDown
            >
              <Trade />
            </Widget>
          </Col>

          <Col xl={5} lg={5}>
            <HealthFactorPieChart />
            <TradeInfo />
            <Widget title={<p style={{ fontWeight: 700 }}>Borrowing APY of {this.props.selectedPair === "ETHBTC"? "BTC":"USDT"}</p>}>
                <Row style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 0, marginTop: 0 }}>
                  <Col>
                    <span style={{ color: "#00ff00" }}>AAVE</span>
                  </Col>
                  <Col style={{ textAlign: 'right' }} >
                    <span style={{ color: "#00ff00" }}>1.4%</span>
                  </Col>
                </Row>
                <Row style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 0, marginTop: 0 }}>
                  <Col>
                    Benqi
                  </Col>
                  <Col style={{ textAlign: 'right' }} >
                    2.0%
                  </Col>
                </Row>
            </Widget>
          </Col>
          <Col xl={0} lg={0}></Col>
        </Row>
      </div>
    );
  }
}


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
  };
}

export default connect(mapStateToProps)(Tables);
