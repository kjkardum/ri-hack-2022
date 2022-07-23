import { ReactNode, useEffect } from 'react';
// hooks
import useAuth from '../hooks/useAuth';
import {useNavigate} from "react-router-dom";
// routes

// ----------------------------------------------------------------------

type Props = {
    children: ReactNode;
};

export default function GuestGuard({ children }: Props) {
    const navigate = useNavigate();

    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    return <>{children}</>;
}
