import React from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import {
    Row,
    Col,
    Button,
    Input,
    DropdownToggle,
    ButtonDropdown,
    InputGroup,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "reactstrap";
import TokenSearch from './TokenSearch'



class SearchModal extends React.Component {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        handleClose: PropTypes.func.isRequired,
        type: PropTypes.string.isRequired,
        // size: PropTypes.number.isRequired
    };

    constructor(props) {
        super(props);

        // this.depositAndBorrow = this.depositAndBorrow.bind(this);
        // this.setInputEthDeposit = this.setInputEthDeposit.bind(this);
        // this.setInputBtcBorrow = this.setInputBtcBorrow.bind(this);
        // this.calltoggleLoading = this.calltoggleLoading.bind(this);

        this.state = {
            modalContent: <>
                <div style={{ color: "black" }}>modal</div>
            </>,
            ethNeededCollateral: 0,
            userDepositBalance: 0,
            userDebtBalance: 0,
            myFujiVaultETHBTC: '',
            myFliquidatorAVAX: '',
            myFujiController: '',
            myFujiOracle: '',
            myETHContract: '',
            myBTCContract: '',
            inputEthDeposit: 0,
            inputBtcBorrow: 0,
            myBtcAmount: 0,
            myEthAmount: 0,
            currencySelectModal: false
        };
    }

    // modalContent = ()=>{
    //     return null
    // }
    // console.log(this.props)
    componentDidMount() {
        console.log(this.props)

    }

    componentWillReceiveProps() {
        console.log(this.props)
        switch (this.props.type) {
            case "searchToken":
                this.setState({
                    modalContent:
                        <>
                        <TokenSearch></TokenSearch>
                        </>,
                })
                break;
        }
    }

    componentWillUnmount() {
        console.log(this.props)
    }

    render() {
        return (
            <>
                <Modal isOpen={this.props.isOpen} toggle={this.props.handleClose} id="news-close-modal">
                    {this.state.modalContent}
                </Modal>
            </>
        )
    }
};



function mapStateToProps(store) {
    return {
        // myAccount: store.loanshark.myAccount,
        // numberOfEth: store.loanshark.userDebtBalance,
        // userDepositBalance: store.loanshark.userDepositBalance,
        // userDebtBalance: store.loanshark.userDebtBalance,
        // myFujiVaultETHBTC: store.loanshark.myFujiVaultETHBTC,
        // myFliquidatorAVAX: store.loanshark.myFliquidatorAVAX,
        // myFujiController: store.loanshark.myFujiController,
        // myFujiOracle: store.loanshark.myFujiOracle,
        // myETHContract: store.loanshark.myETHContract,
        // myBTCContract: store.loanshark.myBTCContract,
        // inputBtcDept: store.loanshark.inputBtcDept,
        // inputEthDeposit: store.loanshark.inputEthDeposit,
        // myETHAmount: store.loanshark.myETHAmount,
        // myBTCAmount: store.loanshark.myBTCAmount
    };
}

export default connect(mapStateToProps)(SearchModal);
