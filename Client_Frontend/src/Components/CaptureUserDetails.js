import React from 'react'
import PropTypes from 'prop-types';

import {Button} from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useState } from 'react';
export default function CaptureUserDetails(props) {

    const [userDetails, setUserDetails] = useState({name : 'Participant'});
    const [captureToggle, setCaptureToggle] = useState(true);
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
    const handleNameText = e => {
        console.log(`value : ${e.target.value}`);
        setUserDetails({name : e.target.value});
    }

    const handleSubmitButton = (event) => {
        console.log(userDetails);
        if(userDetails.name.length <= 0){
            alert('Please enter your name to proceed.');
            return;
        }
        if (userDetails.name.length > 0) {
            props.transportDetails(userDetails);
            setCaptureToggle(false);
        }
    }
    return (
        <React.Fragment>
            <Dialog className = "user-detail-dialog" open={captureToggle} onClose={() => setCaptureToggle(false)} disableBackdropClick = {true} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Enter Name</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    Enter your name that for the meeting. This will be displayed to all the participants in the room.
                </DialogContentText>
                    <TextField
                        required
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Name"
                        onChange = {handleNameText}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSubmitButton} color="primary">
                        Join Call
                    </Button>
                </DialogActions>
            </Dialog>

        </React.Fragment>
    )
}
