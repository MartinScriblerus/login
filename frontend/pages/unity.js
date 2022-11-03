import dynamic from 'next/dynamic';
dynamic(import("react-unity-webgl").then(mod => mod), { ssr: false }) 
import Head from 'next/head'
import { Unity, UnityEvent } from "react-unity-webgl";
import React, { useEffect, useState, useRef } from "react";
var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
import LoadingBar from "../components/loadingBar";
import ARDataView from '../components/ARDataView';
import ARView from '../components/ARView';
import CampusData from '../components/CampusDataView';
import CampusView from '../components/CampusDefaultView';
import CardboardVRView from '../components/CardboardVRView';
import HololensView from '../components/HololensUI';
import GlobalDataUI from '../components/GlobalDataView';
import GlobalViewUI from '../components/VRView';
import { fetchData } from 'next-auth/client/_utils';
import {record} from "../components/vmsg";


export default function UnityWebGLBuild(props){


    console.log("PROPS: ", props);

    const [unity,setUnity] = useState([]);
    //const [cameraHeightInput,setCameraHeightInput]=useState(55);

    const [isRecording,setIsRecording] = useState(false);
    const [audioTrack,setAudioTrack] = useState({});
    const [deviceStateNum, setDeviceStateNum] = useState(3);
    const valueRef = useRef('');
    valueRef.current = 'Campus';
    const isRecordingRef = useRef();
    const soundClips = useRef();
   
    
    async function handleClickSpawnEnemies() {
        
        let geoJSON = await fetch("https://raw.githubusercontent.com/blackmad/neighborhoods/master/austin.geojson")
        .then((response) => response.json())
        .then((data) => {
            props.sendMessage("InteropController","GetMap", JSON.stringify(data));
        });   
    }

    useEffect(()=>{
    
        setUnity(<Unity style={{width:props.width, height:props.height, minHeight:"100vh"}} key={1} id="unityWindow" unityProvider={props.unityProvider} />)
       
    },[props.unityProvider, props.width, props.height])


    function handleKeyDown(event) {
        console.log(event.keyCode);
        switch( event.keyCode ) {
            case 87:
                props.sendMessage("CameraParentObject","RotateUp");
                break;
            case 65:
                props.sendMessage("CameraParentObject","RotateLeft");
                break;
            case 83:
                props.sendMessage("CameraParentObject","RotateDown");
                break;
            case 68:
                props.sendMessage("CameraParentObject","RotateRight");
                break;
            case 81:
                props.sendMessage("CameraParentObject","ZoomOut");
                break;
            case 69:
                props.sendMessage("CameraParentObject","ZoomIn");
                break;
            // case 86:
            //     props.sendMessage("MainCamera","CameraStyle");
          default: 
              break;
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);

        return function cleanup() {
          document.removeEventListener('keydown', handleKeyDown);
        }
    });

    useEffect(()=>{
        props.sendMessage("MainCamera", "UserLongitude", props.longitude);
        props.sendMessage("MainCamera", "UserLatitude", props.latitude);
    },[props, props.longitude, props.latitude])
    
    function handleDeviceSelect(num){
        
        document.getElementById('deviceDropdown').value = num;
        console.log("WTF IS NUM??? ", num);
        updateView(num);       
        
        switch(num){
            case 'AR Data':
                console.log("...in AR Data");
                setDeviceStateNum(0);
                props.sendMessage("MainCamera","CameraProjection",0);
                break;
            case 'AR':
                console.log("...in AR");
                setDeviceStateNum(1);
                props.sendMessage("MainCamera","CameraProjection",1);
                break;
            case 'Campus':
                console.log("...in Campus (default)");
                setDeviceStateNum(3);
                props.sendMessage("MainCamera","CameraProjection",3);
                break;
            case 'Campus Data':
                setDeviceStateNum(2);
                console.log("...in Campus Data");
                props.sendMessage("MainCamera","CameraProjection",2);
                break;
            case 'VR':
                console.log("...in VR");
                setDeviceStateNum(7);
                props.sendMessage("MainCamera","CameraProjection",7);
                break;
            case 'Cardboard VR':
                console.log("...in Cardboard VR");
                setDeviceStateNum(5);
                props.sendMessage("MainCamera","CameraProjection",5);
                break;
            case 'Hololens':
                console.log("...in Global Hololens");
                setDeviceStateNum(4)
                props.sendMessage("MainCamera","CameraProjection",4);
                break;
            case 'Global Data':
                console.log("...in Global Data");
                setDeviceStateNum(6);
                props.sendMessage("MainCamera","CameraProjection",6);
                break;
        }        
    };

    function updateView(num){
        
        async function sendData(){
            if( num === 0){
                let geoJSON = await fetch("https://raw.githubusercontent.com/blackmad/neighborhoods/master/austin.geojson")
                .then((response) => response.json())
                .then((data) => {
                    props.sendMessage("InteropController","GetMapLocal", JSON.stringify(data));
                });  
            }
            if( num === 2){
                let geoJSON = await fetch("https://raw.githubusercontent.com/blackmad/neighborhoods/master/austin.geojson")
                .then((response) => response.json())
                .then((data) => {
                    props.sendMessage("InteropController","GetMapGlocal", JSON.stringify(data));
                });  
            }
            if(num === 4){
                let geoJSON = await fetch("https://raw.githubusercontent.com/blackmad/neighborhoods/master/austin.geojson")
                .then((response) => response.json())
                .then((data) => {
                    props.sendMessage("InteropController","GetMapLobal", JSON.stringify(data));
                });  
            }
            if(num === 6){
                let geoJSON = await fetch("https://raw.githubusercontent.com/blackmad/neighborhoods/master/austin.geojson")
                .then((response) => response.json())
                .then((data) => {
                    props.sendMessage("InteropController","GetMapGlobal", JSON.stringify(data));
                });  
            }
        }
        sendData();
    }

    function toggleRecording(){
        if(isRecording){
            setIsRecording(false);
            if(document.getElementsByTagName('audio').length > 1){

            }
        } else {
            setIsRecording(true);
            record({wasmURL: "/vmsg.wasm"}).then(blob => {
                console.log("Recorded MP3", blob);
                var url = URL.createObjectURL(blob);
                var preview = document.createElement('audio');
                preview.controls = true;
                preview.src = url;
                if(document.getElementById("newestRecordedAudio")){
                    document.getElementById("newestRecordedAudio").remove();
                }
                preview.id = "newestRecordedAudio";
                document.body.appendChild(preview);
                // Can be used like this:
                //
                // const form = new FormData();
                // form.append("file[]", blob, "record.mp3");
                // fetch("/upload.php", {
                //   credentials: "include",
                //   method: "POST",
                //   body: form,
                // }).then(resp => {
                // });
              });
        }
        // const aCtx = new AudioContext();
       
    }
        
    let gameLevel = ["Campus","Campus Data","AR", "AR Data", "Cardboard VR", "VR", "Hololens", "Global Data"];
    let listLevels = gameLevel.map((level, i) =>
        <option label={level} value={level} key={i}>{level}</option>
    );

 
    return (
        <>
        <Head>
            <title>Demo</title>
            <link rel="icon" href="/favicon.ico" />
            <link
            href="https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css"
            rel="stylesheet"
            />
        </Head>
            {
                props.loadingProgression >= 1
                ?
                <span>

                    <ul ref={soundClips} style={{position:"absolute",top:"4rem",left:"0rem",height:"3rem",width:"4rem"}}></ul>

                    <select 
                        id="deviceDropdown"
                        onChange={(e) => {
                            valueRef.current = e.target.value;
                            handleDeviceSelect(e.target.value)
                        }}
                        style={{
                            minWidth:"12rem",
                            display:"flex", 
                            id:"subusersSelect",
                            class:"select",
                            flexDirection:"row",
                            zIndex: 7,
                            width: "12rem",
                            position: "absolute",
                            right: "0rem",
                            margin: "2%",
                            height:"3rem",
                            top: "2rem",
                            textAlign:"center",
                            justifyContent: "center",
                            textAlign: "center",
                            borderRadius:"24px",
                            border: "solid 1px rgba(50,220,300,1)",
                            background:"transparent",
                            pointerEvents:"all"
                        }}
                    >
                        <option disabled>--Device Level--</option>
                        { listLevels }

                    </select>
                    <button id="masterRecordBtn" ref={isRecordingRef} style={{pointerEvents:"all",position:"absolute",top:"7rem",right:"1rem",height:"3rem",width:"12rem"}} onClick={toggleRecording}>
                        {
                        isRecording
                        ?
                            <span>Stop Recording</span>
                        :
                            <span>Record</span>
                        }
                    </button>
                </span>
                :
                    null
            }

            {
                props.loadingProgression < 1
                    ?
                        <LoadingBar style={{position:"absolute", pointerEvents:"none"}} loadingProgression={props.loadingProgression} />      
                    :
                        deviceStateNum === 0
                        ?
                        <ARDataView style={{pointerEvents:"none"}}/>
                        :
                        deviceStateNum === 1
                        ?
                        <ARView style={{pointerEvents:"none"}}/>
                        :
                        deviceStateNum === 2
                        ?
                        <CampusData style={{pointerEvents:"none"}} />
                        :
                        deviceStateNum === 3 
                        ?
                        <CampusView style={{pointerEvents:"none"}} unity={unity} />
                        :
                        deviceStateNum === 4
                        ?
                        <HololensView style={{pointerEvents:"none"}}/>
                        :            
                        deviceStateNum === 5
                        ?
                        <CardboardVRView style={{pointerEvents:"none"}}/>
                        :
                        deviceStateNum === 6
                        ?
                        <GlobalDataUI style={{pointerEvents:"none"}}/>
                        :
                        deviceStateNum === 7
                        ?
                        <GlobalViewUI style={{pointerEvents:"none"}}/>
                        :
                        null
            }
               
            {
                unity
            ?
                unity
            :
                null
            }
       
        </>
    )
}

