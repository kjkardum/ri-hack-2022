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
import { useEffect } from 'react';
import axios from 'axios';
import { config } from 'process';

// import chat_logo from 'icons/ricyclobot.svg';

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
                "prev_question_and_answers": [],
                "question": newMessage
            }
        }).then(res => {
            // console.log(res.data)
            addResponseMessage(res.data.response)
        })

        // let res = axios({
        //     method: 'get',
        //     url: "http://127.0.0.1:5002/chat?API_KEY=123",
        //     headers: {
        //         "Accept": "*/*",
        //         "Content-Type": "*/*"
        //     },
        //     data: {
        //         "prev_question_and_answers": [],
        //         "question": newMessage
        //     }
        // });

        // console.log({
        //     "prev_question_and_answers": [],
        //     "question": newMessage
        // })

        // res.then(data => {
        //     console.log(data.data);
        //     addResponseMessage(data.data.response);
        // })

        // addResponseMessage(newMessage);
    };

    return (
        <AuthProvider>
            <ThemeProvider>
                <ScrollToTop />
                <BaseOptionChartStyle />
                <Router />
                <Widget
                    // profileAvatar={chat_logo}
                    title="My new awesome title"
                    subtitle="And my cool subtitle"
                    handleNewUserMessage={handleNewUserMessage}
                />
            </ThemeProvider>
        </AuthProvider>
    );
}


export default App;