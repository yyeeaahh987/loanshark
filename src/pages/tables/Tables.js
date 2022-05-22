import React from "react";
import { connect } from "react-redux";
import {
  Row,
  Col,
} from "reactstrap";

import Widget from "../../components/Widget";
import Trade from "../../components/Trade";
import s from "./Tables.modules.scss";

class Tables extends React.Component {

  state = {
    initEchartsOptions: {
      renderer: 'canvas'
    },
  }

  parseDate(date) {
    this.dateSet = date.toDateString().split(" ");

    return `${date.toLocaleString("en-us", { month: "long" })} ${
      this.dateSet[2]
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
      <div className={s.root}>
        <Row>
          <Col lg={6}>
            <Widget
              title={<p style={{ fontWeight: 700 }}>Deposit ETH and Borrow BTC</p>}
              customDropDown
            >
              <Trade/>
            </Widget>
          </Col>
          <Col lg={6}>
            <h6>Needs {this.props.numberOfEth} ETH as collateral to borrow 1 BTC, including safety factors</h6>
            <h6>You deposited {this.props.userDepositBalance} ETH as collateral</h6>
            <h6>You borrowed {this.props.userDebtBalance} BTC</h6>
          </Col>
        </Row>
      </div>
    );
  }
}


function mapStateToProps(store) {
  return {
    numberOfEth: store.loanshark.numberOfEth,
    userDepositBalance: store.loanshark.userDepositBalance,
    userDebtBalance: store.loanshark.userDebtBalance
  };
}

export default connect(mapStateToProps)(Tables);
