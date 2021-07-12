import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import InfoIcon from '@material-ui/icons/Info';
import Avatar from '@material-ui/core/Avatar';
    import TextField from '@material-ui/core/TextField';
    import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
  },
}));

const useStyles_icon = makeStyles((theme) => ({
    avatar: {
      backgroundColor: 'white',
      border: '2px solid #FFFFFF',
      color: '#9B84EF',
      height : '55px',
      width : '55px',
    },
}));


export default function PopoverDetails(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const classes_icon = useStyles_icon();
  return (
    <div>
        <div className = "info-icon" onClick = {handleClick} title = "Meeting Info">
        <Avatar className = {classes_icon.avatar}><InfoIcon/></Avatar>
        </div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
           <TextField
          id="outlined-read-only-input"
          label="Read Only"
          defaultValue= {props.roomID}
          InputProps={{
            readOnly: true,
          }}
          variant="outlined"
        />
      </Popover>
    </div>
  );
}