import {useEffect, useState} from 'react';
import {Link as RouterLink} from 'react-router-dom';
// material
import {
    Box,
    Button,
    Card, CircularProgress,
    Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider,
    FormControl,
    InputLabel, LinearProgress,
    MenuItem,
    Select,
    Stack,
    TableContainer,
    TextField,
    Typography,
} from '@mui/material';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
// mock
import {
    DataGrid,
    GridColumns,
    GridToolbarColumnsButton,
    GridToolbarContainer,
    GridToolbarDensitySelector, GridValueGetterParams
} from "@mui/x-data-grid";
import {IContainerLocation} from "../types/IContainerLocation";
import {useSnackbar} from 'notistack';
import {
    createContainerLocation, getAllContainerLocations,
    getContainerLocaions,
    getContainerLocation,
    updateContainerLocation
} from "../endpoints/ContainerLocations";
import * as yup from 'yup';
import {useFormik} from 'formik';
import {IGarbageContainer} from "../types/IGarbageContainer";
import {getGarbageContainer, updateGarbageContainer} from "../endpoints/GarbageContainer";
import EditableMap, {IContainerLocationType} from "../components/EditableMap";
import {MapLayerMouseEvent} from "react-map-gl";
import {getOptimalContainers} from "../endpoints/OptimizerEndpoint";


// ----------------------------------------------------------------------

const newContainerLocationValidationSchema = yup.object({
    latitude: yup.number().required(),
    longitude: yup.number().required(),
});

export default function ContainerLocations() {
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState<string>("");
    const [delayedSearch, setDelayedSearch] = useState<string>("");
    const {enqueueSnackbar} = useSnackbar();
    useEffect(() => {
        let timeout = setTimeout(() => {
            setDelayedSearch(search);
        }, 200);
        return () => clearTimeout(timeout);
    }, [search]);
    const [sortBy, setSortBy] = useState<string | undefined>(undefined);
    const [sortOrder, setSortOrder] = useState<string | null | undefined>(undefined);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const [rowCount, setRowCount] = useState(0);
    const [rows, setRows] = useState<Array<IContainerLocationType>>([]);
    const [allMapMarkers, setAllMapMarkers] = useState<Array<IContainerLocationType>>([]);

    const [editContainerLocation, setEditContainerLocation] = useState<IContainerLocation | null>(null);
    const [addDialogOpen, setAddDialogOpen] = useState(false);

    const formik = useFormik({
        initialValues: {
            latitude: 0,
            longitude: 0,
        },
        validationSchema: newContainerLocationValidationSchema,
        onSubmit: async (values) => {
            if (editContainerLocation) {
                let res = await updateContainerLocation(editContainerLocation.id, values);

                if (res.status !== 200)
                    return enqueueSnackbar("Error updating container location", {variant: 'error'});

                let index = rows.findIndex(row => row.id === editContainerLocation.id);
                if (index !== -1) {
                    let newRow = {...rows[index], ...res.data};
                    setRows([newRow, ...rows.filter(row => row.id !== editContainerLocation.id)]);
                    setAllMapMarkers([newRow, ...allMapMarkers.filter(row => row.id !== editContainerLocation.id)]);
                }

                setEditContainerLocation(null);
                setAddDialogOpen(false);
                return enqueueSnackbar("Container location updated", {variant: 'success'});
            }

            let res = await createContainerLocation(values);

            if (res.status !== 200 || res.data.id === undefined)
                return enqueueSnackbar("Error creating container location", {variant: 'error'});

            enqueueSnackbar("Container location created", {variant: 'success'});
            setRows([...rows, res.data]);
            setAllMapMarkers([...allMapMarkers, res.data]);
            setAddDialogOpen(false);
        },
    });

    const loadData = async () => {
        try {
            setLoading(true);

            const {data} = await getContainerLocaions({
                page,
                pageSize,
                sortBy: sortBy ?? '',
                sortOrder: sortOrder ?? '',
                term: delayedSearch,
            });

            if (data == null || data.data == null)
                throw new Error("No data returned");

            setRows(data.data);
            setAllMapMarkers(data.data);
            setRowCount(data.count);

            const allData = await getAllContainerLocations();
            setAllMapMarkers(allData);

        } catch (e) {
            enqueueSnackbar("Error fetching data", {variant: 'error'});
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        loadData();
    }, [page, pageSize, sortBy, sortOrder, delayedSearch]);
    useEffect(() => {
        setPage(0);
    }, [sortBy, sortOrder, delayedSearch])

    const handleEdit = async (id: string) => {
        let res = await getContainerLocation(id);

        if (res.status !== 200)
            return enqueueSnackbar("Error fetching container data", {variant: 'error'});

        setEditContainerLocation(res.data);

        formik.setValues(res.data);

        setAddDialogOpen(true);
    }


    const columns: GridColumns<IContainerLocation> = [
        {field: 'id', headerName: 'Id', editable: false, hideable: true, flex: 1},
        {field: 'latitude', headerName: 'Latitude', editable: false, hideable: true, flex: 1},
        {field: 'longitude', headerName: 'Longitude', editable: false, hideable: true, flex: 1},
    ]

    const [countainerCountDialogOpen, setContainerCountDialogOpen] = useState(false);
    const [containerCount, setContainerCount] = useState(0);
    const [loadedOptimalPoints, setLoadedOptimalPoints] = useState(false);
    const [loadingOptimalPoints, setLoadingOptimalPoints] = useState(false);

    return (
        <Page title="User">
            <Dialog open={countainerCountDialogOpen} onClose={() => setContainerCountDialogOpen(false)}
                    maxWidth={"xl"}>
                <Box minWidth={"40vw"}
                     minHeight={"30vh"}
                >
                    <DialogTitle>Optimize Containers</DialogTitle>
                    {loadingOptimalPoints ? <LinearProgress/> : <>
                        <DialogContent>
                            <DialogContentText>
                                This will generate provisional container positions, that are considered to be optimal,
                                based on available data.
                            </DialogContentText>

                            <TextField
                                sx={{marginTop: "2rem"}}
                                label="Number of containers"
                                value={containerCount}
                                onChange={(e) => setContainerCount(parseInt(e.target.value))}
                                type="number"
                            />
                        </DialogContent>

                        <DialogActions>
                            <Button onClick={() => setContainerCountDialogOpen(false)} color="primary">
                                Cancel
                            </Button>
                            <Button
                                onClick={async () => {
                                    setLoadingOptimalPoints(true);

                                    let optimals = await getOptimalContainers(containerCount);

                                    if (optimals === null)
                                        return enqueueSnackbar("Error fetching optimal containers", {variant: 'error'});

                                    enqueueSnackbar("Optimal containers loaded", {variant: 'success'});

                                    setRows([...rows,
                                        ...optimals.map((o, i) => ({
                                            id: `provisional_${i}`,
                                            latitude: o[0],
                                            longitude: o[1],
                                            type: "candidate"
                                        } as unknown as IContainerLocation))]);

                                    setAllMapMarkers([...allMapMarkers,
                                        ...optimals.map((o, i) => ({
                                            id: `provisional_${i}`,
                                            latitude: o[0],
                                            longitude: o[1],
                                            type: "candidate"
                                        } as unknown as IContainerLocation))]);

                                    setLoadingOptimalPoints(false);
                                    setLoadedOptimalPoints(true);
                                    setContainerCountDialogOpen(false);

                                }}
                            >Submit</Button>
                        </DialogActions>
                    </>}
                </Box>
            </Dialog>


            <Dialog
                open={addDialogOpen}
                onClose={() => setAddDialogOpen(false)}
            >
                <form onSubmit={formik.handleSubmit}>
                    <Stack
                        spacing={3}
                        direction="column"
                        justifyContent={"space-between"}
                        sx={{
                            minWidth: '520px',
                            minHeight: '220px',
                            padding: '24px',
                        }}
                    >
                        <TextField
                            fullWidth
                            id="latitude"
                            name="latitude"
                            label="Latitude"
                            value={formik.values.latitude}
                            onChange={formik.handleChange}
                            error={formik.errors.latitude != null}
                            helperText={formik.errors.latitude}
                        />
                        <TextField
                            fullWidth
                            id="longitude"
                            name="longitude"
                            label="Longitude"
                            value={formik.values.longitude}
                            onChange={formik.handleChange}
                            error={formik.errors.longitude != null}
                            helperText={formik.errors.longitude}
                        />
                        <Button color="primary" variant="contained" fullWidth type="submit">
                            Submit
                        </Button>
                    </Stack>
                </form>
            </Dialog>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Container Locations
                    </Typography>
                    <Button variant="contained" component={RouterLink} to="#"
                            startIcon={<Iconify icon="eva:plus-fill"/>} onClick={
                        () => setAddDialogOpen(true)
                    }>
                        Add Container Location
                    </Button>
                </Stack>

                <Card>
                    <Scrollbar>
                        <TableContainer sx={{minWidth: 800}}>
                            <DataGrid
                                sx={{mb: 1, minWidth: 960}}
                                rows={rows}
                                rowCount={rowCount}
                                loading={loading}
                                rowsPerPageOptions={[10, 20, 50, 100]}
                                pagination
                                page={page}
                                pageSize={pageSize}
                                paginationMode='server'
                                onPageChange={(newPage) => setPage(newPage)}
                                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                                sortingMode='server'
                                onSortModelChange={(newSortModel) => {
                                    setSortBy(newSortModel.at(0)?.field)
                                    setSortOrder(newSortModel.at(0)?.sort);
                                }}

                                columns={columns}
                                disableSelectionOnClick
                                autoHeight
                                onCellDoubleClick={(params) => handleEdit(params.row.id)}


                                initialState={{
                                    columns: {
                                        columnVisibilityModel: {}
                                    }
                                }}/>
                        </TableContainer>
                    </Scrollbar>
                </Card>

                <Divider sx={{marginY: "2rem"}}/>

                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Map
                    </Typography>

                    {loadedOptimalPoints && <Button variant="contained" component={RouterLink} to="#"
                                                    startIcon={<Iconify icon="majesticons:map-marker-path-line"/>}
                                                    onClick={
                                                        async () => {
                                                            let res = await Promise.all(allMapMarkers.map(({
                                                                                                               latitude,
                                                                                                               longitude
                                                                                                           }) => {
                                                                return createContainerLocation({latitude, longitude});
                                                            }));

                                                            if (res === null)
                                                                return enqueueSnackbar("Error creating container locations", {variant: 'error'});

                                                            setAllMapMarkers([
                                                                ...allMapMarkers.filter(({id}) => !id.startsWith("provisional_")),
                                                                ...res.map((r, i) => ({
                                                                    id: r.data.id,
                                                                    latitude: r.data.latitude,
                                                                    longitude: r.data.longitude,

                                                                }))

                                                            ]);

                                                            enqueueSnackbar("All candidate positions inserterd", {variant: 'success'});
                                                            setAddDialogOpen(false);
                                                        }
                                                    }>
                        Accept all candidates
                    </Button>}

                    {!loadedOptimalPoints && <Button variant="contained" component={RouterLink} to="#"
                                                     startIcon={<Iconify icon="majesticons:map-marker-path-line"/>}
                                                     onClick={
                                                         () => setContainerCountDialogOpen(true)
                                                     }>
                        Get Candidate Locations
                    </Button>}
                </Stack>

                <EditableMap
                    paths={[]}
                    containers={allMapMarkers}
                    onUpdateFunc={async (newContainer) => {
                        let res = await updateContainerLocation(newContainer.id, newContainer);

                        if (res.status !== 200) {
                            enqueueSnackbar("Error updating container location", {variant: 'error'});
                            return null;
                        }

                        enqueueSnackbar("Container location updated", {variant: 'success'});
                        setRows(allMapMarkers.map(c => c.id === newContainer.id ? res.data : c));
                        setAllMapMarkers(allMapMarkers.map(c => c.id === newContainer.id ? res.data : c));

                        return res.data;
                    }}
                    onAddNewMarker={async (newContainer) => {
                        let res = await createContainerLocation(newContainer);

                        if (res.status !== 200 || res.data.id === undefined) {
                            enqueueSnackbar("Error creating container location", {variant: 'error'});
                            return null;
                        }

                        enqueueSnackbar("Container location created", {variant: 'success'});
                        setRows([...rows, res.data]);
                        setAllMapMarkers([...allMapMarkers, res.data]);

                        return res.data;
                    }}
                    width={'100%'}
                    height={'80vh'}
                />
            </Container>
        </Page>
    );
}

