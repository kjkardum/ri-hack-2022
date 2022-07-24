import {Link as RouterLink} from 'react-router-dom';
// material
import {Grid, Button, Container, Stack, Typography, Box} from '@mui/material';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';

import NativeMap from "../components/NativeMap";
import {useEffect, useState} from "react";
import {IContainerLocation} from "../types/IContainerLocation";
import {getAllContainerLocations} from "../endpoints/ContainerLocations";
import {useSnackbar} from 'notistack';
import {getOptimalRute} from "../endpoints/OptimizerEndpoint";
import RouteMap from "../components/RouteMap";
// ------------------------------------------------------------------------

export default function Routing() {

    const [points, setPoints] = useState<[number, number][]>([]);
    const [lines, setLines] = useState<[number, number][][]>([]);

    const {enqueueSnackbar} = useSnackbar();

    useEffect(() => {
        (
            async () => {
                const data = await getAllContainerLocations();

                if (data === null)
                    return enqueueSnackbar("Error fetching data", {variant: 'error'});

                setPoints(data.map(x => [x.longitude, x.latitude]));
            }
        )();
    }, []);

    console.log(lines);

    return (
        <Page title="Dashboard: Blog">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Route optimization
                    </Typography>
                    <Button
                        onClick={async () => {
                            let data = await getOptimalRute(10, 10);

                            if (data === null)
                                return enqueueSnackbar("Error fetching data", {variant: 'error'});

                            setLines(data);

                        }}
                        variant="contained" component={RouterLink} to="#" startIcon={<Iconify icon="eva:plus-fill"/>}>
                        Optimize route
                    </Button>
                </Stack>

                <Box>
                    <RouteMap lines={lines} points={points} onClickFunc={() => {
                    }} width={"100%"} height={"70vh"}/>
                </Box>
            </Container>
        </Page>
    );
}
