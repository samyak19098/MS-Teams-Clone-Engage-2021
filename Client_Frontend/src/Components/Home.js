import React from 'react';
import Slide1 from '../images/im1.jpg';
import Slide2 from '../images/im2.jpg';
import Slide3 from '../images/im3.jpg';
import Slide4 from '../images/im4.jpg';
import { Typography, Box , TextField} from '@material-ui/core';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useState} from 'react';
import LinkIcon from '@material-ui/icons/Link';
import InputAdornment from '@material-ui/core/InputAdornment';
import AddBoxIcon from '@material-ui/icons/AddBox';
import IconButton from '@material-ui/core/IconButton';
import { Carousel } from 'react-responsive-carousel';
import {v4 as UUID} from 'uuid';
import Particles from 'react-tsparticles';
import Video from '../videos/logo_reveal.mp4';
import Header from './Header';

const useStyles = makeStyles((theme) => ({
    button: {
      margin: theme.spacing(1),
    },
  }));

export default function Home(props) {


    const createRoom = () => {
        var unique_room_id = UUID();
        props.history.push(`/callroom/${unique_room_id}`)
    }

    const classes = useStyles();
    const [TextFieldValue, setTextFieldValue] = useState("");
    const handleChange = e => {
        console.log(`value : ${e.target.value}`);
        setTextFieldValue(e.target.value);
    }
    const join_through_link = (() =>{ 
        console.log('joining through ID' + TextFieldValue);
        if(TextFieldValue === ""){
          alert("Please enter a valid room ID");
          return;
        }
        const redirect_link = "/callroom/" + TextFieldValue;
        props.history.push(redirect_link);
    });
    const join_new_room = (()=>{
        createRoom();
    })
    const [isDarkMode, setIsDarkMode] = useState(() => false);

    return (
        <div>
          <Header>
      <Particles
        id="tsparticles"
        options={{
          background: {
            color: {
              value: "#FFFFFF",
            },
          },
          fpsLimit: 120,
          interactivity: {
            detectsOn: "canvas",
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "grab",
              },
              resize: true,
            },
            modes: {
              bubble: {
                distance: 400,
                duration: 2,
                opacity: 0.8,
                size: 40,
              },
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: "#4c50b9",
            },
            links: {
              color: "#2A1975",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            collisions: {
              enable: true,
            },
            move: {
              direction: "none",
              enable: true,
              outMode: "bounce",
              random: false,
              speed: 3,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                value_area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle",
            },
            size: {
              random: true,
              value: 5,
            },
          },
          detectRetina: true,
        }}
      />
            <div className = "left-content-container">
                <Box p = {0.5}><Typography variant = "h3">High Quality Video Calling Application</Typography></Box>
                <Box p = {1.0}><Typography variant = "h6">Developed as a part of Microsoft Engage Mentorship Program 2021</Typography></Box>
                <br/>   
                <div className = "joining-flex-container">
                    <div className = "join-button">
                        <Button variant="contained" color="primary" size="large" className={classes.button} startIcon={<VideoCallIcon />} onClick ={join_new_room}>Start New Call</Button>
                    </div>
                    <div className = "link-joining">
                        <div className = "join-link-text-box">
                            <TextField id="outlined-helperText"  size = "small" value = {TextFieldValue} label="Room ID" helperText="Enter Room ID to Join" variant="outlined"
                                InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LinkIcon/>
                                    </InputAdornment>
                                ),}}
                                onChange ={handleChange}
                            />
                        </div>
                        <div className = 'join-clickable-text'>
                        <IconButton color="primary" title="Join Room" component="span" onClick = {join_through_link}>
                            <AddBoxIcon />
                        </IconButton>
                        </div>
                    </div>
                </div>

            </div>  

            <div className = "right-container">
                <Carousel>
                <div>
                    <img src={Slide1}/>
                    <p className="legend">Connect with your teammates</p>
                </div>
                <div>
                    <img src = {Slide2} />
                    <p className="legend">Talk to your family</p>
                </div>
                <div>
                    <img src= {Slide3} />
                    <p className="legend">Chill with your friends</p>
                </div>
                <div>
                    <img src= {Slide4} />
                    <p className="legend">Take online appointments</p>
                </div>
                </Carousel>
            </div>   
            </Header>
            </div>
    )
}
