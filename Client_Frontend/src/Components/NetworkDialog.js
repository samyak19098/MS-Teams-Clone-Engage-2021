import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import NetworkCheckOutlinedIcon from '@material-ui/icons/NetworkCheckOutlined';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import WifiIndicator from 'react-wifi-indicator';
function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

const useStyles = makeStyles((theme) => ({
    avatar: {
    backgroundColor: 'white',
    border: '2px solid #4425A7',
    color: '#9B84EF',
    height : '55px',
    width : '55px',
    },
}));  

export default function DraggableDialog(props) {

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  

  const classes = useStyles();
  return (
    <React.Fragment>
      <div className = "connection-button" onClick={handleClickOpen} title="Check Network Connection">
        <Avatar className = {classes.avatar}><NetworkCheckOutlinedIcon/></Avatar>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        fullWidth = {true}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
        <Typography>Network Details </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bandwidth : {props.downlink} Mbps<br/><br/>
            Low Data Mode : {props.dataMode} <br/><br/>
            Wifi Level : <WifiIndicator strength={props.signalStrength} /><br/>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      </React.Fragment>  
    );
}
