import {Badge, Button, Table} from "@mantine/core";
import React from "react";
import {useNavigate, useParams} from "react-router-dom";
import useSWR from "swr";
import {fetchGet, sendRequest} from "../core/services/fetcher";
import {notifications} from "@mantine/notifications";



export function Jobs() {
    let {id} = useParams();
    const navigation = useNavigate();
    const balance = localStorage.getItem('balance');

    const {data, error, mutate} = useSWR(`jobs?contractor_id=${id}`, fetchGet);

    if (error) {
        return <>
            <Button onClick={() => navigation('/')}>Main Page</Button>
            <h1>Error</h1>
        </>
    }

    const payForJob = async (jobId: number) => {
        try {
            const paidJob = await sendRequest(`jobs/${jobId}/pay`, { arg: {}});
            notifications.show({
                color: 'green',
                title: 'Payment',
                message: `Job was paid!`
            });
            await mutate();
        } catch (err) {
            let message: 'Something wrong';
            if (err && err.response && err.response.data) {
                message = err.response.data.error.message;
            }
            notifications.show({
                color: 'red',
                title: 'Payment Error',
                message: message
            });
        }
    };

    const rows = (data || []).map((job) => (
        <Table.Tr key={job.id}>
            <Table.Td>{job.description}</Table.Td>
            <Table.Td>{job.paid ? <Badge color="blue">Paid</Badge> : <Badge color="red">Unpaid</Badge>}</Table.Td>
            <Table.Td>{job.price}</Table.Td>
            <Table.Td>
                <Button disabled={job.paid || parseFloat(balance) - job.price < 0} onClick={() => payForJob(job.id)}>Pay</Button>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <div>
            <Button onClick={() => navigation('/')}>Main Page</Button>
            <br />
            {!(data || []).length ? 'The contractor do not have Jobs!' : <>
                <h1>List of jobs for selected contractor</h1>
                <Table.ScrollContainer minWidth={500} type="native">
                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Description</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Price</Table.Th>
                                <Table.Th>Action</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows}</Table.Tbody>
                    </Table>
                </Table.ScrollContainer>
            </>
            }
        </div>
    );
}