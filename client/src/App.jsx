import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useRoutes } from 'hookrouter';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './public/styles/main.scss';
import routes from './routes';
import { persistSession } from './redux/actions/session';

import Modal from './components/Modal';
import Toastr from "./components/Toastr";

const App = ({ alert }) => {
    const routeResult = useRoutes(routes);

    useEffect(() => {
        if(alert.type === "error"){
            toast(<Toastr alert={alert} />, { containerId: "error" });
        }
    }, [alert])

    return (
        <div id="App">
            {routeResult}
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
        </div>
    );
}

const mapStateToProps = ({ alert }) => {
    return { 
        alert
    };
}

export default connect(mapStateToProps, { persistSession })(App);