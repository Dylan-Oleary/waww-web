import React, { useEffect } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import { connect } from 'react-redux';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './public/styles/main.scss';
import { persistSession } from './redux/actions/session';

import Modal from './components/Modal';
import Toastr from "./components/Toastr";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Error from "./pages/Error";
import Layout from "./components/Layout";

const App = ({ alert }) => {
    useEffect(() => {
        if(alert.type === "error"){
            toast(<Toastr alert={alert} />, { containerId: alert.type });
        }
        if(alert.type === "success"){
            toast(<Toastr alert={alert} />, { containerId: alert.type });
        }
    }, [alert])

    return (
        <Router>
            <div id="App">
                <Modal />
                <ToastContainer
                    autoClose={2500}
                    enableMultiContainer 
                    containerId={"success"}
                    pauseOnHover={false}
                    toastClassName="toast-success"
                    progressClassName="toast-progress"
                />
                <ToastContainer
                    autoClose={2500}
                    enableMultiContainer 
                    containerId={"error"}
                    pauseOnHover={false}
                    toastClassName="toast-error"
                    progressClassName="toast-progress"
                />
                <ToastContainer
                    autoClose={2500}
                    enableMultiContainer
                    position="top-center"
                    containerId={"general"}
                    toastClassName={"toast-general"}
                    bodyClassName="toast-general-body"
                    hideProgressBar={true}
                    transition={Zoom}
                />
                <Switch>
                    <Route path="/login" component={ Login } />
                    <Route path="/register" component={ Register } />
                    <Route path="/error" component={ Error } />
                    <Route path="/" component={ Layout } />
                </Switch>
            </div>
        </Router>
    );
}

const mapStateToProps = ({ alert }) => {
    return {
        alert
    };
}

export default connect(mapStateToProps, { persistSession })(App);