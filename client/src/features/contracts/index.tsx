import React, {useState} from "react";
import {Autocomplete, Box, Button, Text} from "@mantine/core";
import useSWR from "swr";
import {fetchGet} from "../../core/services/fetcher";
import {useNavigate} from "react-router-dom";

export const Contracts = () => {
    const profileId = localStorage.getItem('loggedUser');
    const [contractorId, setContractorId] = useState<string>('');
    const navigation = useNavigate();

    const {data, error} = useSWR('profiles?type=contractor', fetchGet);
    const {data: contractors = []} = data || {};
    if (error) {
        return <>Error</>;
    }

    const handleContinue = () => {
        navigation(`/jobs/${contractorId}`);
    };

    return (
        <Box mt={20}>
            <Text color="black">Search Jobs for...</Text>
            <Autocomplete
                w="280px"
                label="Pay Jobs for…"
                placeholder="Pick the contractor"
                onOptionSubmit={(id) => setContractorId(id)}
                data={contractors.map((contr) => {
                    return {
                        value: contr.id.toString(),
                        label: `${contr.firstName} ${contr.lastName}`
                    }
                })}
            />
            <Box mt={8}>
                <Button
                    variant="primary"
                    disabled={!contractorId}
                    onClick={handleContinue}
                >
                    Continue
                </Button>
            </Box>
        </Box>
    );
}