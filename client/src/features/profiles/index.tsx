import React, {useState} from "react";
import {Button, Select} from "@mantine/core";
import {transformModelToOption} from "./utils";
import useSWR from "swr";
import {fetchGet, sendRequest} from "../../core/services/fetcher";
import useSWRMutation from "swr/mutation";
import {useNavigate} from "react-router-dom";

import {notifications} from '@mantine/notifications';

export const Profiles = () => {
    const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
    const navigate = useNavigate();
    const {data, error} = useSWR('profiles', fetchGet);
    const {trigger} = useSWRMutation('profiles/login', sendRequest, {})

    if (error) {
        return <>Error</>
    }

    const {data: profiles = []} = data || {};

    const handleOnLogin = async () => {
        try {
            const loggedProfile = await trigger({id: selectedProfile});

            localStorage.setItem('loggedUser', loggedProfile.data.id)
            localStorage.setItem('username', `${loggedProfile.data.firstName} ${loggedProfile.data.lastName}`)
            localStorage.setItem('balance', loggedProfile.data.balance)
            return navigate('/');
        } catch (err) {
            notifications.show({
                color: 'red',
                title: 'Login Error',
                message: 'Something went wrong'
            });
        }
    }

    return (
        <div>
            <Select
                label="Profile"
                placeholder="Pick profile"
                data={transformModelToOption(profiles)}
                searchable
                onChange={setSelectedProfile}
                nothingFoundMessage="Nothing found..."
            />
            <Button fullWidth mt="xl" size="md" onClick={handleOnLogin}>
                Login
            </Button>
        </div>
    );
};
