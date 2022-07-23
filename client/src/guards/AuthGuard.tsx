import {useState, ReactNode, useEffect} from 'react';
// hooks
import useAuth from '../hooks/useAuth';
import Login from '../pages/Login';
import {useNavigate} from "react-router-dom";
import {Container} from "@mui/material";
import {styled} from "@mui/material/styles";
// components

// ----------------------------------------------------------------------

type Props = {
    children: ReactNode;
};


const LoadingContentStyle = styled('div')(({ theme }) => ({
    maxWidth: 480,
    margin: 'auto',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(12, 0),
}));

export default function AuthGuard({children}: Props) {
    const {isAuthenticated, isInitialized} = useAuth();

    if (!isInitialized) {
        return (
            <Container>
                <LoadingContentStyle>
                    Loading...
                </LoadingContentStyle>
            </Container>
        );
    }

    if (!isAuthenticated) {
        return <Login/>;
    }

    return <>{children}</>;
}
