import React from 'react'
import { useState, useEffect } from 'react';
export default function DateTime() {


    var [datetime, setDatetime] = useState(new Date());

    useEffect(() => {
        var timer = setInterval(()=>setDatetime(new Date()), 1000 )
        return function cleanup() {
            clearInterval(timer)
        }
    
    });
    return (
        <React.Fragment>
            <p style={{color:'#4627AB'}}>{datetime.toLocaleString()}</p>
        </React.Fragment>
    )
}
