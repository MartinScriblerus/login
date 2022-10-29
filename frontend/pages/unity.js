import dynamic from 'next/dynamic';
dynamic(import("react-unity-webgl").then(mod => mod), { ssr: false }) 
import Head from 'next/head'
import { Unity, UnityEvent } from "react-unity-webgl";
import React, { useEffect, useState, useRef } from "react";
var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
import LoadingBar from "../components/loadingBar";
import LocalDataUI from '../components/LocalDataUI';
import LocalViewUI from '../components/LocalViewUI';
import GlocalDataUI from '../components/GlocalDataUI';
import GlocalViewUI from '../components/GlocalViewUI';
import LobalDataUI from '../components/LobalDataUI';
import LobalViewUI from '../components/LobalViewUI';
import GlobalDataUI from '../components/GlobalDataUI';
import GlobalViewUI from '../components/GlobalViewUI';



export default function UnityWebGLBuild(props){


    console.log("PROPS: ", props);

    const [unity,setUnity] = useState([]);
    const [cameraHeightInput,setCameraHeightInput]=useState(225);
    const [cameraProjectionLevel,setCameraProjectionLevel]=useState(3);

    const [isRecording,setIsRecording] = useState(false);
    const [audioTrack,setAudioTrack] = useState({});
    
    const isRecordingRef = useRef();
    
    
    async function handleClickSpawnEnemies() {
        
        let heightInput = document.getElementById("cameraHeightInput");
        if(heightInput){
            setCameraHeightInput(heightInput.value);
        }
        console.log("update cam height to ",Math.round(cameraHeightInput));
        
        props.sendMessage("MainCamera", "CameraHeight",Math.round(cameraHeightInput));

        let geoJSON = await fetch("https://raw.githubusercontent.com/blackmad/neighborhoods/master/austin.geojson")
        .then((response) => response.json())
        .then((data) => {
            props.sendMessage("InteropController","GetMap", JSON.stringify(data));
        });   
    }

    useEffect(()=>{
    
        setUnity(<Unity style={{width:props.width, height:props.height, minHeight:"100vh"}} key={1} id="unityWindow" unityProvider={props.unityProvider} />)
       
    },[props.unityProvider, props.width, props.height])

    useEffect(()=>{
        props.sendMessage("MainCamera", "UserLongitude", props.longitude);
        props.sendMessage("MainCamera", "UserLatitude", props.latitude);
    },[props, props.longitude, props.latitude])
    
    function handleAddPress(){
        console.log("cam height input: ", cameraHeightInput);
        setCameraHeightInput(cameraHeightInput + 25);
        if(cameraProjectionLevel === 7){
            console.log("toggle disable up button here!");
            return;
        }
        setCameraProjectionLevel(cameraProjectionLevel + 1);
        props.sendMessage("MainCamera","CameraProjection",cameraProjectionLevel);
        props.sendMessage("MainCamera", "CameraHeight", cameraHeightInput);
    };

    function handleDeletePress(){
        console.log("cam height input in delete: ", cameraHeightInput);
        setCameraHeightInput(cameraHeightInput - 25);
        if(cameraProjectionLevel === 0){
            console.log("toggle disable down button here!");
            return;
        }
        setCameraProjectionLevel(cameraProjectionLevel - 1);
        props.sendMessage("MainCamera","CameraProjection",cameraProjectionLevel);
        props.sendMessage("MainCamera", "CameraHeight", cameraHeightInput);
    };

    function flattenArray(channelBuffer, recordingLength) {
        var result = new Float32Array(recordingLength);
        var offset = 0;
        for (var i = 0; i < channelBuffer.length; i++) {
            var buffer = channelBuffer[i];
            result.set(buffer, offset);
            offset += buffer.length;
        }
        return result;
    }

    function interleave(leftChannel, rightChannel) {
        var length = leftChannel.length + rightChannel.length;
        var result = new Float32Array(length);

        var inputIndex = 0;

        for (var index = 0; index < length;) {
            result[index++] = leftChannel[inputIndex];
            result[index++] = rightChannel[inputIndex];
            inputIndex++;
        }
        return result;
    }
    
  
    let recorder;
    if (typeof window !== 'undefined') {
        navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;
    }

    function toggleRecording(){
        if(isRecording){
            setIsRecording(false);

        } else {
            setIsRecording(true);
        }
        const aCtx = new AudioContext();
        console.log("in isRecording");

        if (typeof navigator !== 'undefined') {
            navigator.mediaDevices.getUserMedia({audio: true}
                
                
                ).then((stream) => {
                const mediaRecorder = new MediaRecorder(stream);
                console.log("STREAM: ", stream);
                console.log("?@?@?@? ", stream.getTracks()[0]);
                stream.getTracks()[0].enabled = false;

                if(isRecording && mediaRecorder.state === active){
                    mediaRecorder.stop();
                    console.log("recorder stopped");
                    isRecordingRef.current.innerText = "hey " + isRecording; 
                    
                } else if (isRecording && mediaRecorder.state === inactive){
                    console.log("media recorder should be inactive: ", mediaRecorder.state);
                } 
                else {
                    mediaRecorder.start();
                    console.log("recorder started");
                    isRecordingRef.current.innerText = "look " + isRecording;
                }

                mediaRecorder.onstop = (e) => {
                    console.log("data available after MediaRecorder.stop() called.");

                    const clipName = prompt("Enter a name for your sound clip");
            
                    const clipContainer = document.createElement("article");
                    const clipLabel = document.createElement("p");
                    const audio = document.createElement("audio");
                    const deleteButton = document.createElement("button");
            
                    clipContainer.classList.add("clip");
                    audio.setAttribute("controls", "");
                    deleteButton.textContent = "Delete";
                    clipLabel.textContent = clipName;
            
                    clipContainer.appendChild(audio);
                    clipContainer.appendChild(clipLabel);
                    clipContainer.appendChild(deleteButton);
                    soundClips.appendChild(clipContainer);
            
                    audio.controls = true;
                    const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
                    chunks = [];
                    const audioURL = URL.createObjectURL(blob);
                    audio.src = audioURL;
                    console.log("recorder stopped");
            
                    deleteButton.onclick = (e) => {
                    const evtTgt = e.target;
                    evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
                    };
                };   
                
                const analyser = aCtx.createAnalyser();
                const microphone = aCtx.createMediaStreamSource(stream);
                microphone.connect(analyser);
                analyser.connect(aCtx.destination);
                props.sendMessage("Managers", "TryGetMic");
                mediaRecorder.ondataavailable = (e) => {
                    chunks.push(e.data);
                    console.log("chunks: ", chunks);
                };
                console.log("mediaRecorder: ", mediaRecorder);

            })
            .catch((err) => {
                console.error(`The following error occurred: ${err}`);
            });
        }
    }
        
        console.log("PROJ LEVEL: ", cameraProjectionLevel);

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
                <>
                    <button ref={isRecordingRef} style={{position:"absolute",top:"0rem",left:"0rem",height:"3rem",width:"4rem"}} onClick={toggleRecording}>
                        {
                        isRecording
                        ?
                            <span>Stop Recording</span>
                        :
                            <span>Start Recording</span>
                        }
                    </button>
                    <button style={{position:"absolute",bottom:"0rem",left:"0rem",height:"4rem",width:"4rem", minWidth:"4rem"}} onClick={handleAddPress}>up</button>
                    <button style={{position:"absolute",bottom:"0rem",left:"5rem",height:"4rem",width:"4rem", minWidth:"4rem"}} onClick={handleDeletePress}>down</button>
                </>
                :
                    null
            }
            {/* <button style={{position:"absolute",bottom:"0rem",left:"0rem",height:"4rem",width:"4rem", minWidth:"4rem"}} onClick={handleAddPress}>up</button>
            <button style={{position:"absolute",bottom:"0rem",left:"5rem",height:"4rem",width:"4rem", minWidth:"4rem"}} onClick={handleDeletePress}>down</button> */}

        {
            props.loadingProgression < 1
                ?
                    <LoadingBar style={{position:"absolute"}} loadingProgression={props.loadingProgression} />
                :
                null
        }
        <span style={{position:"absolute",right:"4rem"}}>{cameraProjectionLevel}</span>
        {
            cameraProjectionLevel === 0
            ?
            <LocalDataUI/>
            :
            cameraProjectionLevel === 1
            ?
            <LocalViewUI/>
            :
            cameraProjectionLevel === 2
            ?
            <GlocalDataUI/>
            :
            cameraProjectionLevel === 3
            ?
            <GlocalViewUI/>
            :
            cameraProjectionLevel === 4
            ?
            <LobalDataUI/>
            :            
            cameraProjectionLevel === 5
            ?
            <LobalViewUI/>
            :
            cameraProjectionLevel === 6
            ?
            <>
            <span>HEYA</span>
            <GlobalDataUI/>
            </>
            :
            cameraProjectionLevel === 7
            ?
            <GlobalViewUI/>
            :
            null
        }
        {/* {
            cameraProjectionLevel === 1
            ?
            <LocalViewUI/>
            :
            null
        }
        {
            cameraProjectionLevel === 2
            ?
            <GlocalDataUI/>
            :
            null
        }
        {
            cameraProjectionLevel === 3
            ?
            <GlocalViewUI/>
            :
            null
        }
        {
            cameraProjectionLevel === 4
            ?
            <LobalDataUI/>
            :
            null
        }
        {
            cameraProjectionLevel === 5
            ?
            <LobalViewUI/>
            :
            null
        }
        {
            cameraProjectionLevel === 6
            ?
            <GlobalDataUI/>
            :
            null
        }
        {
            cameraProjectionLevel === 7
            ?
            <GlobalViewUI/>
            :
            null
        } */}
        {
        unity
        ?
            unity
        :
            null
        }
        {/* <div id="map" style={{ position:"absolute",top:"0rem",left:"0rem", height: 100, width: 100 }}></div> */}
        {
            unity
            ?
                <button style={{position:"absolute",bottom:"2rem",right:"2rem"}} onClick={handleClickSpawnEnemies}>Get GeoJSON</button>
            :
                null
        }
        </>
    )
}

