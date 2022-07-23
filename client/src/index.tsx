// scroll bar
import 'simplebar/src/simplebar.css';

import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {HelmetProvider} from 'react-helmet-async';
import {SnackbarProvider} from 'notistack';
//
import App from './App';


// ----------------------------------------------------------------------

ReactDOM.render(
    // @ts-ignore
    <HelmetProvider>
        <BrowserRouter>
            <SnackbarProvider>
                <App/>
            </SnackbarProvider>
        </BrowserRouter>
    </HelmetProvider>,
    document.getElementById('root')
);