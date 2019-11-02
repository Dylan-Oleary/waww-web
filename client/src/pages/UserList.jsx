import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory, useRouteMatch } from "react-router-dom";

import ListViewCard from '../components/ListViewCard';

const UserList = ({ isLoggedIn, user }) => {
    const history = useHistory();
    const match = useRouteMatch();

    useEffect(() => {
        const token = window.localStorage.getItem("token");

        if(!token){
            history.push("/error/401");
        }
    }, []);

    const renderContent = () => {
        const listName = match.url.slice(7);

        if(user && user._id){
            if(user[listName] && user[listName].length > 0){
                return user[listName].map(movie => {
                    return <ListViewCard key={ movie._id } movie={ movie } />
                });
            } else {
                return <div>`You have zero movies in the ${listName} list`</div>
            }
        } else {
            return <div className="ui active loader massive"></div>
        }
    }

    return (
        <div className="flex space-between">
            {renderContent()}
        </div>
    );
};

const mapStateToProps = ({ user, login }) => {
    return { 
        user: user,
        isLoggedIn: login.isLoggedIn
    };
}

export default connect(mapStateToProps)(UserList);