import React, { useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Loader from '../Loader';
import { Item } from './Item';

const FlexLayout = ({ DetailComponent, RelatedItemsComponent }) => {
    const [passedRecord, setPassedRecord] = useState();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.record?.item) {
            setPassedRecord(location.state.record.item);
        }
    }, [location.state]);

    if (!passedRecord) {
        return <Loader />;
    }

    return (
        <div style={{ width: '100%' }}>
            <Box
                sx={{
                    display: 'flex',
                    p: 1,
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                }}
            >
                <Grid container>
                    <Grid item xs={12} md={8}>
                        <Item>
                            <DetailComponent props={passedRecord} />
                        </Item>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Item>
                            <RelatedItemsComponent props={passedRecord} />
                        </Item>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
};



export default FlexLayout;