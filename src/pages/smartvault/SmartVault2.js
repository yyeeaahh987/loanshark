import React from "react";
import { connect } from "react-redux";

import { NavLink } from "react-router-dom";
import {
  Row, Col, Table, 
  Button,
} from 'reactstrap';
import './SmartVault2.css';

import Widget from "../../components/Widget/Widget";
import { faThList } from "@fortawesome/free-solid-svg-icons";

class SmartVault2 extends React.Component {
  constructor() {
    super();
  }

  selectRow(rowId) {
    window.location = '#/app/main/smartVault3';
  }

  render() {
    return (
      <div>
        <Row>
          <Col sm={12}>
              <h3 className={"fw-bold"}>Select a loan to protect</h3>
              <Row
                style={{
                  padding: '15px',
                  borderWidth: '1px',
                  borderRadius: '15px',
                  marginLeft: '1px'
              }}>
                  <Col lg={3} md={12}>
                    
                  </Col>
                  <Col lg={3} md={12}>
                    Collateral
                  </Col>
                  <Col lg={3} md={12}>
                    Debt
                  </Col>
                  <Col lg={3} md={12}>
                    Health Factor
                  </Col>
              </Row>
              <Row style={{marginLeft: '1px', 
                    display: 'flex',
                    alignItems: 'center'}} key={0}  className={'rowHover'} onClick={() => this.selectRow(1)}>
                  <Col lg={3} md={12}>
                    <img style={{padding: '5px'}} className="icon" src="/assets/icon/eth-logo.svg" alt="x"></img> ETH / <img style={{padding: '5px'}} className="icon" src="/assets/icon/btc-logo.svg" alt="x"></img> BTC
                  </Col>
                  <Col lg={3} md={12}>
                    ${parseFloat((this.props.userDepositBalanceEth * this.props.priceOfEth / 100).toFixed(6))}<br/>
                    {parseFloat(Number(this.props.userDepositBalanceEth).toFixed(6))} ETH
                  </Col>
                  <Col lg={3} md={12}>
                    ${parseFloat((this.props.userDebtBalanceBtc * this.props.priceOfBtc / 100).toFixed(6))}<br/>
                    {parseFloat(Number(this.props.userDebtBalanceBtc).toFixed(6))} BTC
                  </Col>
                  <Col lg={3} md={12}>
                    {((this.props.userDepositBalanceEth * this.props.priceOfEth / 100) * this.props.LTV["ETHBTC"] / (this.props.userDebtBalanceBtc * this.props.priceOfBtc / 100)).toFixed(2) }
                  </Col>
                </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    myAccount: store.loanshark.myAccount,
    userDepositBalanceEth: store.loanshark.userDepositBalanceEth,
    userDebtBalanceBtc:  store.loanshark.userDebtBalanceBtc,
    priceOfEth: store.loanshark.priceOfEth,
    priceOfBtc: store.loanshark.priceOfBtc,
    LTV: store.loanshark.LTV,
  };
}

export default connect(mapStateToProps)(SmartVault2);
