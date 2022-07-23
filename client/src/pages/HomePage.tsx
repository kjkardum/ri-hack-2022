import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Card, Link, Container, Typography } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Page from '../components/Page';
import Logo from '../components/Logo';
// sections
import { LoginForm } from '../sections/auth/login';
import AuthSocial from '../sections/auth/AuthSocial';

// ----------------------------------------------------------------------

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
    position: 'absolute',
    padding: theme.spacing(3),
    justifyContent: 'space-between',
    [theme.breakpoints.up('md')]: {
        alignItems: 'flex-start',
        padding: theme.spacing(7, 5, 0, 7),
    },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
    width: '100%',
    maxWidth: 464,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: 480,
    margin: 'auto',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function HomePage() {
    const smUp = useResponsive('up', 'sm');

    const mdUp = useResponsive('up', 'md');

    return (
        <Page title="Home">
            <RootStyle>
                <HeaderStyle>
                    <Logo />

                    {smUp && (
                        <Typography variant="body2" sx={{ mt: { md: -2 } }}>
                            Work for Čistoća? {''}
                            <Link variant="subtitle2" component={RouterLink} to="/register">
                                Login
                            </Link>
                        </Typography>
                    )}
                </HeaderStyle>

                <Container>
                    <ContentStyle>

                        Home

                    </ContentStyle>
                </Container>
            </RootStyle>
        </Page>
    );
}
