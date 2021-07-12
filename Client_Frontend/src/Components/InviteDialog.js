import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import mailer from 'emailjs-com';
import{ init } from 'emailjs-com';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import { useState } from 'react';
import InputAdornment from '@material-ui/core/InputAdornment';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

init("user_bhA609wZHmvzFlzv4rnSM");


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const useStyles_icon = makeStyles((theme) => ({
    avatar: {
      backgroundColor: 'white',
      border: '2px solid #FFFFFF',
      color: '#9B84EF',
      height : '55px',
      width : '55px',
    },
}));
const useStyles = makeStyles((theme) => ({
    fab: {
      margin: theme.spacing(2),
    }
}));
export default function DetailsDialog(props) {

    // const [copyText, setCopyText] = useState('');  
    const [TextFieldValue, setTextFieldValue] = useState("");
    const handleChange = e => {
        console.log(`value : ${e.target.value}`);
        setTextFieldValue(e.target.value);
    }

    const copy_text_meeting_id = props.roomID; 
    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleSend = () => {
        var templateParams = {
            from_name: props.name,
            room_code : props.roomID,
            click_link : 'http://localhost:3000/callroom/' + props.roomID,
            to_email : TextFieldValue,
        };
        mailer.send('service_s5fe94q', 'template_9vlagxd', templateParams)
            .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            alert("Email Sent successfully to the person !");
            }, function(error) {
            alert("Email failed, please try again !")
            console.log('FAILED...', error);
        });
    }

    const classes_icon = useStyles_icon();
    const classes = useStyles();
    return (
        <div>
        <div className = "info-icon" onClick = {handleClick} title = "Invite People">
            <Avatar className = {classes_icon.avatar}><PersonAddIcon/></Avatar>
        </div>
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            fullWidth = {true}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle id="alert-dialog-slide-title">{"Invite People"}</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
                <TextField id="outlined-helperText"  size = "small" value = {TextFieldValue} label="E-Mail Address" helperText="Enter email address" variant="outlined"
                    fullWidth = {true}
                    InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <MailOutlineIcon/>
                        </InputAdornment>
                    ),}}
                    onChange ={handleChange}
                />
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleSend} color="primary">
                Send
            </Button>
            <Button onClick={handleClose} color="primary">
                Close
            </Button>
            </DialogActions>
        </Dialog>
        </div>
    );
}
