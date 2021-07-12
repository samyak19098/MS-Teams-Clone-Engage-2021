import React from 'react'
import { AppBar, Toolbar, Typography, Box} from '@material-ui/core';
import transLogo from '../images/new_logo.png'
import DateTime from "./DateTime.js";
import Video from '../videos/logo_reveal.mp4';

export default function Header(props) {
    return (
        <React.Fragment>
            <div className = "header-container">
                <div>
                    <AppBar className = "header-nav-bar" style={{ background: 'transparent', boxShadow: 'none'}}>
                        <Toolbar className = "header-tool-bar">
                            <div className = "header-logo-container">
                                <img className = "logo-img" src = {transLogo} alt = "MS Teams Clone"></img>
                            </div>
                            <div className = 'datetime-container'>
                                <Typography variant = "h6" > <DateTime></DateTime> </Typography>
                            </div>
                        </Toolbar>
                    </AppBar>
                </div>
                <div>{props.children}</div>
            </div>
        </React.Fragment>
    )
}
