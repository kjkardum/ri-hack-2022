// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';
import Router from "./routes";
import { AuthProvider } from "./contexts/AuthContext";
import { addResponseMessage, Widget } from 'react-chat-widget';

import 'react-chat-widget/lib/styles.css';
import 'src/theme/overrides/chat_style.css'
// import { useEffect } from 'react';
import axios from 'axios';
// import { config } from 'process';


// ----------------------------------------------------------------------




const App = () => {
    const messages = []

    // useEffect(() => {
    //     addResponseMessage('Welcome to this **awesome** chat!');
    // }, []);

    const handleNewUserMessage = (newMessage) => {
        // console.log(`New message incoming! ${newMessage}`);


        axios.post("http://127.0.0.1:5002/chat?API_KEY=123", {
            params: {
                "prev_question_and_answers": messages,
                "question": newMessage
            }
        }).then(res => {
            // console.log(res.data)

            messages.push([
                newMessage,
                res.data.response
            ])

            addResponseMessage(res.data.response)
        })

    };

    return (
        <AuthProvider>
            <ThemeProvider>
                <ScrollToTop />
                <BaseOptionChartStyle />
                <Router />
                <Widget
                    spellCheck={false}

                    title="Bok, ja sam RiCycloBot"
                    subtitle="Možeš me pitati ako te zanima nešto?"
                    handleNewUserMessage={handleNewUserMessage}
                />
            </ThemeProvider>
        </AuthProvider>
    );
}


export default App;