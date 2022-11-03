// import { Unity, UnityEvent } from "react-unity-webgl";
import React, { useEffect, useState, useRef } from "react";
import styles from "../styles/Home.module.css";
// var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
// import LoadingBar from "./loadingBar";

export default function GlobalDataUI(){
    console.log("in GlobalDataUI");
    
    function enterGlobalDashboard(){
        console.log("in Global Dashboard");
    }
    
    return (
        <span style={{
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
        }}>
            <button 
                style={{
                    minHeight: "44px",
                    minWidth: "160px",
                    border: "solid 1px rgba(50,220,300,1)",
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
                onClick={enterGlobalDashboard}
            >Data Dashboard</button>
        </span>
    )
} 