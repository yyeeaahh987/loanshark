import React from "react";
import { connect } from "react-redux";
import { Row, Col} from 'reactstrap';
import './SmartVault2.css';

class SmartVault3 extends React.Component {
  constructor() {
    super();
    this.setHovered = this.setHovered.bind(this);
    this.selectRow = this.selectRow.bind(this);
    this.state = {
      isHovered: false,
      selectedRow: -1
    }
  }

  setHovered() {
    this.setState(prevState => ({
      isHovered: !prevState.isHovered
    }));
  }

  selectRow(rowId) {
    this.setState(prevState => ({
      selectedRow: prevState.selectedRow === rowId? -1 : rowId
    }));
    window.location = '#/app/main/smartVault4';
  }

  render() {
    return (
      <div>
        <Row>
          <Col sm={12}>
              <h3 className={"fw-bold"}>Select a Smart Vault to stake</h3>
                <Row
                  style={{
                    padding: '15px',
                    borderRadius: '10px',
                    marginLeft: '1px'
                }}>
                  <Col lg={3} md={12}>
                    
                  </Col>
                  <Col lg={3} md={12}>
                    APY
                  </Col>
                  <Col lg={3} md={12}>
                    TVL
                  </Col>
                  <Col lg={3} md={12}>
                    Your Balance
                  </Col>
                </Row>
                <Row style={{marginLeft: '1px',
                    display: 'flex',
                    alignItems: 'center'}} key={0}  className={'rowHover'} onClick={() => this.selectRow(1)}>
                  <Col>
                    <img style={{padding: '5px'}} className="icon" src="/assets/icon/btc-logo.svg" alt="x"></img> BTC
                  </Col>
                  <Col>
                    5.4%
                  </Col>
                  <Col>
                    ${Number(this.props.totalBtcLpAmount * this.props.priceOfBtc / 100).toFixed(2)}
                  </Col>
                  <Col>
                    ${parseFloat(this.props.myBtcLpAmount * this.props.priceOfBtc / 100).toFixed(2)}<br/>
                    {this.props.myBtcLpAmount} BTC
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
    priceOfBtc: store.loanshark.priceOfBtc,
    myBtcLpAmount: store.backd.myBtcLpAmount,
    totalBtcLpAmount: store.backd.totalBtcLpAmount,
  };
}

export default connect(mapStateToProps)(SmartVault3);
