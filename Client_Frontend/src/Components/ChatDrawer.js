import React from 'react'
import { useState, useRef } from 'react';
import {Drawer, Input, Button} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import SendIcon from '@material-ui/icons/Send';
import { Avatar } from '@material-ui/core';
import { deepOrange, deepPurple } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import Picker from 'emoji-picker-react';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import '../style/chatBox.scss';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    purple: {
      color: theme.palette.getContrastText(deepPurple[500]),
      backgroundColor: deepPurple[500],
    },
}));

export default function ChatDrawer(props) {

    const [InputChatText, setInputChatText] = useState("");
    const [chosenEmoji, setChosenEmoji] = useState(null);
    const classes = useStyles();

    const handleChatText = e => {
        console.log(`value : ${e.target.value}`);
        setInputChatText(e.target.value);
    }
    const handleEmoji = (e, emojiObject) => {
        console.log(`emoji : ' + ${emojiObject.emoji}`);
        setChosenEmoji(emojiObject);
    }
    const handleSendMessage = e => {
        const len = InputChatText.length;
        if(len === 0){
            return;
        }
        else{
            const messageObject = {
                message : {
                    messageText : InputChatText,
                    time : (new Date()).toLocaleString(),
                },
                userData : {...props.user_details},
            }
            console.log('sending message : ' + messageObject.message.messageText);
            props.socket.broadcastMessageToRoom(messageObject);
            setInputChatText("");
        }
    }
    return (
        <React.Fragment>
            <Drawer 
                className = "chat-box"
                anchor = "right"
                open={props.chatToggle}
                onClose={props.closeDrawer}
            >
                <div className = "chat-box-header">
                    <div className = "close-chat-btn">
                        <IconButton onClick={props.closeDrawer}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <div className = "chat-header-text">
                        <Typography variant="h6" noWrap>
                            Meeting Chat
                        </Typography>
                    </div>
                </div>
                <div><br/> <br/></div>
                <div className = "chat-box-body">
                    {
                        props.messages.map((chatDetails) => {
                            return (
                                <div className="chat-message-container">
                                    <div className = "user-message-wrapper">
                                        <div className="user-message-title-wrapper">
                                            <Avatar className={classes.purple}>{chatDetails.userData?.name.charAt(0)}</Avatar>
                                            <h5 className="user-message-name">{chatDetails.userData?.name}</h5>
                                            <span className="user-message-timestamp">{chatDetails.message.time}</span>
                                        </div>
                                        <p className="user-message-text">{chatDetails.message.messageText}</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className = "chat-box-footer">
                    <TextField 
                        className = "message-input"
                        id="filled-multiline-flexible"
                        label="Your Message"
                        multiline
                        maxRows={4}
                        value={InputChatText}
                        onChange={handleChatText}
                        variant="filled"
                    />
                    <IconButton className = "send-button" onClick={handleSendMessage}>
                        <SendIcon/>
                    </IconButton>
                </div>


            </Drawer>
        </React.Fragment>
    )
}
