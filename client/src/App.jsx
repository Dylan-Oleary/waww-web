import React, { useEffect }from 'react';
import { connect } from 'react-redux';
import { useRoutes, usePath } from 'hookrouter';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './public/styles/main.scss';
import routes from './routes';
import { persistUser } from './redux/actions/session';
import Toastr from './components/Toastr';
import Modal from './components/Modal';

const toastrAlert = (messages, type, alertFor) => {
    switch(type){
        case "success" :
            return toast(<Toastr messages={messages} type={type} alertFor={alertFor} />, { containerId: "success" });
        case "error" :
            return toast(<Toastr messages={messages} type={type} alertFor={alertFor} />, { containerId: "error" });
        case "general" :
            return toast(<Toastr messages={messages} type={type} alertFor={alertFor} />, { containerId: "general" });
        default :
            return toast(messages);
    }
}

const App = ({ login, alerts, persistUser }) => {
    const routeResult = useRoutes(routes);
    const currentPath = usePath();

    //Log the user in on page refresh if they have a token
    useEffect(() => {
        if(window.localStorage.getItem("token") && login.isLoggedIn === false){
            persistUser(window.localStorage.getItem("token"), currentPath);            
        }
    })

    //Toastr Errors
    useEffect(() => {
        if(alerts.error && alerts.error.alertMessages){
            toastrAlert(alerts.error.alertMessages, "error", alerts.error.alertFor);
        }
        if(alerts.success && alerts.success.alertMessages){
            toastrAlert(alerts.success.alertMessages, "success", alerts.success.alertFor);
        }
        if(alerts.general && alerts.general.alertMessages){
            toastrAlert(alerts.general.alertMessages, "general", alerts.general.alertFor);
        }
    }, [alerts])

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

const mapStateToProps = ({ login, alerts }) => {
    return { login, alerts }
}

export default connect(mapStateToProps, { persistUser })(App);