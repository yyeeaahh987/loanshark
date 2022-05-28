import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import {
  Navbar, Button
} from "reactstrap";
import {
  toggleSidebar,
  openSidebar,
  closeSidebar,
  changeActiveSidebarItem,
} from "../../actions/navigation";

import {
  changeMyAccount,
  changeNumberOfEth, 
  changeUserDepositBalance, 
  changeUserDebtBalance,
  changeMyFujiVaultETHBTC,
  changeMyFliquidatorAvax,
  changeMyFujiController,
  changeMyFujiOracle,
  changeMyEthContract,
  changeMyBtcContract,
  changeMyUsdtContract,
  changePriceOfEth,
  changePriceOfBtc,
  changeProviderAAVEAVAX,
} from "../../actions/loanshark";

import Controller from '../../abi/fujidao/Controller.json';
import FujiVaultAVAX from '../../abi/fujidao/FujiVaultAVAX.json';
import FliquidatorAVAX from '../../abi/fujidao/FliquidatorAVAX.json';
import FujiOracle from '../../abi/fujidao/FujiOracle.json';
import ProviderAAVEAVAX from '../../abi/fujidao/ProviderAAVEAVAX.json';
import API from '../../utils/API'

import Web3 from 'web3';
import arrowUnactive from '../../images/Arrow 6.svg'
import arrowActive from '../../images/Arrow 5.svg'

import s from "./Header.module.scss"; // eslint-disable-line css-modules/no-unused-class

const BSCSCAN_TESTNET=process.env.REACT_APP_BSCSCAN_TESTNET
const MY_FujiVaultETHBTC=process.env.REACT_APP_MY_FujiVaultETHBTC;
const MY_FliquidatorAVAX=process.env.REACT_APP_MY_FliquidatorAVAX;
const MY_FujiController=process.env.REACT_APP_MY_FujiController;
const MY_FujiOracle=process.env.REACT_APP_MY_FujiOracle;
const WBTC=process.env.REACT_APP_WBTC;
const WETH=process.env.REACT_APP_WETH;
const USDT=process.env.REACT_APP_USDT;
const AAVEAVAX=process.env.REACT_APP_ProviderAAVEAVAX;

class Header extends React.Component {
  static propTypes = {
    sidebarOpened: PropTypes.bool.isRequired,
    sidebarStatic: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }).isRequired,
  };

  constructor(props) {
    super(props);
  
    this.toggleMenu = this.toggleMenu.bind(this);
    this.switchSidebar = this.switchSidebar.bind(this);
    this.toggleNotifications = this.toggleNotifications.bind(this);
    this.toggleMessages = this.toggleMessages.bind(this);
    this.toggleAccount = this.toggleAccount.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.changeArrowImg = this.changeArrowImg.bind(this);
    this.changeArrowImgOut = this.changeArrowImgOut.bind(this);
    this.ethEnabled = this.ethEnabled.bind(this);
    this.getNeededCollateralFor = this.getNeededCollateralFor.bind(this);

    this.setMyFujiVaultETHBTC = this.setMyFujiVaultETHBTC.bind(this);
    this.setMyFliquidatorAVAX = this.setMyFliquidatorAVAX.bind(this);
    this.setMyFujiController = this.setMyFujiController.bind(this);
    this.setMyFujiOracle = this.setMyFujiOracle.bind(this);
    this.setMyETHContract = this.setMyETHContract.bind(this);
    this.setMyBTCContract = this.setMyBTCContract.bind(this);
    this.setMyUSDTContract = this.setMyUSDTContract.bind(this);
    this.setMyAAVEAVAXContract = this.setMyAAVEAVAXContract.bind(this);

    this.state = {
      menuOpen: false,
      notificationsOpen: false,
      messagesOpen: false,
      accountOpen: false,
      notificationsTabSelected: 1,
      focus: false,
      showNewMessage: false,
      hideMessage: true,
      run: true,
      arrowImg: arrowActive,
      myAccount: false,
      ethNeededCollateral: 0,
      userDepositBalance: 0,
      userDebtBalance: 0,
      myFujiVaultETHBTC: '',
      myFliquidatorAVAX: '',
      myFujiController: '',
      myFujiOracle: '',
      myETHContract: '',
      myBTCContract: '',
      myUSDTContract: ''
    };
  }

  toggleFocus = () => {
    this.setState({ focus: !this.state.focus });
  };

  toggleNotifications() {
    this.setState({
      notificationsOpen: !this.state.notificationsOpen,
    });
  }

  toggleMessages() {
    this.setState({
      messagesOpen: !this.state.messagesOpen,
    });
  }

  toggleAccount() {
    this.setState({
      accountOpen: !this.state.accountOpen,
    });
  }

  changeArrowImg() {
    this.setState({
      arrowImg: arrowUnactive
    })
  }

  changeArrowImgOut() {
    this.setState({
      arrowImg: arrowActive
    })
  }

  // collapse/uncolappse
  switchSidebar() {
    if (this.props.sidebarOpened) {
      this.props.dispatch(closeSidebar());
      this.props.dispatch(changeActiveSidebarItem(null));
    } else {
      const paths = this.props.location.pathname.split("/");
      paths.pop();
      this.props.dispatch(openSidebar());
      this.props.dispatch(changeActiveSidebarItem(paths.join("/")));
    }
  }

  // tables/non-tables
  toggleSidebar() {
    this.props.dispatch(toggleSidebar());
    if (this.props.sidebarStatic) {
      localStorage.setItem("staticSidebar", "false");
      this.props.dispatch(changeActiveSidebarItem(null));
    } else {
      localStorage.setItem("staticSidebar", "true");
      const paths = this.props.location.pathname.split("/");
      paths.pop();
      this.props.dispatch(changeActiveSidebarItem(paths.join("/")));
    }
  }

  toggleMenu() {
    this.setState({
      menuOpen: !this.state.menuOpen,
    });
  }

  setMyAccount(val) {
    this.setState({
      myAccount: val,
    });
    this.props.dispatch(changeMyAccount(val));
  }

  setMyFujiVaultETHBTC(val) {
    console.log("test: " + val.options.address);
    this.setState({
      myFujiVaultETHBTC: val,
    });
    this.props.dispatch(changeMyFujiVaultETHBTC(val));
  }

  setMyFliquidatorAVAX(val) {
    this.setState({
      myFliquidatorAVAX: val,
    });
    this.props.dispatch(changeMyFliquidatorAvax(val));
  }

  setMyFujiController(val) {
    this.setState({
      myFujiController: val,
    });
    this.props.dispatch(changeMyFujiController(val));
  }

  setMyFujiOracle(val) {
    this.setState({
      myFujiOracle: val,
    });
    this.props.dispatch(changeMyFujiOracle(val));
  }

  setMyETHContract(val) {
    this.setState({
      myETHContract: val,
    });
    this.props.dispatch(changeMyEthContract(val));
  }

  setMyBTCContract(val) {
    this.setState({
      myBTCContract: val,
    });
    this.props.dispatch(changeMyBtcContract(val));
  }

  setMyUSDTContract(val) {
    this.setState({
      myUSDTContract: val,
    });
    this.props.dispatch(changeMyUsdtContract(val));
  }

  setMyAAVEAVAXContract(val) {
    this.props.dispatch(changeProviderAAVEAVAX(val));
  }

  getNeededCollateralFor() {
    API(this.props);
  }

  ethEnabled() {
    if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      window.ethereum.enable();
      const web3js = window.web3;
      web3js.eth.getAccounts((err, result) => {
        console.log("account error:", err);
        console.log("accounts:", result);

        this.setState({myAccount: result[0]});
        this.setMyAccount(result[0]);
        const chainId = 43113 // Avax Testnet

        if (window.ethereum.networkVersion !== chainId) {
          try {
              window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: window.web3.utils.toHex(chainId) }]
              })
              .catch((error) => {
                console.log(error);
                // This error code indicates that the chain has not been added to MetaMask
                if (error.code === 4902) {
                  window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                      {
                        chainName: 'Avalanche Fuji Testnet',
                        chainId: window.web3.utils.toHex(chainId),
                        nativeCurrency: { name: 'AVAX', decimals: 18, symbol: 'AVAX' },
                        rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc']
                      }
                    ]
                  }).then(() => {
                    const dataHong = require('../../abi/Hong.json');
                    this.setMyFujiVaultETHBTC(new  window.web3.eth.Contract(FujiVaultAVAX.abi, MY_FujiVaultETHBTC));
                    this.setMyFliquidatorAVAX(new  window.web3.eth.Contract(FliquidatorAVAX.abi, MY_FliquidatorAVAX));
                    this.setMyFujiController(new  window.web3.eth.Contract(Controller.abi, MY_FujiController));
                    this.setMyFujiOracle(new  window.web3.eth.Contract(FujiOracle.abi, MY_FujiOracle));
                    this.setMyETHContract(new  window.web3.eth.Contract(dataHong, WETH));
                    this.setMyBTCContract(new  window.web3.eth.Contract(dataHong, WBTC));
                    this.setMyUSDTContract(new  window.web3.eth.Contract(dataHong, USDT));
                    this.setMyAAVEAVAXContract(new  window.web3.eth.Contract(ProviderAAVEAVAX.abi, ProviderAAVEAVAX));
                    
                    this.getNeededCollateralFor()
                  });
                }
              })
              .then(() => {
                const dataHong = require('../../abi/Hong.json');
                this.setMyFujiVaultETHBTC(new  window.web3.eth.Contract(FujiVaultAVAX.abi, MY_FujiVaultETHBTC));
                this.setMyFliquidatorAVAX(new  window.web3.eth.Contract(FliquidatorAVAX.abi, MY_FliquidatorAVAX));
                this.setMyFujiController(new  window.web3.eth.Contract(Controller.abi, MY_FujiController));
                this.setMyFujiOracle(new  window.web3.eth.Contract(FujiOracle.abi, MY_FujiOracle));
                this.setMyETHContract(new  window.web3.eth.Contract(dataHong, WETH));
                this.setMyBTCContract(new  window.web3.eth.Contract(dataHong, WBTC));
                this.setMyUSDTContract(new  window.web3.eth.Contract(dataHong, USDT));
                this.setMyAAVEAVAXContract(new  window.web3.eth.Contract(ProviderAAVEAVAX.abi, AAVEAVAX));

                this.getNeededCollateralFor()
              })
              .catch((error) => {
                console.log(error);
              });
          } catch (err) {
          }
        }
      })
    }
  }

  render() {
    return (
      <Navbar
        className={`${s.root} d-print-none`}
        style={{ zIndex: 0, backgroundColor: '#323232', display: "flex" }}
      >
        {this.state.myAccount == '' ? 
          <Button style={{marginLeft: "auto"}} color={"danger"} className={`${s.btnShadow}`} onClick={this.ethEnabled}>
            Collect Wallet
          </Button>
          : <div style={{marginLeft: "auto"}}>Your Wallet Address: {this.state.myAccount}</div>
        }
        &nbsp;
         <Button color={"warning"} onClick={this.getNeededCollateralFor}>Refresh</Button>
      </Navbar>
    );
  }
}

function mapStateToProps(store) {
  return {
    sidebarOpened: store.navigation.sidebarOpened,
    sidebarStatic: store.navigation.sidebarStatic,
    myAccount: store.loanshark.myAccount,
    numberOfEth:  store.loanshark.userDebtBalance,
    userDepositBalance: store.loanshark.userDepositBalance,
    userDebtBalance:  store.loanshark.userDebtBalance,
    myFujiVaultETHBTC: store.loanshark.myFujiVaultETHBTC,
    myFliquidatorAVAX: store.loanshark.myFliquidatorAVAX,
    myFujiController: store.loanshark.myFujiController,
    myFujiOracle: store.loanshark.myFujiOracle,
    myETHContract: store.loanshark.myETHContract,
    myBTCContract:  store.loanshark.myBTCContract,
    myUSDTContract:  store.loanshark.myUSDTContract,
    priceOfEth: store.loanshark.priceOfEth,
    priceOfBtc: store.loanshark.priceOfBtc,
    providerAAVEAVAX: store.loanshark.providerAAVEAVAX,
  };
}

export default withRouter(connect(mapStateToProps)(Header));
