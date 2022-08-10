import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router';
import { HashRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import '../styles/theme.scss';
import LayoutComponent from '../components/Layout';

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

    render() {
        return (
            <div>
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
        </div>
        );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: true
});

export default connect(mapStateToProps)(App);
