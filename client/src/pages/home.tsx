import React from "react";
import {Balance} from "../features/balance";
import {Box} from "@mantine/core";
import {Contracts} from "../features/contracts";




export const Home = () => {
    return (
        <Box bg="white" style={{borderRadius: '5px'}} p={8}>
            <Balance/>
            <Contracts />
        </Box>
    );
};
