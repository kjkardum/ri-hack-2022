import {useEffect, useState} from 'react';
import {Link as RouterLink} from 'react-router-dom';
// material
import {
    Autocomplete,
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
import {GarbageContainerType, GarbageContainerTypeString, IGarbageContainer} from "../types/IGarbageContainer";

import * as yup from 'yup';
import {useFormik} from 'formik';
import {createContainerLocation, getAllContainerLocations, getContainerLocaions} from "../endpoints/ContainerLocations";
import {
    createGarbageContainer,
    getGarbageContainer,
    getGarbageContainers,
    updateGarbageContainer
} from "../endpoints/GarbageContainer";

// ----------------------------------------------------------------------

const newGarbageContainerValidationSchema = yup.object({
    label: yup.string().required(),
    type: yup.number().required().min(0),
    maxWeight: yup.number().required().min(0),
    containerLocationId: yup.string().required(),
});

export default function GarbageContainers() {
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
    const [filterBy, setFilterBy] = useState<GarbageContainerType[] | null>(null);
    const [rowCount, setRowCount] = useState(0);
    const [rows, setRows] = useState<Array<IGarbageContainer>>([]);

    const [editDialogGarbageContainer, setEditDialogGarbageContainer] = useState<IGarbageContainer | null>(null);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [containerLocaitons, setContainerLocaitons] = useState<IContainerLocation[]>([]);

    const formik = useFormik({
        initialValues: {
            label: "",
            type: -1,
            maxWeight: 0,
            containerLocationId: "",
        },
        validationSchema: newGarbageContainerValidationSchema,
        onSubmit: async (values) => {
            if (editDialogGarbageContainer) {
                let res = await updateGarbageContainer(editDialogGarbageContainer.id, values);

                if (res.status !== 200)
                    return enqueueSnackbar("Error updating container", {variant: 'error'});

                let index = rows.findIndex(row => row.id === editDialogGarbageContainer.id);
                if (index !== -1) {
                    let newRow = {...rows[index], ...res.data};
                    setRows([newRow, ...rows.filter(row => row.id !== editDialogGarbageContainer.id)]);
                }

                setEditDialogGarbageContainer(null);
                setAddDialogOpen(false);
                return enqueueSnackbar("Garbage container updated", {variant: 'success'});
            }

            let res = await createGarbageContainer(values);

            if (res.status !== 200)
                return enqueueSnackbar("Error creating container location", {variant: 'error'});

            enqueueSnackbar("Garbage container created", {variant: 'success'});
            setRows([...rows, res.data]);
            setAddDialogOpen(false);
        },
    });

    const loadData = async () => {
        try {
            setLoading(true);

            const {data} = await getGarbageContainers({
                page,
                pageSize,
                sortBy: sortBy ?? '',
                sortOrder: sortOrder ?? '',
                term: delayedSearch,
                type: filterBy,
            });

            if (data == null || data.data == null)
                return;

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
    }, [page, pageSize, sortBy, sortOrder, delayedSearch, filterBy]);
    useEffect(() => {
        setPage(0);
    }, [sortBy, sortOrder, delayedSearch, filterBy])

    useEffect(() => {
        (async () => {
            let res = await getAllContainerLocations();

            if (res.status !== 200)
                return enqueueSnackbar("Error fetching container locations", {variant: 'error'});

            setContainerLocaitons(res.data);
        })()
    }, []);


    const handleEdit = async (id: string) => {
        let res = await getGarbageContainer(id);

        if (res.status !== 200)
            return enqueueSnackbar("Error fetching container data", {variant: 'error'});

        setEditDialogGarbageContainer(res.data);

        formik.setFieldValue('label', res.data.label);
        formik.setFieldValue('type', res.data.type);
        formik.setFieldValue('maxWeight', res.data.maxWeight);
        formik.setFieldValue('containerLocationId', res.data.containerLocationId);

        setAddDialogOpen(true);
    }



    const columns: GridColumns<IGarbageContainer> = [
        {field: 'id', headerName: 'Id', editable: false, hideable: true, flex: 1},
        {field: 'label', headerName: 'Label', editable: false, hideable: true, flex: 1},
        {
            field: 'type',
            headerName: 'Type',
            editable: false,
            hideable: true,
            flex: 1,
            valueGetter: ({row}: GridValueGetterParams<any, IGarbageContainer>) => row.type ? GarbageContainerTypeString(row.type) : ''
        },
        {field: 'maxWeight', headerName: 'Max weight', editable: false, hideable: true, flex: 1},
        {field: 'ContainerLocationId', headerName: 'Location id', editable: false, hideable: true, flex: 1},
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
                        <Typography variant="h6">Add garbage container</Typography>
                        <TextField
                            fullWidth
                            id="label"
                            name="label"
                            label="Label"
                            value={formik.values.label}
                            onChange={formik.handleChange}
                            error={formik.errors.label != null}
                            helperText={formik.errors.label}
                        />
                        <Autocomplete
                            id="containerLocationId"
                            options={containerLocaitons.map(x => x.id)}
                            sx={{width: "100%"}}
                            onChange={(event, value) => {
                                formik.setFieldValue('containerLocationId', value);
                            }}
                            value={formik.values.containerLocationId}
                            renderInput={(params) => (
                                <TextField
                                    {...params} label="Container location" variant="outlined"
                                    error={formik.errors.containerLocationId != null}
                                    helperText={formik.errors.containerLocationId}
                                />
                            )}
                        />
                        <TextField
                            fullWidth
                            id="maxWeight"
                            name="maxWeight"
                            label="Max weight"
                            value={formik.values.maxWeight}
                            onChange={formik.handleChange}
                            error={formik.errors.maxWeight != null}
                            helperText={formik.errors.maxWeight}
                        />
                        <FormControl>
                            <InputLabel>Type</InputLabel>
                            <Select
                                fullWidth
                                id="type"
                                name="type"
                                label="Type"
                                value={formik.values.type}
                                onChange={formik.handleChange}
                                error={formik.errors.type != null}
                            >
                                <MenuItem value={GarbageContainerType.Plastic}>Plastic</MenuItem>
                                <MenuItem value={GarbageContainerType.Paper}>Paper</MenuItem>
                                <MenuItem value={GarbageContainerType.Metal}>Metal</MenuItem>
                                <MenuItem value={GarbageContainerType.Other}>Garbage</MenuItem>
                            </Select>
                        </FormControl>

                        <Button color="primary" variant="contained" fullWidth type="submit">
                            Submit
                        </Button>
                    </Stack>
                </form>
            </Dialog>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Garbage Containers
                    </Typography>
                    <Button variant="contained" component={RouterLink} to="#"
                            startIcon={<Iconify icon="eva:plus-fill"/>}
                            onClick={() => setAddDialogOpen(true)}
                    >
                        Add Garbage Container
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
                                components={{
                                    Toolbar: CustomToolbar,
                                }}
                                componentsProps={{
                                    toolbar: {
                                        value: search,
                                        onChange: (event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value),
                                        onTagSelected: (tag: GarbageContainerType | null) => setFilterBy(([tag])),
                                    }
                                }}
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


function CustomToolbar(props: any) {
    const [filterValue, setFilterValue] = useState<string | GarbageContainerType>('None');
    useEffect(() => {
        props.onTagSelected(filterValue !== 'None' ? (filterValue as GarbageContainerType) ?? null : null);
    }, [filterValue]);
    return (
        <GridToolbarContainer>
            <Stack direction='row' spacing={2}>
                <GridToolbarColumnsButton/>
                <GridToolbarDensitySelector/>
                <TextField
                    size='small'
                    placeholder='Search'
                    value={props.value}
                    onChange={props.onChange}
                    type='search'/>
                <FormControl sx={{minWidth: 400}} size='small'>
                    <InputLabel id="selectAssetTypeLabel">Asset Type</InputLabel>
                    <Select
                        labelId="selectAssetTypeLabel"
                        label="Asset Type"
                        size='small'
                        value={filterValue}
                        onChange={(e) => setFilterValue(e.target.value)}
                    >
                        <MenuItem value={"None"}>
                            <em>None</em>
                        </MenuItem>
                        {Object.values(GarbageContainerType).filter(t => !isNaN(Number(t))).map(t => t as GarbageContainerType).map((type) => (
                            <MenuItem key={type} value={type}>{GarbageContainerTypeString(type)}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Stack>
        </GridToolbarContainer>
    );
}
