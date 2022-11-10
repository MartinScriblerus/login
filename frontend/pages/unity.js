import dynamic from 'next/dynamic';
dynamic(import("react-unity-webgl").then(mod => mod), { ssr: false }) 
import Head from 'next/head'
import { Unity, UnityEvent} from "react-unity-webgl";
import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
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
import UmbrellaSlider from "../components/umbrellaSlider";
import { useRouter } from 'next/router';
import Babylon from "../pages/babylon";
import { transparent } from 'material-ui/styles/colors';
const { InteractiveBrowserCredential } = require("@azure/identity");
const { BlobServiceClient } = require("@azure/storage-blob");


async function uploadFileToBlob(blobService,file) {
    if (!file) return [];
    let containerName = "audiofiles"
    // get Container - full public read access
    const containerClient = blobService.getContainerClient(containerName);
    await containerClient.createIfNotExists({
        access: 'container',
    });

    // upload file
    await createBlobInContainer(containerClient, file);

    // get list of blobs in container
    return getBlobsInContainer(containerClient);
};

export default function UnityWebGLBuild(props){
    
    const [unity,setUnity] = useState([]);
    const [isRecording,setIsRecording] = useState(false);
    const [deviceStateNum, setDeviceStateNum] = useState(3);
    const [audioUploadState,setAudioUploadState] = useState();
    const [sliderReady,setSliderReady] = useState(false);
    const [switchUrl,setSwitchUrl]=useState(false);
    const [readyForBabylon,setReadyForBabylon] = useState(false);
    const [alertMsg,setAlertMsg] = useState('');
    const [createdAudio,setCreatedAudio] = useState(false);
    const [latLonString,setLatLonString] = useState('');
    const [size,setSize] = useState({ values: [10] });
    const [audioReady,setAudioReady] = useState("");
    const [count,setCount] = useState(0); 
    const [blob,setBlob] = useState(null);

    const valueRef = useRef('');
    valueRef.current = 'Campus View';
    const isRecordingRef = useRef();
    const soundClips = useRef();
    const unityRef = useRef();
    const audioToPlayArray = useRef();
    audioToPlayArray.current = [];
    const audToPlayRef = useRef([]);
    const hiddenAudioPlayerRef = useRef(null); 
    // console.log("PROPS IN UNITY: ", props.user);

    const router = useRouter();


    // Use useRef for mutable variables that we want to persist
    // without triggering a re-render on their change
    const requestRef = useRef();
    const previousTimeRef = useRef();
    
    const animate = time => {
        if (previousTimeRef.current != undefined) {
        const deltaTime = time - previousTimeRef.current;
        
        // Pass on a function to the setter of the state
        // to make sure we always have the latest state
        setCount(prevCount => (prevCount + deltaTime * 1) % 100);
        }
        previousTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
    }
  
    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Make sure the effect runs only once

    async function queryBlobToPlay(trackName){
        console.log("T R A C K N A M E : ", trackName.split('_')[[2]])
        let trimmedURL = (trackName.replace('EU_',''));
        console.log("trimmed audio url we collided with: ", trimmedURL);
        
        const signInOptions = {
            // the client id is the application id, from your earlier app registration
            clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID,
    
            // this is your tenant id - the id of your azure ad tenant. available from your app registration overview
            tenantId: process.env.NEXT_PUBLIC_AZURE_TENANT_ID,
        }
    
        const blobStorageClient = new BlobServiceClient(
            "https://audblobs.blob.core.windows.net/",
            new InteractiveBrowserCredential(signInOptions)
        )

        var containerClient = await blobStorageClient.getContainerClient("audiofiles");
        const blobClient = containerClient.getBlobClient(trimmedURL);
        const downloadBlockBlobResponse = await blobClient.download();
        const downloaded = await blobToUrl(await downloadBlockBlobResponse.blobBody);
        console.log("Downloaded blob content", downloaded);

        async function blobToUrl(blob) {
            var url = URL.createObjectURL(blob);
            var preview; 
            let audDOM = document.getElementById("playbackAudioDOM");
            if(audDOM){
                preview = audDOM;
            } else {
                preview = document.createElement('audio');
            }
            preview.id = "playbackAudioDOM"
            preview.controls = false;
            preview.src = url;
            if(document.getElementById("existingRecordedAudio")){
                document.getElementById("existingRecordedAudio").remove();
            }
            preview.play();
        }

    }

    function updateAudRef(){
        if(window.playAud && window.playAud.length && window.playAud.length === audToPlayRef.current.length){
        } else {
            audToPlayRef.current.push(window.playAud[window.playAud.length-1]);  
            window.playAud.map(i=>queryBlobToPlay(i));
        }
    }

    useEffect(()=>{
        // This effectively runs as a main game loop... adjust count for delta
        if(window.playAud && window.playAud.length > 0){
            updateAudRef();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[count])
      
    // The Unity Game Component
    useEffect(()=>{
    
        setUnity(<Unity ref={unityRef} style={{width:props.width, height:props.height, minHeight:"100vh"}} key={1} id="unityWindow" unityProvider={props.unityProvider} />)

    },[props.unityProvider, props,props.width, props.height])

    const initialized = useRef(false);

    useEffect(()=>{
        if(props.loadingProgression >= 1){
            setSliderReady(true);
            if(latLonString !== '' && initialized.current === false){
                setTimeout(()=>{props.sendMessage("Map", "UserLatLon", latLonString);},2000);
                clearTimeout();
                console.log("INIT WORKED");
                initialized.current = true;
            }
        }
    },[sliderReady,latLonString,props,setSliderReady,props.loadingProgression])

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
            default: 
                break;
        }
    }


    useEffect(()=>{
        function handleBabylonSwitch(){
            setAlertMsg("Safely Removing Unity...");
            setTimeout(()=>{
                setReadyForBabylon(true);
                setAlertMsg("");
            },4000);
        };
        if(deviceStateNum === 5 || deviceStateNum === 1){
            
            if(!readyForBabylon){
                props.sendMessage("MainCamera","applicationQuit");
                handleBabylonSwitch();
            } else {
                
            }
        }
    },[props,readyForBabylon,deviceStateNum,router]);

    useEffect(() => {
        props.addEventListener('keydown', handleKeyDown);

        return function cleanup() {
            props.removeEventListener('keydown', handleKeyDown);
        }
    });


    useEffect(()=>{
        if(props.unityProvider && props.loadingProgression >=1 && props.latitude && props.longitude){
            props.sendMessage("MainCamera", "UserLongitude", props.longitude.toString());
            props.sendMessage("MainCamera", "UserLatitude", props.latitude.toString());
            setLatLonString(props.latitude.toString() + "_" + props.longitude.toString());
        }
    },[props,latLonString])
    
    function handleDeviceSelect(num){
        document.getElementById('deviceDropdown').value = num;
        
        updateView(num);       
        
        switch(num){
            case 'AR Data':
                setDeviceStateNum(0);
                if(props.loadingProgression >= 1 && !readyForBabylon){
                    props.sendMessage("MainCamera","CameraProjection",0);
                } else {
                    setReadyForBabylon(false);
                    // router.push('/');
                }
                break;
            case 'AR':
                setDeviceStateNum(1);
                props.sendMessage("MainCamera","CameraProjection",1);
                props.sendMessage("quitted", () => {
                    // Now we can for example go back to another page
                    console.log("Log quitted")
                });
                break;
            case 'Campus View':
                setDeviceStateNum(3);
                if(props.loadingProgression >= 1 && !readyForBabylon){
                    props.sendMessage("MainCamera","CameraProjection",3);
                } else {
                    setReadyForBabylon(false);
                    // router.push('/');
                }
                break;
            case 'Campus Data':
                setDeviceStateNum(2);
                if(props.loadingProgression >= 1 && !readyForBabylon){
                    props.sendMessage("MainCamera","CameraProjection",2);
                } else {
                    setReadyForBabylon(false);
                    // router.push('/');
                }
                break;
            case 'VR':
                setDeviceStateNum(7);
                props.sendMessage("MainCamera","CameraProjection",7);
                break;
            case 'Cardboard VR':
                setDeviceStateNum(5);
                props.sendMessage("MainCamera","CameraProjection",5);
                props.sendMessage("quitted", () => {
                    // Now we can for example go back to another page
                    console.log("Log quitted")
                });
                // console.log("THE UNITY INSTANCE: ", unityRef.current);
                // router.push('/babylon');
              
                break;
            case 'Hololens':
                setDeviceStateNum(4)
                props.sendMessage("MainCamera","CameraProjection",4);
                break;
            case 'Global Data':
                setDeviceStateNum(6);
                props.sendMessage("MainCamera","CameraProjection",6);
                break;
        }        
    };

    function updateView(num){
        // Pass geoJSON depending on the game/device state (in dropdown) 
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
                console.log("Get GeoJSON device state 2: ", geoJSON);
            }
            if(num === 3){
                let geoJSON = await fetch("https://raw.githubusercontent.com/blackmad/neighborhoods/master/austin.geojson")
                .then((response) => response.json())
                .then((data) => {
                    props.sendMessage("InteropController","GetMapLobal", JSON.stringify(data));
                });  
                console.log("Get GeoJSON device state 3: ", geoJSON);
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

    async function uploadToAzureBlob(form,blobName){
        if(!props.blobServiceClient){
            return;
        } else {
            // console.log(props.blobServiceClient);
        }
        
        const signInOptions = {
            // the client id is the application id, from your earlier app registration
            clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID,
    
            // this is your tenant id - the id of your azure ad tenant. available from your app registration overview
            tenantId: process.env.NEXT_PUBLIC_AZURE_TENANT_ID,
        }
    
        const blobStorageClient = new BlobServiceClient(
            // this is the blob endpoint of your storage acccount. Available from the portal 
            // they follow this format: <accountname>.blob.core.windows.net for Azure global
            // the endpoints may be slightly different from national clouds like US Gov or Azure China
            "https://audblobs.blob.core.windows.net/",
            new InteractiveBrowserCredential(signInOptions)
        )


        // this uses our container we created earlier - I named mine "private"
        var containerClient = await blobStorageClient.getContainerClient("audiofiles");
        
        // var localBlobList = [];
        // // now let's query our container for some blobs!
        // for await (const blob of containerClient.listBlobsFlat()) {
        //     // and plunk them in a local array...
        //     localBlobList.push(blob);
        //     console.log("LOCAL BLOB LIST: ", localBlobList);
        // }

        console.log("CONTAINER CLIENT: ", containerClient);
        console.log("blobName: ", blobName);
        const blockBlobClient = await containerClient.getBlockBlobClient(blobName);
        console.log("BLOCKBLOBCLIENT: ", blockBlobClient);
        
        let fileList = document.createElement('select');
        const listFiles = async () => {
            fileList.size = 0;
            fileList.innerHTML = "";
            try {
                console.log("Retrieving file list...");
                let iter = containerClient.listBlobsFlat();
                let blobItem = await iter.next();
                while (!blobItem.done) {
                    fileList.size += 1;
                    fileList.innerHTML += `<option>${blobItem.value.name}</option>`;
                    blobItem = await iter.next();
                }
                if (fileList.size > 0) {
                    console.log("Done.");
                    //fileList.id="blobSelect";
                    fileList = null;
                    // fileList.style.top="8rem";
                    // fileList.style.left="2rem";
                    // fileList.style.position="absolute";
                    // document.body.append(fileList);
                } else {
                    console.log("The container does not contain any files.");
                }
            } catch (error) {
                console.log(error.message);
            }
        };

        const uploadFiles = async () => {
            try {
                console.log("Uploading files...");
                const promises = [];

                const blockBlobClient = containerClient.getBlockBlobClient(blobName);
                promises.push(blockBlobClient.uploadBrowserData(form));
         
                await Promise.all(promises);
                console.log("Done. ");
                listFiles();
            }
            catch (error) {
                    console.log(error.message);
            }
        }
        uploadFiles();
    }

    function saveFile(){
        console.log("save file here: ...");
    };

    function toggleRecording(){
        if(isRecording){
            setIsRecording(false);
            if(document.getElementsByTagName('audio').length > 1){
                let doSave = confirm("Would you like to save this recording?");
                if(doSave){
                    console.log("SAVING FILE?");
                    saveFile(); // turn line 302 into a componentwide ref
                    props.sendMessage("MainCamera","displayPlacedUmbrella");
                    setTimeout(()=>{
                        props.sendMessage("MainCamera","resetUmbrella");
                    },2000);
                    clearTimeout();
                } else {
                    // handle not saving condition here (what is needed?)
                }
            } else {
                alert("You'll need to record some audio first!");
            }
        } else {
            setIsRecording(true);
            // props.sendMessage("MainCamera","createAudioUmbrella");
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
                const utcTimestamp = Date.now();
                const form = new FormData();
                // console.log("BBLLOOBB ", blob);
                if(size.values){
                    form.append("file[]", blob, `${props.longitude}_${props.latitude}_${utcTimestamp}_${size.values}_${props.user.name}.mp3`);
                    console.log("audio file to save: ", form.getAll("file[]")[0]);
                    uploadToAzureBlob(form.getAll("file[]")[0],form.getAll("file[]")[0].name);
                }
              });
        }
    }
        
    let gameLevel = ["Campus View","Campus Data","AR", "AR Data", "Cardboard VR", "VR", "Hololens", "Global Data"];
    let listLevels = gameLevel.map((level, i) =>
        <option label={level} value={level} key={i}>{level}</option>
    );

    useEffect(()=>{
        console.log("CHECK IT OUT!!!!!! AUDIO READY!!!!!!");
        
    },[audioReady])

    useEffect(()=>{
        if(props.loadingProgression >=1 && !createdAudio){
            async function getAudioFiles(){
                const signInOptions = {
                    // the client id is the application id, from your earlier app registration
                    clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID,
            
                    // this is your tenant id - the id of your azure ad tenant. available from your app registration overview
                    tenantId: process.env.NEXT_PUBLIC_AZURE_TENANT_ID,
        
                }
            
                const blobStorageClient = new BlobServiceClient(
                    // this is the blob endpoint of your storage acccount. Available from the portal 
                    // they follow this format: <accountname>.blob.core.windows.net for Azure global
                    // the endpoints may be slightly different from national clouds like US Gov or Azure China
                    "https://audblobs.blob.core.windows.net/",
                    new InteractiveBrowserCredential(signInOptions)
                )
        
        
                // this uses our container we created earlier - I named mine "private"
                var containerClient = await blobStorageClient.getContainerClient("audiofiles");
                let fileList = document.createElement('select');
                const listFiles_Init = async () => {
                    fileList.size = 0;
                    fileList.innerHTML = "";
                    try {
                        console.log("Retrieving file list...");
                        let iter = containerClient.listBlobsFlat();
                        console.log("GIVE THE WHOLE THING!!! ", containerClient.listBlobsFlat());
                        let blobItem = await iter.next();
                        console.log("WTF IS BLOB ITEM? ", blobItem);
                        while (!blobItem.done) {
                            fileList.size += 1;
                            fileList.innerHTML += `<option>${blobItem.value.name}</option>`;
                            blobItem = await iter.next();
                            let columnCount = blobItem.value.name.split("_").length;
                            if(blobItem.value.name){
                                
                                console.log("BLOBITEM OBJ!: ", blobItem.value.name);
                                console.log("BLOBITEM COUNT!: ", columnCount);
                                if(columnCount === 5 && blobItem.value){
                                    console.log("HIT A 5er!: ", blobItem.value.name);
                                   // props.sendMessage("MainCamera","createAudioEnvironment",JSON.stringify(blobItem));
                                   console.log("#####$$$$$$ ", blobItem.value.name);
                                    props.sendMessage("MainCamera","createAudioEnvironment",blobItem.value.name);
                                }
                            }
                        }
                        if (fileList.size > 0) {
                            console.log("Done.");
                            fileList.id="blobSelect";
                            fileList.style.top="8rem";
                            fileList.style.left="2rem";
                            fileList.style.position="absolute";
                            console.log("FILIE LIST!!! ", fileList);
                            // document.body.append(fileList);
                            
                        } else {
                            console.log("The container does not contain any files.");
                        }
                    } catch (error) {
                        console.log(error.message);
                    }
                    setCreatedAudio(true);
                };
                let result = await listFiles_Init();
                return result;
            }
            setTimeout(()=>{
                getAudioFiles();
            },5000);
            clearTimeout();
        }
    },[props,props.loadingProgression,createdAudio])

    function handleSetSize(values){
        setSize({ values });
    }

    const handleAudioReady = useCallback((fileName) => {
        setAudioReady(fileName);
        console.log("HOLY COW IT WORKS! ", fileName);
      }, []);
      useEffect(() => {
        props.addEventListener("CheckAudioCollisionValue", handleAudioReady);
        return () => {
          props.removeEventListener("CheckAudioCollisionValue", handleAudioReady);
        };
      }, [props,handleAudioReady]);

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
        <audio ref={hiddenAudioPlayerRef} style={{visibility:"hidden"}} id="existingRecordedAudio" type="audio/mp3" />
        <span style={{position:"absolute",left:"1rem",top:"1rem",fontSize:"32px"}}>
        {
            alertMsg !== ''
            ?
            alertMsg
            :
            null
        }
        </span>
            {
                props.loadingProgression >= 1
                ?
                <span>

                    {
                        sliderReady
                        ?
                        <UmbrellaSlider size={size} handleSetSize={handleSetSize} sendMessage={props.sendMessage} />
                        :
                        null
                    }
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
                            // border: "solid 1px rgb(12, 95, 80)",
                            border: "transparent",
                            background:"transparent",
                            pointerEvents:"all"
                        }}
                    >
                        <option disabled>--Device Level--</option>
                        { listLevels }

                    </select>
                    <button id="masterRecordBtn" ref={isRecordingRef} style={{pointerEvents:"all",position:"absolute",top:"6rem",right:"0rem",margin:"2%",height:"3rem",width:"12rem"}} onClick={toggleRecording}>
                        {
                        isRecording
                        ?
                            <span>Place Recording</span>
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
                        // deviceStateNum === 0
                        // ?
                        //     <ARDataView style={{pointerEvents:"none"}}/>
                        // :
                        // deviceStateNum === 1
                        // ?
                        //     <ARView style={{pointerEvents:"none"}}/>
                        // :
                        // deviceStateNum === 2
                        // ?
                        //     <CampusData style={{pointerEvents:"none"}} />
                        // :
                        // deviceStateNum === 3 
                        // ?
                        //     <CampusView style={{pointerEvents:"none"}} unity={unity} />
                        // :
                        // deviceStateNum === 4
                        // ?
                        //     <HololensView style={{pointerEvents:"none"}}/>
                        // :            
                        // deviceStateNum === 5
                        // ?
                        //     <CardboardVRView style={{pointerEvents:"none"}}/>
                        // :
                        // deviceStateNum === 6
                        // ?
                        //     <GlobalDataUI style={{pointerEvents:"none"}}/>
                        // :
                        // deviceStateNum === 7
                        // ?
                        //     <GlobalViewUI style={{pointerEvents:"none"}}/>
                        // :
                            null
            }
               
            {
                unity
            ?
                (deviceStateNum === 5 || deviceStateNum === 1) && readyForBabylon
                ?
                <Babylon style={{width:"100%",height:"100%",position:"absolute"}}></Babylon>
                :
                unity
            :
                null
            }
       
        </>
    )
}

