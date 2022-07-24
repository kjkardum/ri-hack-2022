import {Link, Typography, Grid} from "@mui/material";
import Logo from "../components/Logo";
import {Link as RouterLink} from "react-router-dom";
import {styled} from "@mui/material/styles";

import Page from '../components/Page';
import NativeMap from "../components/NativeMap";
import {useState} from "react";


const RootStyle = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex',
    },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
    top: 0,
    zIndex: 9,
    lineHeight: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(3),
    justifyContent: 'space-between',
    [theme.breakpoints.up('md')]: {
        alignItems: 'flex-start',
        padding: theme.spacing(7, 5, 0, 7),
    },
}));


const UserMap = () => {
    const [points, setPoints] = useState();

    return (
        <Page title="Home">
            <RootStyle>
                <HeaderStyle>
                    <Logo sx={{opacity: 0}}/>

                    <Typography variant="body2" sx={{ mt: { md: -2 } }}>
                        Working for RiCycle? {''}
                        <Link variant="subtitle2" component={RouterLink} to="/login">
                            Login
                        </Link>
                    </Typography>

                </HeaderStyle>
            </RootStyle>

            <Typography textAlign={"center"} variant={"h2"} sx={{color: "#1c6e46", marginTop: "20px", marginBottom: "40px"}}>
                Container Maps
            </Typography>
            
            <Grid container
                  direction="row"
                  justifyContent="center"
                  alignItems="center">
                <Grid item lg={11} md={11} sm={11} xs={11}>
                    <NativeMap lines={[]} points={[]} onClickFunc={() => {}} width={"100%"} height={"70vh"} />
                </Grid>
            </Grid>
        </Page>

    )
}


export default UserMap