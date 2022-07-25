import React from "react";
import { connect } from "react-redux";

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

import Widget from "../../components/Widget/Widget";

class SmartVault1 extends React.Component {
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
                  title={<p className={"fw-bold"}>My Smart Vault</p>}
              >
                <Table className={"mb-0"} borderless responsive>
                  <thead>
                  <tr>
                    <th key={0} scope="col" className={"pl-0"}>
                      Asset
                    </th>
                    <th key={0} scope="col" className={"pl-0"}>
                      Protection Type
                    </th>
                    <th key={1} scope="col" className={"pl-0"}>
                      Staking Amount
                    </th>
                    <th key={4} scope="col" className={"pl-0"}>
                      APY
                    </th>
                    <th key={0} scope="col" className={"pl-0"}>
                      Threshold
                    </th>
                    <th key={4} scope="col" className={"pl-0"}>
                      How much repay each time
                    </th>
                    <th key={4} scope="col" className={"pl-0"}>
                      Action
                    </th>
                  </tr>
                  </thead>
                  <tbody className="">
                  <tr key={0}>
                    <td className="fw-thin pl-0 fw-thin">
                      {this.props.myBTCContract == null? '' : (
                          this.props.myProtection[3] === this.props.myBTCContract.options.address ? 'BTC' : ''
                        )
                      }
                    </td>
                    <td className="fw-thin pl-0 fw-thin">
                      {this.props.myBTCContract == null? '' : (
                          this.props.myProtection[3] === this.props.myBTCContract.options.address ? 'Repay ETH/BTC' : ''
                        )
                      }
                    </td>
                    <td className={"pl-0 fw-thin"}>
                      ${this.props.myBtcLpAmount * this.props.priceOfBtc / 100}<br/>
                      {this.props.myBtcLpAmount} BTC
                    </td>
                    <td className={"pl-0 fw-thin"}>
                      10%
                    </td>
                    <td className="fw-thin pl-0 fw-thin">
                      {this.props.myProtection[0] / 1000000000000000000}
                    </td>
                    <td className={"pl-0 fw-thin"}>
                      {this.props.myProtection[5] / 100000000}
                    </td>
                    <td className={"pl-0 fw-thin"}>
                        <Button color={"danger"} >Remove</Button>
                    </td>
                  </tr>
                  </tbody>
                </Table>
              </Widget>
          </Col>
          <Col sm={12}>
              <NavLink
                to={"/app/main/smartVault2"}
                >
                <Button>+ Stake to Smart Vault </Button>
              </NavLink>
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    myBtcLpAmount: store.backd.myBtcLpAmount,
    priceOfBtc: store.loanshark.priceOfBtc,
    myBTCContract:  store.loanshark.myBTCContract,
    myProtection: store.backd.myProtection
  };
}

export default connect(mapStateToProps)(SmartVault1);
