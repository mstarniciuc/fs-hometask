import React from "react";
import {Outlet, useNavigate} from "react-router-dom";
import {Text, Button, Flex, Space} from "@mantine/core";
import {AppShell} from '@mantine/core';

export const AppLayout = () => {
    const navigate = useNavigate();
    const loggedUser = localStorage.getItem('loggedUser');
    if (!loggedUser) {
        navigate('/login');
    }

    return <>
        <AppShell
            header={{height: 60}}
            padding="md"
        >
            <AppShell.Header>
                <Flex justify="space-between" p={10}>
                    <Text>Deel</Text>
                    <Space w="full"/>

                    <Button onClick={() => {
                        localStorage.removeItem('loggedUser');
                        navigate('/login')
                    }}>Logout</Button>

                </Flex>
            </AppShell.Header>
            <AppShell.Main>
                <Outlet/>
            </AppShell.Main>
        </AppShell>
    </>
}
