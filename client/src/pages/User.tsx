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

import * as yup from 'yup';
import {useFormik} from 'formik';
import {getAllUsers, registerAccount} from "../endpoints/AccountEndpoints";
import {IUser} from "../types/IUser";
import {GarbageContainerTypeString, IGarbageContainer} from "../types/IGarbageContainer";


// ----------------------------------------------------------------------

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
    const [rows, setRows] = useState<Array<IUser>>([]);

    const [editContainerLocation, setEditContainerLocation] = useState<IContainerLocation | null>(null);
    const [addDialogOpen, setAddDialogOpen] = useState(false);

    const loadData = async () => {
        try {
            setLoading(true);

            const users = await getAllUsers();

            if (users == null)
                throw new Error("No data returned");

            setRows(users);
            setRowCount(users.length);
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

    const columns: GridColumns<IUser> = [
        {field: 'id', headerName: 'Id', editable: false, hideable: true, flex: 1},
        {field: 'email', headerName: 'Email', editable: false, hideable: true, flex: 1},
        {
            field: 'Roles', headerName: 'Roles', editable: false, hideable: true, flex: 1,
            valueGetter: ({row}: GridValueGetterParams<any, IUser>) => row.roles ? row.roles.join(", ") : ''
        },
    ]

    return (
        <Page title="User">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Users
                    </Typography>
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

