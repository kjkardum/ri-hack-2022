import {useEffect, useState} from 'react';
import {Link as RouterLink} from 'react-router-dom';
// material
import {
    Button,
    Card,
    Container, Dialog,
    FormControl,
    InputLabel,
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
    createContainerLocation,
    getContainerLocaions,
    getContainerLocation,
    updateContainerLocation
} from "../endpoints/ContainerLocations";
import * as yup from 'yup';
import {useFormik} from 'formik';
import {IGarbageContainer} from "../types/IGarbageContainer";
import {getGarbageContainer, updateGarbageContainer} from "../endpoints/GarbageContainer";


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
    const [rows, setRows] = useState<Array<IContainerLocation>>([]);

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
            setRowCount(data.count);
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

    return (
        <Page title="User">
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
            </Container>
        </Page>
    );
}

