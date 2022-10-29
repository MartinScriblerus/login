import dynamic from 'next/dynamic';
dynamic(import("react-unity-webgl").then(mod => mod), { ssr: false }) 
import Head from 'next/head'
import { Unity, UnityEvent } from "react-unity-webgl";
import React, { useEffect, useState, useRef } from "react";
var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
import LoadingBar from "../components/loadingBar";




export default function UnityWebGLBuild(props){


    console.log("PROPS: ", props);

    const [unity,setUnity] = useState([]);
    const [cameraHeightInput,setCameraHeightInput]=useState(225);
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
        props.sendMessage("MainCamera", "CameraHeight", cameraHeightInput);
    };

    function handleDeletePress(){
        console.log("cam height input in delete: ", cameraHeightInput);
        setCameraHeightInput(cameraHeightInput - 25);
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
    async function tryGetRecorder(aCtx,analyser,microphone,stream){
        console.log("uuuuu stream? ", stream);
        // creates the audio context
        if (typeof window !== 'undefined') {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
        }
        let context = new AudioContext();

        // creates an audio node from the microphone incoming stream
        let mediaStream = context.createMediaStreamSource(stream);
       
        console.log("HERE IS MEDIASTREAM: ", mediaStream);
        // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createScriptProcessor
        var bufferSize = 2048;
        var numberOfInputChannels = 2;
        var numberOfOutputChannels = 2;
        console.log("here is context ", context);
        if (context.createScriptProcessor) {
            recorder = context.createScriptProcessor(bufferSize, numberOfInputChannels, numberOfOutputChannels);
        } else {
            recorder = context.createJavaScriptNode(bufferSize, numberOfInputChannels, numberOfOutputChannels);
        }
        var leftchannel = [];
        var rightchannel = [];
        var recordingLength = 0;
        console.log("uuuum recorder: ", recorder);
        recorder.onaudioprocess = function (e) {
            leftchannel.push(new Float32Array(e.inputBuffer.getChannelData(0)));
            rightchannel.push(new Float32Array(e.inputBuffer.getChannelData(1)));
            recordingLength += bufferSize;
            // we connect the recorder with the input stream
            mediaStream.connect(recorder);
            recorder.connect(context.destination);
            console.log("HAVE WEE GOT A RECORDER? ", recorder);
        }

        

        var leftBuffer = flattenArray(leftchannel, recordingLength); // flattenArray is on GitHub (see below)
        var rightBuffer = flattenArray(rightchannel, recordingLength);

        // we interleave both channels together
        // [left[0],right[0],left[1],right[1],...]
        var interleaved = interleave(leftBuffer, rightBuffer); // interleave is on GitHub (see below)

        // we create our wav file
        var buffer = new ArrayBuffer(44 + interleaved.length * 2);
        console.log("BUFFER IS: ", buffer);   
        // if(!isRecording){
        //     console.log("BUFFER!!! ", buffer);
        //     // if(audioContext == null)
        //     //     return;
            
        //     recorder.disconnect(audioContext.destination);
        //     microphone.disconnect(recorder);
            
        //     audioContext = null;
        //     recorder = null;
        //     microphone = null;
        // }   
    }

    const aCtx = new AudioContext();

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
        
          



            //     function(stream) {
            //     // setAudioTrack(stream.getTracks());
            //     console.log("?@?@?@? ", stream.getTracks()[0]);
            //     stream.getTracks()[0].enabled = false;
           
            //     const analyser = aCtx.createAnalyser();
            //     const microphone = aCtx.createMediaStreamSource(stream);
            //     microphone.connect(analyser);
            //     analyser.connect(aCtx.destination);
            //     props.sendMessage("Managers", "TryGetMic");
            //     tryGetRecorder(aCtx,analyser,microphone,stream);
            // }, 
            // function (){console.warn("Error getting audio stream from getUserMedia")},
            // function (e) {
            //     // should tryGetRecorder go here?                             
            // })
        // } else {
        //     console.log('loooook here: ', aCtx);
        // }
    



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
