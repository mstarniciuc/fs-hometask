import React from "react";
import {useNavigate} from "react-router-dom";

import {
    Paper,
    Title
} from '@mantine/core';
import classes from './style.module.css';

import {Profiles} from "../../features/profiles";


export const Login = () => {
    const navigate = useNavigate();
    const loggedUser = localStorage.getItem('loggedUser');
    if (loggedUser) {
        navigate('/');
    }

    return <div className={classes.wrapper}>
        <Paper className={classes.form} radius={0} p={30}>
            <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
                Welcome back!
            </Title>
            <Profiles />
        </Paper>
    </div>
}