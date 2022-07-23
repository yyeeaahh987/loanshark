import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotateRight } from "@fortawesome/free-solid-svg-icons"
import { Container, Row, Col } from 'react-bootstrap';
import {
  Navbar, Button, Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  // Container,
} from "reactstrap";

import './RoundShapeButton.scss'

class RoundShapeButton extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    // sidebarOpened: PropTypes.bool.isRequired,
    // sidebarStatic: PropTypes.bool.isRequired,
    // dispatch: PropTypes.func.isRequired,
    // location: PropTypes.shape({
    //   pathname: PropTypes.string,
    // }).isRequired,
  };

  constructor(props) {
    super(props);

    // this.toggleMenu = this.toggleMenu.bind(this);
    // this.toggleMintETH = this.toggleMintETH.bind(this);
    // this.setInput = this.setInput.bind(this);
    // this.toggle = this.toggle.bind(this);
    // this.switchSidebar = this.switchSidebar.bind(this);
    // this.toggleNotifications = this.toggleNotifications.bind(this);
    // this.toggleMessages = this.toggleMessages.bind(this);
    // this.toggleAccount = this.toggleAccount.bind(this);
    // this.toggleSidebar = this.toggleSidebar.bind(this);
    // this.changeArrowImg = this.changeArrowImg.bind(this);
    // this.changeArrowImgOut = this.changeArrowImgOut.bind(this);
    // this.ethEnabled = this.ethEnabled.bind(this);
    // this.getNeededCollateralFor = this.getNeededCollateralFor.bind(this);

    // this.setMyFujiVaultETHBTC = this.setMyFujiVaultETHBTC.bind(this);
    // this.setMyFujiVaultAVAXUSDT = this.setMyFujiVaultAVAXUSDT.bind(this);
    // this.setMyFliquidatorAVAX = this.setMyFliquidatorAVAX.bind(this);
    // this.setMyFujiController = this.setMyFujiController.bind(this);
    // this.setMyFujiOracle = this.setMyFujiOracle.bind(this);
    // this.setMyETHContract = this.setMyETHContract.bind(this);
    // this.setMyBTCContract = this.setMyBTCContract.bind(this);
    // this.setMyUSDTContract = this.setMyUSDTContract.bind(this);
    // this.setMyAAVEAVAXContract = this.setMyAAVEAVAXContract.bind(this);
    // this.setMySmartVaultContractBtc = this.setMySmartVaultContractBtc.bind(this);
    // this.setMySmartVaultContractUsdt = this.setMySmartVaultContractUsdt.bind(this);

    // this.state = {
    //   label: props.onClick,
    //   onClick: props.onClick,
    // //   messagesOpen: false,
    // //   accountOpen: false,
    // //   notificationsTabSelected: 1,
    // //   focus: false,
    // //   showNewMessage: false,
    // //   hideMessage: true,
    // //   run: true,
    // //   arrowImg: arrowActive,
    // //   myAccount: false,
    // //   ethNeededCollateral: 0,
    // //   myFliquidatorAVAX: '',
    // //   myFujiController: '',
    // //   myFujiOracle: '',
    // //   myETHContract: '',
    // //   myBTCContract: '',
    // //   myUSDTContract: '',
    // //   modal: false,
    // //   modalTitle: '',
    // //   modalToken: '',
    // //   modalAction: '',
    // //   modalCall: () => { },
    // //   modalInputValue: 0
    // };
  }

  



  render() {
    return (
        <Button className={"button"}
        onClick={this.props.onClick}
        >{this.props.label}</Button>
    );
  }
}


export default RoundShapeButton;































