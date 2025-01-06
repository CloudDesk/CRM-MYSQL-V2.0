import { Suspense } from 'react';
import { Routes, BrowserRouter } from 'react-router-dom';
import routes from '.';
import { Box, CircularProgress } from '@mui/material';

const LoadingFallback = () => (
    <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
    }}>
        <CircularProgress />
    </Box>
);

const router = BrowserRouter(routes);

export const RouterConfig = () => {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes router={router} />
        </Suspense>
    );
};