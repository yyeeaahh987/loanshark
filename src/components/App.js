import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router';
import { HashRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider, createGlobalStyle } from 'styled-components'
import { lightTheme, darkTheme} from '../components/Global.styles'
import GlobalStyle from '../components/global'
import '../styles/theme.scss';
import LayoutComponent from '../components/Layout';

import {
	changeTheme
} from "../actions/layout"

const LOANSHARK_MINT = process.env.REACT_APP_LOANSHARK_MINT;
const LOANSHARK_TWITTER = process.env.REACT_APP_LOANSHARK_TWITTER;
const LOANSHARK_DOCUMENT = process.env.REACT_APP_LOANSHARK_DOCUMENT;
const LOANSHARK_INTRODUCTION = process.env.REACT_APP_LOANSHARK_INTRODUCTION;
const LOANSHARK_GITHUB = process.env.REACT_APP_LOANSHARK_GITHUB;
const LOANSHARK_DISCORD = process.env.REACT_APP_LOANSHARK_DISCORD;




const PrivateRoute = ({ dispatch, component, ...rest }) => {
    return ( // eslint-disable-line
        <Route {...rest} render={props => (React.createElement(component, props))} />
    );
};

const CloseButton = ({ closeToast }) => <i onClick={closeToast} className="la la-close notifications-close" />


// class RealComponent extends React.Component {
//     render() {
//         return (
//             <div>
//                 <ToastContainer
//                     autoClose={5000}
//                     hideProgressBar
//                     closeButton={<CloseButton />}
//                 />
//                 <HashRouter>
//                     <Switch>
//                         <Route path="/" exact render={() => <Redirect to="/app/main" />} />
//                         <Route path="/app" exact render={() => <Redirect to="/app/main" />} />
//                         <Route path="/twitter" exact component={() => {
//                             window.location.href = LOANSHARK_TWITTER;
//                             return null;
//                         }} />
//                         <Route path="/documentation" exact component={() => {
//                             window.location.href = LOANSHARK_DOCUMENT;
//                             return null;
//                         }} />
//                         <Route path="/introduction" exact component={() => {
//                             window.location.href = LOANSHARK_INTRODUCTION;
//                             return null;
//                         }} />
//                         <Route path="/github" exact component={() => {
//                             window.location.href = LOANSHARK_GITHUB;
//                             return null;
//                         }} />
//                         <Route path="/discord" exact component={() => {
//                             window.location.href = LOANSHARK_DISCORD;
//                             return null;
//                         }} />
//                         <PrivateRoute path="/app" dispatch={this.props.dispatch} component={LayoutComponent} />
//                     </Switch>
//                 </HashRouter>
//             </div>
//         )
//     }
// }

// const LanguageComponent = withTranslation()(RealComponent)

class App extends React.PureComponent {
    setAppThemeMode(mode) {
		this.props.dispatch(changeTheme(mode));
	}
    componentWillMount() {
        console.log(`componend will mount`)
        console.log(localStorage.getItem("theme"))
        if(localStorage.getItem("theme")===undefined || localStorage.getItem("theme")===null){
            this.setAppThemeMode("dark")
        }else{
            this.setAppThemeMode(localStorage.getItem("theme"))
        }
        
      }
      componentDidMount(){
        console.log(`componend did mount`)
      }
    render() {
        return (
            <div>
                <ThemeProvider  theme={this.props.theme === "light" ? lightTheme : darkTheme}>
                    <GlobalStyle></GlobalStyle>
                    <ToastContainer
                        autoClose={5000}
                        hideProgressBar
                        closeButton={<CloseButton />}
                    />
                    <HashRouter>
                        <Switch>
                            <Route path="/" exact render={() => <Redirect to="/app/main" />} />
                            <Route path="/app" exact render={() => <Redirect to="/app/main" />} />
                            <Route path="/twitter" exact component={() => {
                                window.location.href = LOANSHARK_TWITTER;
                                return null;
                            }} />
                            <Route path="/mint" exact component={() => {
                                window.location.href = LOANSHARK_MINT;
                                return null;
                            }} />
                            <Route path="/documentation" exact component={() => {
                                window.location.href = LOANSHARK_DOCUMENT;
                                return null;
                            }} />
                            <Route path="/introduction" exact component={() => {
                                window.location.href = LOANSHARK_INTRODUCTION;
                                return null;
                            }} />
                            <Route path="/github" exact component={() => {
                                window.location.href = LOANSHARK_GITHUB;
                                return null;
                            }} />
                            <Route path="/discord" exact component={() => {
                                window.location.href = LOANSHARK_DISCORD;
                                return null;
                            }} />
                            <PrivateRoute path="/app" dispatch={this.props.dispatch} component={LayoutComponent} />
                        </Switch>
                    </HashRouter>
                </ThemeProvider>
            </div>
        );
    }
}

// const mapStateToProps = state => ({
//     isAuthenticated: true
// });

function mapStateToProps(store) {
    return {
        theme: store.layout.theme,
    };
}

export default connect(mapStateToProps)(App);
