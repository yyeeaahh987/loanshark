import React from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import {
    Modal,
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
            default: 
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
    };
}

export default connect(mapStateToProps)(SearchModal);
