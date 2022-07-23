import {useEffect, useState} from 'react';
import {Link as RouterLink} from 'react-router-dom';
// material
import {
    Button,
    Card,
    Container,
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

// ----------------------------------------------------------------------

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
    const [filterBy, setFilterBy] = useState<GarbageContainerType | null>(null);
    const [rowCount, setRowCount] = useState(0);
    const [rows, setRows] = useState<Array<IGarbageContainer>>([]);

    const loadData = async () => {
        try {
            setLoading(true);
            /*
            const {data} = await getAssets({
                page,
                pageSize,
                sortBy: sortBy ?? '',
                sortOrder: sortOrder ?? '',
                term: delayedSearch,
                assetType: filterBy ?? undefined
            });*/
            const data: IGarbageContainer[] = [
                {
                    id: "string",
                    label: "string",
                    type: GarbageContainerType.Metal,
                    maxWeight: 123,
                    ContainerLocationId: "string",
                },
                {
                    id: "string",
                    label: "string",
                    type: GarbageContainerType.Metal,
                    maxWeight: 5345123,
                    ContainerLocationId: "string",
                },
                {
                    id: "str123ing",
                    label: "strin312g",
                    type: GarbageContainerType.Metal,
                    maxWeight: 123423,
                }
            ]

            setRows(data);
            setRowCount(data.length);
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

    const handleEdit = (id: number) => {
//         navigate(`/dashboard/assets/${id}`);
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
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Garbage Containers
                    </Typography>
                    <Button variant="contained" component={RouterLink} to="#"
                            startIcon={<Iconify icon="eva:plus-fill"/>}>
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
                                        onTagSelected: (tag: GarbageContainerType | null) => setFilterBy((tag)),
                                    }
                                }}
                                initialState={{
                                    columns: {
                                        columnVisibilityModel: {
                                        }
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
