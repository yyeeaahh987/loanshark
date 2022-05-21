import React, { useState } from "react";
import { Row, Col, Button, Spin, Input, DropdownToggle, ButtonDropdown, InputGroup, DropdownMenu, DropdownItem } from "reactstrap";
import "./trade.less";
import s from "../../pages/tables/Tables.modules.scss";

class Trade extends React.Component {
    constructor(props) {
        super(props);
    }

    render () {
        return (
            <>
                <Row style={{ marginBottom: 9, marginTop: 1 }}>
                    <Col lg={12}>
                    <div  style={{
                            display: "flex",
                            flexWrap: "wrap",
                            flexDirection: "column",
                            alignItems: "center"
                        }}>
                                <InputGroup >
                                    <ButtonDropdown
                                        toggle={function noRefCheck(){}}
                                    >
                                        <DropdownToggle outlines color="success">
                                            Choose
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem header>
                                                ETH
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </ButtonDropdown>
                                    <Input
                                        title="Input"
                                        placeholder="deposit..."
                                    />
                                </InputGroup>

                            <Button outline  className="primary">
                                ⇅
                            </Button>

                                <InputGroup style={{width: "100%"}}  >
                                    <ButtonDropdown
                                        toggle={function noRefCheck(){}}
                                    >
                                        <DropdownToggle outlines color="success">
                                            Choose
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem header>
                                                ETH
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </ButtonDropdown>
                                    <Input
                                        title="Input"
                                        placeholder="borrow..."
                                    />
                                </InputGroup>

                        </div>
                    </Col>
                </Row>

                <Row style={{ marginBottom: 9, marginTop:20 }}>
                    <Col lg={12} className={s.root}>
                        <Button color="success" style={{width: "100%"}}  >
                            Deposit and Borrow
                        </Button>
                    </Col>
                </Row>
            </>
        )
    }
};

export default Trade;
