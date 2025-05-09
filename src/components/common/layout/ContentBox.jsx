import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

export const ContentBox = ({ sx, ...other }) => {
    return (
        <Box
            sx={{
                p: 1,
                m: 1,
                bgcolor: (theme) => theme.palette.mode === 'dark' ? '#101010' : 'grey.100',
                color: (theme) => theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
                border: '1px solid',
                borderColor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
                borderRadius: 2,
                fontSize: '0.875rem',
                fontWeight: '700',
                ...sx,
            }}
            {...other}
        />
    );
};

ContentBox.propTypes = {
    sx: PropTypes.oneOfType([
        PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])
        ),
        PropTypes.func,
        PropTypes.object,
    ]),
};