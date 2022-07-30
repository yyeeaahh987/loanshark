import React from 'react';
import PropTypes from 'prop-types';
import { UncontrolledTooltip } from 'reactstrap';
// import s from './Widget.module.scss';
import classNames from 'classnames';
import './DisplayBox.scss'
// import Loader from '../Loader'; // eslint-disable-line css-modules/no-unused-class
// import AnimateHeight from 'react-animate-height';
// import uuidv4 from 'uuid/v4'
// import {
//   DropdownToggle,
//   DropdownMenu,
//   DropdownItem,
//   UncontrolledDropdown,
//   Button,
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
// } from 'reactstrap';

// import dropdownImg from '../../images/widget-menu.svg'

class DisplayBox extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
  };

  static defaultProps = {
      // title: null,
      children: [],
      // className: '',
  };

  constructor(props) {
    super(props);

    this.state = {
    //   randomId: uuidv4(),
    }

  }


  render() {

    const {
      children,
    } = this.props;

    const {
    //   reloading,
    //   fullscreened,
    //   randomId,
    //   height,
    //   hideWidget,
    //   collapseWidget,
    //   modal,
    } = this.state;



    return (
        <div className='box'>
          <div className='box__inner'>
            {children}
          </div>
        </div>
    );
  }
}

export default DisplayBox;
