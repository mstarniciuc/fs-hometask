import React, {useState} from "react";
import {Button, ButtonGroup, Divider, Text} from "@mantine/core";
import useSWRMutation from "swr/mutation";
import {sendRequest} from "../../core/services/fetcher";
import {notifications} from "@mantine/notifications";

const depositAmounts = [1, 5, 10, 50, 100, 500];
export const Balance = () => {
    const [balance, setBalance] = useState(localStorage.getItem('balance') || 0);
    const profileId = localStorage.getItem('loggedUser');
    const {trigger} = useSWRMutation(`balances/deposit/${profileId}`, sendRequest, {});

    const handleSupply = async (amount: any) => {
        try {
            const response = await trigger({amount});
            notifications.show({
                color: 'green',
                title: 'Deposit',
                message: `Deposit was supplied with ${amount}, balance is ${response.data.balance}`
            });
            setBalance(response.data.balance);
            localStorage.setItem('balance', response.data.balance)
        } catch (err) {
            let message: 'Something wrong';
            if (err && err.response && err.response.data) {
                message = err.response.data.error.message;
            }
            notifications.show({
                color: 'red',
                title: 'Deposit Error',
                message: message
            });
        }
    };


    return <>
        <Text color="black">Welcome Back: {localStorage.getItem('username')}</Text>
        <Text color="black">Balance: {balance}</Text>
        <Divider p={5}/>
        <Text color="black">Supply the profile '{localStorage.getItem('username')}' with follow amount:</Text>
        <ButtonGroup>
            {depositAmounts.map((amount) => (
                <Button
                    key={amount}
                    onClick={() => handleSupply(amount)}
                >
                    Deposit ${amount}
                </Button>
            ))}
        </ButtonGroup>
    </>;
}