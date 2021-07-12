import React from 'react'
import { useState, useEffect } from 'react';
import NetworkDialog from './NetworkDialog';

export default function NetworkConnection() {

    var [networkInfo, setnetworkInfo] = useState(navigator.connection);
    var [effectiveStrength, seteffectiveStrength] = useState('UNUSABLE');
    var [userDataMode, setuserDataMode] = useState('Disabled');
    useEffect(() => {
        var timer = setInterval(()=>setnetworkInfo(navigator.connection), 30000 );
        var strength = networkInfo.effectiveType;
        var datamode = networkInfo.saveData;
        if(datamode === false){
            setuserDataMode('Disabled');
        }
        else{
            setuserDataMode('Enabled');
        }
        if(strength === "4g"){
            seteffectiveStrength("EXCELLENT");
        }
        else if(strength === "3g"){
            seteffectiveStrength('OKAY');
        }
        else if(strength === "2g"){
            seteffectiveStrength('WEAK');
        }
        else if(strength === "slow-2g"){
            seteffectiveStrength('UNUSABLE');
        }
        return function cleanup() {
            clearInterval(timer);
        }
        
    });
    return (
        <React.Fragment>
            <NetworkDialog downlink = {networkInfo.downlink} signalStrength = {effectiveStrength} dataMode = {userDataMode}/>
        </React.Fragment>
    )
}
