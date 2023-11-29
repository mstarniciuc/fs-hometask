import React from 'react';
import {MantineProvider, localStorageColorSchemeManager} from '@mantine/core';
import {Routes, Route } from "react-router-dom";

import {Notifications} from "@mantine/notifications";

//Mantine Style
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

//Pages
import { Home } from './pages/home';
import { Jobs } from './pages/jobs';
import { Login } from './pages/login';
import {AppLayout} from "./core/app-layout";

function App() {
    return (
        <MantineProvider defaultColorScheme="auto"
                         colorSchemeManager={localStorageColorSchemeManager({ key: 'mantine-ui-color-scheme' })}>
            <Notifications />
            <div>
                <Routes>
                    <Route path="/" element={<AppLayout />}>
                        <Route index element={<Home/>}/>
                        <Route path="jobs/:id" element={<Jobs/>}/>
                    </Route>
                    <Route path="login" element={<Login/>}/>
                    <Route path="*" element={<>404</>}/>
                </Routes>
            </div>
        </MantineProvider>
    );
}

export default App;
