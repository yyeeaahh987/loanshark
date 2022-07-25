import React from "react";
import { connect } from "react-redux";

import usersImg from "../../images/usersImg.svg";
import smileImg from "../../images/smileImg.svg";

import { NavLink } from "react-router-dom";
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
} from "../../actions/navigation";

import API from '../../utils/API'
import Widget from "../../components/Widget/Widget";

class SmartVault2 extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <Row>
          <Col sm={12}>
          <Widget
                customDropDown
                title={<p className={"fw-bold"}>Select a loan to protect</p>}
            >
              <Table className={"mb-0"} borderless responsive>
                <thead>
                <tr>
                  <th key={0} scope="col" className={"pl-0"}>
                    Collateral
                  </th>
                  <th key={1} scope="col" className={"pl-0"}>
                    Amount
                  </th>
                  <th key={3} scope="col" className={"pl-0"}>
                    Debt
                  </th>
                  <th key={4} scope="col" className={"pl-0"}>
                    Amount
                  </th>
                  <th key={6} scope="col" className={"pl-0"}>
                    Health Factor
                  </th>
                </tr>
                </thead>
                <tbody className="">
                <tr key={0}>
                  <td className="fw-thin pl-0 fw-thin">
                    ETH
                  </td>
                  <td className={"pl-0 fw-thin"}>
                    ${this.props.userDepositBalanceEth * this.props.priceOfEth / 100}<br/>
                    {this.props.userDepositBalanceEth} ETH
                  </td>
                  <td className="fw-thin pl-0 fw-thin">
                    BTC
                  </td>
                  <td className={"pl-0 fw-thin"}>
                    ${this.props.userDebtBalanceBtc * this.props.priceOfBtc / 100}<br/>
                    {this.props.userDebtBalanceBtc} BTC
                  </td>
                  <td className={"pl-0 fw-normal"}>
                  {((this.props.userDepositBalanceEth * this.props.priceOfEth / 100) * this.props.LTV["ETHBTC"] / (this.props.userDebtBalanceBtc * this.props.priceOfBtc / 100)).toFixed(2) }
                  </td>
                </tr>
                </tbody>
              </Table>
            </Widget>
          </Col>
          <Col sm={12}>
            <NavLink
              to={"/app/main/smartVault3"}
              >
                <Button>Next</Button>
            </NavLink>
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
