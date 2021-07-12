import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import InfoIcon from '@material-ui/icons/Info';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import copy from "copy-to-clipboard";  
import CopyIcon from '@material-ui/icons/FileCopy';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';

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
    const copy_text_meeting_id = props.roomID; 
    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const copyToClipboard = () => {
        copy(copy_text_meeting_id);
    }; 

    const classes_icon = useStyles_icon();
    const classes = useStyles();
    return (
        <div>
        <div className = "info-icon" onClick = {handleClick} title = "Meeting Info">
        <Avatar className = {classes_icon.avatar}><InfoIcon/></Avatar>
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
            <DialogTitle id="alert-dialog-slide-title">{"Meeting Details"}</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
                <TextField
                    id="outlined-read-only-input"
                    fullWidth = {true}
                    label="Meeting Code"
                    defaultValue= {props.roomID}
                    InputProps={{
                        readOnly: true,
                        endAdornment: <Tooltip title="Copy To Clipboard">
                                        <Fab color="primary" className={classes.fab}>
                                            <CopyIcon onClick = {copyToClipboard}/>
                                        </Fab>        
                                    </Tooltip>,
                    }}
                    variant="outlined"
                />
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} color="primary">
                Close
            </Button>
            </DialogActions>
        </Dialog>
        </div>
    );
}
