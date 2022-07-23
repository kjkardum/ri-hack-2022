// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/ScrollToTop';
import {BaseOptionChartStyle} from './components/chart/BaseOptionChart';
import Router from "./routes";
import {AuthProvider} from "./contexts/AuthContext";

// ----------------------------------------------------------------------


const App = () => {
    return (
        <AuthProvider>
            <ThemeProvider>
                <ScrollToTop/>
                <BaseOptionChartStyle/>
                <Router/>
            </ThemeProvider>
        </AuthProvider>
    );
}


export default App;