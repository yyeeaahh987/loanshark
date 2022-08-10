// import React from "react";
// import { connect } from "react-redux";
// import {
//     Row,
//     Col,
//     InputGroup,
//     Input,
//     ModalHeader,
// } from "reactstrap";
// import { FixedSizeList } from "react-window"
// import { List } from "react-virtualized";
// import { getToken, isAddress } from '../../utils/commonFunction'

// class RowTest extends React.Component {
//     static propTypes = {
//     };

//     constructor(props) {
//         super(props);
//         this.state = {
//         };
//     }

//     componentDidMount() {
//         console.log(this.props)

//     }

//     componentWillReceiveProps() {
//         console.log(this.props)
//     }

//     componentWillUnmount() {
//         console.log(this.props)
//     }

//     render() {
//         return (
//             <>
//                 <div
//                     abc={console.log(this.props.index)}
//                     style={{ color: "black" }}
//                 >{`Row ${this.props.index}`}</div>
//             </>
//         )
//     }
// };

// class TokenSearch extends React.Component {
//     static propTypes = {
//         // isOpen: PropTypes.bool.isRequired,
//         // handleClose: PropTypes.func.isRequired,
//         // type: PropTypes.string.isRequired,
//         // size: PropTypes.number.isRequired
//     };

//     constructor(props) {
//         super(props);

//         this._getRowHeight = this._getRowHeight.bind(this);
//         this._noRowsRenderer = this._noRowsRenderer.bind(this);
//         this._rowRenderer = this._rowRenderer.bind(this);
//         this._filterTokenList = this._filterTokenList.bind(this);
//         this.state = {
//             listHeight: 300,
//             listRowHeight: 50,
//             overscanRowCount: 10,
//             // rowCount: context.list.size,
//             scrollToIndex: undefined,
//             showScrollingPlaceholder: false,
//             useDynamicRowHeight: false,
//             tokenList: [],
//             // tokenList: getToken(),
//             searchParam: "",
//         };
//     }

//     componentDidMount() {
//         console.log(this.props)
//         this.setState({ tokenList: getToken() })
//     }

//     componentWillReceiveProps() {
//         console.log(this.props)
//     }

//     componentWillUnmount() {
//         console.log(this.props)
//     }

//     componentDidUpdate = (prevProps, prevState) => {
//         /* attach listeners to google StreetView */
//         console.log(this.state)
//     }


//     _filterTokenList(filterPara, tokenList) {
//         console.log(`_filterTokenList`, filterPara, getToken())
//         if(filterPara==="") return getToken()
        
//         let result = isAddress(filterPara)
//         console.log(result)
//         let resultList = getToken().filter((eachToken) => {
//             return eachToken.symbol.includes(filterPara.toUpperCase())
//         })
//         console.log(resultList)
//         return resultList
//     }
//     _getDatum(index) {
//         return ["abc", "def", "dee"]
//         const { list } = this.context;

//         return list.get(index % list.size);
//     }


//     _noRowsRenderer() {
//         return <div>No rows</div>;
//     }
//     _getRowHeight({ index }) {
//         return this._getDatum(index).size;
//     }

//     _rowRenderer({ index, isScrolling, key, style }) {
//         // const { showScrollingPlaceholder, useDynamicRowHeight } = this.state;
//         const datum = this._getDatum(index);
//         const list = ["abc", "def", "dee"]
//         return (
//             <div key={key} style={style}>
//                 {list[index]}
//             </div>
//         );
//     }

//     render() {
//         return (
//             <>
//                 <Row>
//                     <Col xs={12}>
//                         <ModalHeader
//                             charCode="X"
//                             toggle={() => {
//                                 console.log(`toggle modal`)
//                             }}
//                             style={{ color: "black" }}
//                         >
//                             Select a token
//                         </ModalHeader>

//                     </Col>
//                     <Col xs={12}>
//                         <div style={{ color: "black" }}>Search name or paste address</div>
//                         <InputGroup>
//                             <Input placeholder="Search name or paste address"
//                                 value={this.state.searchParam}
//                                 onChange={(e) => {
//                                     console.log(e.target.value)
//                                     let result = this._filterTokenList(e.target.value, this.state.tokenList)
//                                     console.log(result)
//                                     if (result !== this.state.tokenList) {
//                                         this.setState({ tokenList: result })
//                                     }
//                                     this.setState({ searchParam: e.target.value })

//                                 }}
//                             ></Input>
//                         </InputGroup>
//                     </Col>
//                     <Col xs={12}>
//                         <div style={{ color: "black" }}>default token</div>
//                     </Col>
//                     <Col xs={12}>
//                         <List
//                             // 窗口的高度,必填
//                             height={200}
//                             // 窗口的宽度,必填
//                             width={300}
//                             // 总共个数

//                             rowCount={this.state.tokenList.length}
//                             // cell高度
//                             rowHeight={30}
//                             // style={{ outline: "none" }}
//                             rowRenderer={({ key, index, isScrolling, style }) => {
//                                 // if (isScrolling) { return <div key={key} style={{ color: "black" }}>loading...</div> }
//                                 return <div style={{ color: "black" }} key={key}>{this.state.tokenList?.[index]?.name ?? ""}</div>
//                             }}
//                         >
//                         </List>
//                     </Col>
//                     <Col xs={12}>
//                         <div style={{ color: "black" }}>manage token lists</div>
//                     </Col>
//                 </Row>
//                 <pre>{JSON.stringify(this.state.searchParam, null, 2)}</pre>
//             </>
//         )
//     }
// };



// function mapStateToProps(store) {
//     return {
//         // myAccount: store.loanshark.myAccount,
//         // numberOfEth: store.loanshark.userDebtBalance,
//         // userDepositBalance: store.loanshark.userDepositBalance,
//         // userDebtBalance: store.loanshark.userDebtBalance,
//         // myFujiVaultETHBTC: store.loanshark.myFujiVaultETHBTC,
//         // myFliquidatorAVAX: store.loanshark.myFliquidatorAVAX,
//         // myFujiController: store.loanshark.myFujiController,
//         // myFujiOracle: store.loanshark.myFujiOracle,
//         // myETHContract: store.loanshark.myETHContract,
//         // myBTCContract: store.loanshark.myBTCContract,
//         // inputBtcDept: store.loanshark.inputBtcDept,
//         // inputEthDeposit: store.loanshark.inputEthDeposit,
//         // myETHAmount: store.loanshark.myETHAmount,
//         // myBTCAmount: store.loanshark.myBTCAmount
//     };
// }

// export default connect(mapStateToProps)(TokenSearch);
