import PropTypes from "prop-types";
import React from "react";
import {
    Input,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from 'reactstrap';

class Popup extends React.Component {
    static propTypes = {
        modal: PropTypes.bool,
        close: PropTypes.func,
        modalTitle: PropTypes.string,
        modalAction: PropTypes.string,
        modalToken: PropTypes.string,
        subHeading: PropTypes.string,
        value: PropTypes.any,
        onChange: PropTypes.func,
        modalCall: PropTypes.func,
    };

    static defaultProps = {
        modal: () => { },
        close: () => { },
        modalTitle: "",
        modalAction: "",
        modalToken: "",
        subHeading: "",
        value: "",
        onChange: () => { },
        modalCall: () => { },
    };
    constructor(props) {
        super();
    }

    componentDidMount() {
    }


    render() {
        return (
            <div>
                <Modal isOpen={this.props.modal} toggle={this.props.close} style={{ color: '#000000' }}>
                    <ModalHeader toggle={this.props.close}>{this.props.modalTitle}</ModalHeader>
                    <ModalBody>
                        {this.props.subHeading}
                        {/* {this.props.modalAction} {this.props.modalToken} : */}
                        <Input
                            value={this.props.value}
                            onChange={this.props.onChange}>
                        </Input>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.props.modalCall}>Confirm</Button>{' '}
                        <Button color="secondary" onClick={this.props.close}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}


export default Popup;