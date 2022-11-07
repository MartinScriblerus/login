// import { Unity, UnityEvent } from "react-unity-webgl";
import { Router } from "next/router";
import React, { useEffect, useState, useRef } from "react";
import styles from '../styles/Home.module.css';
// var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
// import LoadingBar from "./loadingBar";
import { useRouter } from 'next/router'

export default function ARView(){
    const [inAr,setInAr] = useState(false); 
    
    const router = useRouter();

    function enterAR(){
        if(!inAr){
            setInAr(true);
            router.push('/ar')
        } else {
            setInAr(false);
        }
    }

    return (

    
            <span 
                style={{
                    position:"absolute", 
                    height:"6rem", 
                    width:"100%", 
                    bottom:"0rem", 
                    background:"transparent", 
                    fontSize:"3rem",
                    flexDirection:"row",
                    justifyContent: "center",
                    width:"60%",
                    marginLeft:"20%",
                    textAlign: "center",
                    pointerEvents:"all"
                }}
            >
                <button 
                    style={{
                        minHeight: "44px",
                        minWidth: "160px",
                        border: "solid 1px rgb(12, 95, 80)",
                        /* border: solid 1px transparent; */
                        backgroundColor: "transparent",
                        borderRadius: "32px",
                        margin: "2%",
                        color: "rgba(255,255,255,0.9)",
                        fontWeight: "100",
                        fontSize: "20px",
                        cursor: "pointer",
                        marginTop: "16px",
                    }}
                onClick={enterAR}
            >
                Enter AR
            </button>
        </span>

    )
} 