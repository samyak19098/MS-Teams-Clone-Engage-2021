import React, { useState , useEffect, useRef} from 'react';
import MicIcon from '@material-ui/icons/Mic';
import MicOffRoundedIcon from '@material-ui/icons/MicOffRounded';
import VideocamRoundedIcon from '@material-ui/icons/VideocamRounded';
import CallIcon from '@material-ui/icons/CallEnd';
import VideocamOffRoundedIcon from '@material-ui/icons/VideocamOffRounded';
import ScreenShareOutlinedIcon from '@material-ui/icons/ScreenShareOutlined';
import StopScreenShareOutlinedIcon from '@material-ui/icons/StopScreenShareOutlined';
import ChatIcon from '@material-ui/icons/Chat';
import GroupOutlinedIcon from '@material-ui/icons/GroupOutlined';
import DateTime from "./DateTime.js";
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import DetailsDialog from './DetailsDialog';
import { width } from '@material-ui/system';
import NetworkConnection from './NetworkConnection';
import { createSocketConnectionInstance } from '../ConnectionComponents/socketConnection';
import InviteDialog from './InviteDialog';
import ChatDrawer from './ChatDrawer';
import CaptureUserDetails from './CaptureUserDetails';
import { ToastContainer } from 'react-toastify';
import HandRaised from '@material-ui/icons/PanTool';
import 'react-toastify/dist/ReactToastify.css';

const useStyles = makeStyles((theme) => ({
    avatar: {
      backgroundColor: 'white',
      border: '2px solid #4425A7',
      color: '#9B84EF',
      height : '55px',
      width : '55px',
    },
}));
const disabled_useStyles = makeStyles((theme) => ({
    avatar: {
        backgroundColor : 'red',
        border : '2px solid #EA4335',
        color : '#FFFFFF',
        height : '55px',
        width : '55px',
    }
}));
const enabled_useStyles = makeStyles((theme) => ({
    avatar: {
        backgroundColor : '#9B84EF',
        border : '2px solid #9B84EF',
        color : '#FFFFFF',
        height : '55px',
        width : '55px',
    }
}));
export default function CallRoom(props) {

    const [micStatus, setmicStatus] = useState(true);
    const [videoStatus, setvideoStatus] = useState(true);
    const [screenShareStatus, setscreenShareStatus] = useState(false);
    const [handRaiseStatus, sethandRaiseStatus] = useState(false);
    const [streaming, setStreaming] = useState(false);
    const [temp, setTemp] = useState('');   
    const [userData, setUserData] = useState(null);
    const [chatDisplay, setchatDisplay] = useState(false);
    const [participantsDisplay, setparticipantsDisplay] = useState(false);
    const [userMessages, setuserMessages] = useState([]);
    const [currentParticiapnts, setcurrentParticipants] = useState([]);
    const myStream = useRef();
    let socketRef = useRef(null);
    const roomID = window.location.pathname.split('/')[2];


    useEffect(() =>{
        startconn();
    }, [temp]);

    const startconn = () => {
        socketRef.current = createSocketConnectionInstance({updateInstance: updateFromInstance});
    }
    
    const updateFromInstance = (key, value) => {
        if (key === 'streaming') setStreaming(value);
        if (key === 'messaging') setuserMessages([...value]);
    }

    const handleDisconnect = () => {
        if(socketRef.current){
            socketRef.current.destroyConnection();
            props.history.push('/');
        }
    }
    const handleUserData = (data) => {
        setUserData(data);
    }
    const handleChatDisplay = (value) => {
        setchatDisplay(value);
    }


    const toggleMute = () => {
        myStream.current = socketRef.current.participantStream;
        if(micStatus === true){
            // console.log(userStream.getAudioTracks());
            myStream.current.getAudioTracks()[0].enabled = false;
            setmicStatus(false);
        }
        else{
            myStream.current.getAudioTracks()[0].enabled = true;
            setmicStatus(true);
        }
    }

    const toggleVideo = () => {
        myStream.current = socketRef.current.participantStream;
        console.log(myStream);
        if(videoStatus == true){
            myStream.current.getVideoTracks()[0].enabled = false;
            setvideoStatus(false);
        }
        else{
            myStream.current.getVideoTracks()[0].enabled = true;
            setvideoStatus(true);
        }
    }

    const toggleScreenShare  = () => {

        if(screenShareStatus === true){
            socketRef.current.stopScreenShare();
            setscreenShareStatus(false);
        }   
        else{
            socketRef.current.initiateScreenShare();
            setscreenShareStatus(true);
        }
    }
    const toggleHandRaise = () => {
        if(handRaiseStatus === true){
            socketRef.current.lowerHand(userData.name);
            sethandRaiseStatus(false);
        }
        else{
            socketRef.current.raiseHand(userData.name);
            sethandRaiseStatus(true);
        }
    }

    const classes = useStyles();
    const disabled_classes = disabled_useStyles();
    const enabled_classes = enabled_useStyles();
    return (
        <React.Fragment>
            <div id = "room-container" className = "room-video-container"> </div>

                <div className = "footer-wrapper">
                    <div className = "left-flex-comp">
                        <div className = "footer-datetime"><DateTime/></div>
                        <div className = "meeting-details">
                            <DetailsDialog roomID = {roomID}/>
                        </div>
                        <div className = "invite-people">
                            <InviteDialog name = {userData ? userData.name : 'Participant'} roomID = {roomID}/>
                        </div>
                    </div>
                    <div className = "middle-flex-comp">
                        <div className = "mic-btn" onClick={toggleMute} title={micStatus ? 'Disable Microphone' : 'Enable Microphone'}>
                            {micStatus ? <Avatar className = {classes.avatar}><MicIcon/></Avatar> : <Avatar className = {disabled_classes.avatar}><MicOffRoundedIcon/></Avatar>}
                        </div>
                        <div className = "video-btn" onClick={toggleVideo} title={videoStatus ? 'Disable Camera' : 'Enable Camera'}>
                            {videoStatus ? <Avatar className = {classes.avatar}><VideocamRoundedIcon/></Avatar>: <Avatar className = {disabled_classes.avatar}><VideocamOffRoundedIcon/></Avatar>}
                        </div>
                        <div className="end-call-btn" onClick={handleDisconnect}title="End Call">
                            <Avatar className = {disabled_classes.avatar}><CallIcon/></Avatar>
                        </div>
                        <div className = "screen-share-btn" onClick = {toggleScreenShare} title = {screenShareStatus ? 'Stop Screen Share' : 'Share Screen'}>
                            {screenShareStatus ? <Avatar className = {enabled_classes.avatar}><ScreenShareOutlinedIcon/></Avatar> : <Avatar className = {classes.avatar}><ScreenShareOutlinedIcon/></Avatar>}
                        </div>
                        <div className = "hand-raise-btn" onClick = {toggleHandRaise} title = {handRaiseStatus ? 'Lower Hand' : 'Raise Hand'}>
                            {handRaiseStatus ? <Avatar className = {enabled_classes.avatar}><HandRaised/></Avatar> : <Avatar className = {classes.avatar}><HandRaised/></Avatar>}
                        </div>
                    </div>
                    <div className = "right-flex-comp">
                            <div className="chat-btn" onClick = {() => handleChatDisplay(!chatDisplay)}title="Chat">
                                <Avatar className = {classes.avatar}><ChatIcon/></Avatar>
                            </div>
                            <div className = "check-connection-btn" title = "Check Network Connection">
                                <NetworkConnection/>
                            </div>
                    </div>  
                </div>
                <CaptureUserDetails transportDetails = {handleUserData}></CaptureUserDetails>
                <ChatDrawer
                    chatToggle = {chatDisplay}
                    closeDrawer = {() => handleChatDisplay(false)}
                    socket = {socketRef.current}
                    user_details = {userData}
                    messages = {userMessages}
                />
                <ToastContainer 
                    autoClose={2000}
                    closeOnClick
                    pauseOnHover
                />
        </React.Fragment>
    )
}
