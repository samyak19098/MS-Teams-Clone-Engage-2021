import Peer from 'peerjs';
import io from "socket.io-client";
import { toast } from 'react-toastify';

let socketInstance = null;
let peers = {};
let incoming_screen_share_calls = {};
let outgoing_screen_share_calls = {};

class socketConnection{
    videoContainer = {};
    screenVideoContainerArr = {};
    messageArray = [];
    participantID;
    participantPeerID;
    peer = null;
    socket = null;
    userStreamFlag = 0;
    socketConnectionFlag = 0;
    peerConnectionFlag = 0;
    connectionDetails;
    participantStream = null;

    constructor(details){
        this.connectionDetails = details;
        this.socket = constructSocket();
        this.peer = constructPeer();
        this.socketConnectionFlag = this.socket ? 1 : 0;
        this.peerConnectionFlag = this.peer ? 1 : 0;
        this.startSocket();
        this.startPeer();
    }


    startSocket = () => { 
        this.socket.on('emit-participant-id', (ID) => {
            console.log('socket connected with ID = ' + ID);
            this.participantID = ID;
        });
        this.socket.on('new-message-received', (broadcast_data) => {
            console.log('new message received : ' + broadcast_data.messageObject.message.messageText);
            this.messageArray.push(broadcast_data.messageObject);
            this.connectionDetails.updateInstance('messaging', this.messageArray);
            toast.info(`${broadcast_data.messageObject.message.messageText} from ${broadcast_data.messageObject.userData.name}`);
        });
        this.socket.on('user-raised-hand', (userData) => {
            toast.info(`✋ ${userData.userName} raised their hand ! `)
        });
        this.socket.on('user-lowered-hand', (userData) => {
            toast.info(`✋ ${userData.userName} lowered their hand ! `)
        });
        this.socket.on('participant-disconnected', (ID) => {
            console.log('disconnecting you with peer := ' + ID);
            peers[ID] && peers[ID].close();
            this.removeVideo(ID);
            outgoing_screen_share_calls[ID] && outgoing_screen_share_calls[ID].close();
            incoming_screen_share_calls[ID] && incoming_screen_share_calls[ID].close();
            this.removeScreenShareVideo(ID);
        });
    };
    startPeer = () => {
        this.peer.on('open', (peer_id) => {
            this.participantPeerID = peer_id;
            const {participantDetails} = this.connectionDetails;
            const arr = window.location.pathname.split("/");
            const call_room_id = window.location.pathname.split("/")[2];
            console.log('room id = ' + call_room_id);
            this.joinCallRoom(call_room_id, peer_id, participantDetails);
            this.initiateStreaming();
        });
        this.peer.on('error', (err) => {
            console.log('peer connection error', err);
        });
    }

    joinCallRoom = (room_id, peer_id, details) => {
        console.log('joining call room now !');
        const data_to_send = {room_ID : room_id, new_participant_id : peer_id, ...details};
        console.log('USER : ' + data_to_send.new_participant_id + ' :: ' + 'joining room : ' + data_to_send.room_ID);
        console.log('details : ' + details);
        this.socket.emit('join-call-room', data_to_send);
    }

    initiateStreaming = () => {
        const GUM = (navigator.mediaDevices.getUserMedia
                    || navigator.mediaDevices.webkitGetUserMedia 
                    || navigator.mediaDevices.mozGetUserMedia 
                    || navigator.mediaDevices.msGetUserMedia);
        GUM({
            video : {noiseSuppression: true},
            audio : true,
        }).then(stream => {
            if(stream != null){
                this.userStreamFlag = 1;
                this.participantStream = stream;
                this.connectionDetails.updateInstance('streaming', true);
                this.createVideo({id : this.participantPeerID, stream : stream}, true);
                this.setPeersListeners(stream);
                this.newUserConnection(stream);
            }

        });
    }
    setPeersListeners = (userStream) => {
        this.peer.on('call', call => {
            const id = call.metadata.id;
            const callType = call.metadata.call_type;
            console.log('in setPeerListeners : Call Type = ' + callType + ' || id = ' + id );
            if(callType === 'AV'){
                peers[id] = call;
            }
            else if(callType === 'ScreenShare'){
                incoming_screen_share_calls[id] = call;
            }
            call.answer(userStream);
            call.on('stream', (remoteStream) => {
                if(callType === 'AV'){
                    this.createVideo({id : call.metadata.id, stream : remoteStream}, false);
                }
                else if(callType === 'ScreenShare'){
                    this.createScreenShare({id : call.metadata.id, stream : remoteStream});
                }
            });
            call.on('close', () => {
                console.log('closing peer ' + call.metadata.id);
                if(callType === 'AV'){
                    this.removeVideo(call.metadata.id);
                }
                else{
                    this.removeScreenShareVideo(call.metadata.id);
                }
            });
        });
        this.socket.on('remote-screen-share-stop', (ID) => {
            if(incoming_screen_share_calls[ID]){
                incoming_screen_share_calls[ID].close();
                this.removeScreenShareVideo(ID);
            }

        })
    }

    newUserConnection = (stream) => {
        this.socket.on('new-participant-joined', (new_participant_data) => {
            console.log('new user connected : ', new_participant_data);
            setTimeout(this.connect_new_participant, 2000, new_participant_data, stream);
        });
    }

    connect_new_participant = (participant_data, stream) => {
        console.log('in connect new part')
        console.log('stream = ' + stream);
        const userID = participant_data.new_participant_id;
        const call = this.peer.call(userID, stream, { metadata : {id : this.participantPeerID, call_type : 'AV'} });
        var screenShareCall = null;
        if(this.screenVideoContainerArr[this.participantPeerID]){
            screenShareCall = this.peer.call(userID, this.screenVideoContainerArr[this.participantPeerID].stream, {metadata : {id : this.participantPeerID, call_type : 'ScreenShare'}});
            outgoing_screen_share_calls[userID] = screenShareCall;
        }
        var peerStream;
        call.on('stream', (remoteStream) => {
            console.log('receiving new user stream ');
            peerStream = this.createVideo({id : userID, stream : remoteStream, participant_data}, false);
        });
        call.on('close', () => {
            console.log('closing new user', userID);
            this.removeVideo(userID);
        });
        
        peers[userID] = call;
        if(screenShareCall){
            screenShareCall.on('close' , () => {
                console.log('removing user screenshare');
                this.removeScreenShareVideo(userID);
            });
        }

    }

    initiateScreenShare = () => {
        const connectedPeers = Object.keys(peers);
        var arrayLength = connectedPeers.length;
        var myScreenStream;
        navigator.mediaDevices.getDisplayMedia({
            video : true
        }).then(screenStream => {
            myScreenStream = screenStream;
            this.createScreenShare({id : this.participantPeerID, stream : screenStream});
            for(var i = 0 ; i < arrayLength ; i++){
                const screen_share_call = this.peer.call(connectedPeers[i], screenStream, {metadata : {id : this.participantPeerID, call_type : 'ScreenShare'}});
                outgoing_screen_share_calls[connectedPeers[i]] = screen_share_call;
            }
            const track = screenStream.getVideoTracks();
            if(track && track[0]){
                track[0].onended = () => {
                    this.stopScreenShare();
                }
            }
        });

    }

    createScreenShare = (screenVideo_obj, stream) => {
        if(!this.screenVideoContainerArr[screenVideo_obj.id]){
            this.screenVideoContainerArr[screenVideo_obj.id] = {
                ...screenVideo_obj,
            };
            const room_container_ref  = document.getElementById('room-container');
            const screenVideo_container_ref = document.createElement('div');
            screenVideo_container_ref.id = 'screenVideo_cont' + screenVideo_obj.id;
            const screenVideo = document.createElement('video');
            screenVideo.srcObject = this.screenVideoContainerArr[screenVideo_obj.id].stream;
            screenVideo.id = 'screen' + screenVideo_obj.id; 
            screenVideo.autoplay = true;
            screenVideo.style = "-webkit-transform: scaleX(1); transform: scaleX(1);";
            screenVideo_container_ref.append(screenVideo);
            room_container_ref.append(screenVideo_container_ref);
            return screenVideo;
        }
        else{
            if(document.getElementById('screen' + screenVideo_obj.id)){
                document.getElementById('screen' + screenVideo_obj.id).srcObject = screenVideo_obj.stream;
                return document.getElementById('screen' + screenVideo_obj.id);
            }
        }

    }
    stopScreenShare = () => {
        console.log('hello from stopScreenShare !')
        if(this.screenVideoContainerArr[this.participantPeerID]){
            const connectedPeers = Object.keys(peers);
            const len = connectedPeers.length;
            for(var i = 0 ; i < len; i++){
                if(outgoing_screen_share_calls[connectedPeers[i]]){
                    outgoing_screen_share_calls[connectedPeers[i]].close();
                }
            }
            this.removeScreenShareVideo(this.participantPeerID);
            this.socket.emit('stopping-screen-share', {id : this.participantPeerID, room_id : window.location.pathname.split('/')[2] });
        }
    }

    raiseHand = (name) => {
        this.socket.emit('raise-hand', ({userID : this.participantPeerID, userName : name}));
    }
    lowerHand = (name) => {
        this.socket.emit('lower-hand', ({userID : this.participantPeerID, userName : name}));
    }
    createVideo = (vid_obj, myVideoFlag) => {
        if (!this.videoContainer[vid_obj.id]) {
            this.videoContainer[vid_obj.id] = {
                ...vid_obj,
            };
            const room_container_ref = document.getElementById('room-container');
            const video_container_ref = document.createElement('div');
            video_container_ref.id = 'vid_cont'+vid_obj.id;
            const video = document.createElement('video');
            video.srcObject = this.videoContainer[vid_obj.id].stream;
            if(myVideoFlag === true){
                video.muted = true;
            }
            video.id = vid_obj.id;
            video.autoplay = true;
            video.controls = true;
            video_container_ref.appendChild(video)
            room_container_ref.append(video_container_ref);
            return video;
        }
        else{
            if(document.getElementById(vid_obj.id)){
                document.getElementById(vid_obj.id).srcObject = vid_obj.stream;
                return document.getElementById(vid_obj.id);
            }
        }
    }


    broadcastMessageToRoom = (messageObject) => {
        console.log('broadcasting message ' + messageObject.message.messageText)
        this.messageArray.push(messageObject);
        this.connectionDetails.updateInstance('messaging', this.messageArray);
        this.socket.emit('broadcast-message-to-room', messageObject);
    }

    removeVideo = (ID) => {
        delete this.videoContainer[ID];
        const video_element = document.getElementById(ID);
        const video_container = document.getElementById('vid_cont' + ID);
        if (video_element){
            video_element.remove();
            video_container.remove();
        }
    }

    removeScreenShareVideo = (ID) => {
        delete this.screenVideoContainerArr[ID];
        const screen_video = document.getElementById('screen' + ID);
        const screen_video_container = document.getElementById('screenVideo_cont' + ID);
        if(screen_video){
            screen_video.remove();
            screen_video_container.remove();
        }
    }
    destroyConnection = () => {
        if(this.videoContainer[this.participantPeerID]){
            const tracks = this.videoContainer[this.participantPeerID].stream.getTracks();
            tracks.forEach((track) => {
                track.stop();
            });
        }
        if(this.screenVideoContainerArr[this.participantPeerID]){
            const tracks = this.screenVideoContainerArr[this.participantPeerID].stream.getTracks();
            tracks.forEach((track) => {
                track.stop();
            });
        }
        if(socketInstance){
            socketInstance.socket.disconnect();
        }
        this.peer.destroy();
    }
}

const constructSocket = () => { 
    return io.connect('https://samyakbackendserver.herokuapp.com/');
}
const constructPeer = () => {
    return new Peer();
}

export function createSocketConnectionInstance(settings={}) {
    return socketInstance = new socketConnection(settings);
}