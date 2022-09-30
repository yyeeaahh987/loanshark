import React from "react";
import { connect } from "react-redux";

import { NavLink } from "react-router-dom";
import { changeMyProtectionType } from "../../actions/smartvault";

import {
    Row, Col
} from 'reactstrap';

import { Radio } from "../../components/Radio/Radio";

class SmartVault1 extends React.Component {
    constructor() {
        super();
        this.setSelected = this.setSelected.bind(this);
        this.state = {
            selected: ' ',
        }
    }

    setSelected(value) {
        this.setState({ selected: value });
		this.props.dispatch(changeMyProtectionType(value));
    }

    render() {
        return (
            <div>
                <h3 className={"fw-bold"}>Start using Smart Vault</h3>
                {
                    !this.props.myAccount ?
                        <Row>
                            <Col sm={6}>
                                <p className={"fw-bold"}>Please connect your wallet first.</p>
                            </Col>
                        </Row>
                        :
                        <Row>
                            <Col sm={6}>
                                <p className={"fw-bold"}>Choose the way to protect your loan automatically</p>

                                <NavLink
                                    to={"/app/main/smartVault2"}
                                >
                                    <Radio
                                        value="topup"
                                        selected={this.state.selected}
                                        text="Top-up"
                                        disabled=""
                                        onChange={this.setSelected}
                                        theme={this.props.theme}
                                    />
                                </NavLink>
                                <NavLink
                                    to={"/app/main/smartVault2"}
                                >
                                    <Radio
                                        value="repay"
                                        selected={this.state.selected}
                                        text="Repay"
                                        disabled=""
                                        onChange={this.setSelected}
                                        theme={this.props.theme}
                                    />
                                </NavLink>
                            </Col>
                        </Row>
                }
            </div>
        );
    }
}

function mapStateToProps(store) {
    return {
        myAccount: store.loanshark.myAccount,
        myBtcLpAmount: store.backd.myBtcLpAmount,
        priceOfBtc: store.loanshark.priceOfBtc,
        myBTCContract: store.loanshark.myBTCContract,
        myProtection: store.backd.myProtection,
        myProtectionType: store.smartvault.myProtectionType,

        theme: store.layout.theme,
    };
}

export default connect(mapStateToProps)(SmartVault1);
