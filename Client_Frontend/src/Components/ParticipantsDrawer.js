import React from 'react'
import { useState, useRef } from 'react';
import {Drawer, Input, Button} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import '../style/participantDrawer.scss';
import { Avatar } from '@material-ui/core';
import { deepOrange, deepPurple } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';



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

export default function ParticipantsDrawer(props) {
    const classes = useStyles();
    return (
        <React.Fragment>
            <Drawer 
                className = "participants-box"
                anchor = "right"
                open={props.participantsToggle}
                onClose={props.closeDrawer}
            >
                <div className = "participants-box-header">
                    <div className = "close-participants-btn">
                        <IconButton onClick={props.closeDrawer}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <div className = "participants-header-text">
                        <Typography variant="h6" noWrap>
                            Participants
                        </Typography>
                    </div>
                </div>
                <div><br/> <br/></div>
                <div className = "participants-box-body">
                    {
                        props.current_participants.map((ParticipantDetails) => {
                            return (
                                <div className = "participant-detail-box">
                                        <div className = "participant-logo">
                                            <Avatar className={classes.purple}>{ParticipantDetails.name}</Avatar>
                                        </div>
                                        <div className = "participant-name">
                                            <Typography variant = "h6">{ParticipantDetails.name}</Typography>
                                        </div>
                                </div>
                            )
                        })
                    }
                </div>
            </Drawer>
        </React.Fragment>
    )
}
