import React, { Component } from 'react';
import 'react-dom';
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';
import PropTypes from 'prop-types';
import { Chocolate, Planet, File, Ghost, IceCream, Backpack, Cat } from 'react-kawaii';
import './CustomChatbot.css';
 
class KawaiiRating extends Component {
    constructor(props) {
        super(props);
        this.triggerNext = this.triggerNext.bind(this);
    }
    triggerNext() {
        this.setState({ trigger: true }, () => {
            this.props.triggerNextStep();
        });
    }
    render() {
        return (<div className="bgDiv">
            <button className="kawaii-bot-emojis" onClick={() => this.triggerNext()}><File size={100} mood="ko" color="#FFFA8C" /></button>
            <button className="kawaii-bot-emojis" onClick={() => this.triggerNext()}><Planet size={100} mood="sad" color="#83D1FB" eyes="blink" /></button>
            <button className="kawaii-bot-emojis" onClick={() => this.triggerNext()}><Cat size={100} mood="happy" color="#596881" /></button>
            <button className="kawaii-bot-emojis" onClick={() => this.triggerNext()}><Chocolate size={100} mood="blissful" color="#fc105c" /></button>
            <button className="kawaii-bot-emojis" onClick={() => this.triggerNext()}><Backpack size={100} mood="excited" color="#CD853F" /></button>
            <button className="kawaii-bot-emojis" onClick={() => this.triggerNext()}><Ghost size={100} mood="shocked" color="#E0E4E8" /></button>
            <button className="kawaii-bot-emojis" onClick={() => this.triggerNext()}><IceCream size={100} mood="lovestruck" color="#FDA7DC" /></button>
        </div>
        );
    }
}
 
KawaiiRating.propTypes = {
    steps: PropTypes.object,
    triggerNextStep: PropTypes.func,
};
KawaiiRating.defaultProps = {
    steps: undefined,
    triggerNextStep: undefined,
};

function CustomChatbot(props) {
    const theme = {
        background: '#f6f6f6',
        fontFamily: 'Arial, Helvetica, sans-serif',
        headerBgColor: ' #9DDF7A',
        headerFontColor: '#f6f6f6',
        headerFontSize: '15px',
        botBubbleColor: ' #9DDF7A',
        botFontColor: '#f6f6f6',
        userBubbleColor: '#4a4a4a',
        userFontColor: '#f6f6f6',
    };
    const config = {
        width: "480px",
        height: "550px",
        floating: true,
        color: "black"
    };
    const steps = [
        {
            id: "Hello",
            message: "Hello, welcome to SpaceX Launch Programs portal! Is this a good time to chat?",
            trigger: "UserChatRequest"
        },
        {
            id: "UserChatRequest",
            options: [
                { value: 1, label: 'Sure, let\'s chat', trigger: 'Survey' },
                { value: 2, label: 'No, not now', trigger: 'ThankYou' }
            ]
        },
        {
            id: "Survey",
            message: "Perfect! Please select the reaction which best matches your experience with SpaceX Launch Programs portal:",
            trigger: "KawaiiRating"
        },
        {
            id: 'KawaiiRating',
            component: <KawaiiRating />,
            waitAction: true,
            trigger: 'Feedback',
        },
        {
            id: "Feedback",
            message: "Would you like to explain your reaction and share some feedback?",           
            trigger: "FeedbackOptions"
        },
        {
            id: "FeedbackOptions",
            options: [
                { value: 1, label: 'Sure, I\'ll do it', trigger: 'OptionYes' },
                { value: 2, label: 'No, not now', trigger: 'ThankYou' }
            ]
        },
        {
            id: "OptionYes",
            message: "Please go ahead and type your response.",
            trigger: "UserEnterResponse"
        },
        {
            id: "UserEnterResponse",
            user: true,
            trigger: "ThankYou"
        },
        {
            id: "ThankYou",
            message: "Thank you for your time. Have a great day!",
            end: true
        },
    ];
    return <ThemeProvider theme={theme}><ChatBot speechSynthesis={{ enable: true, lang: 'en', voice: null }} recognitionEnable={true} headerTitle="Chat with SpaceX!" steps={steps} {...config} /></ThemeProvider>;
}

export default CustomChatbot;