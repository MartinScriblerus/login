import dynamic from 'next/dynamic';
dynamic(import("react-unity-webgl").then(mod => mod), { ssr: false }) 
import Head from 'next/head'
import { Unity, UnityEvent} from "react-unity-webgl";
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
import UmbrellaSlider from "../components/umbrellaSlider";
import { useRouter } from 'next/router';
import Babylon from "../pages/babylon";
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
    const valueRef = useRef('');
    valueRef.current = 'Campus View';
    const isRecordingRef = useRef();
    const soundClips = useRef();
    const unityRef = useRef();
    
    console.log("PROPS IN UNITY: ", props.user);

    const router = useRouter();

    // The Unity Game Component
    useEffect(()=>{
    
        setUnity(<Unity ref={unityRef} style={{width:props.width, height:props.height, minHeight:"100vh"}} key={1} id="unityWindow" unityProvider={props.unityProvider} />)

    },[props.unityProvider, props,props.width, props.height])

    useEffect(()=>{
        if(props.loadingProgression >= 1){
            setSliderReady(true);
        }
    },[sliderReady,setSliderReady,props.loadingProgression])

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
                // let canvasToRemove = document.getElementById("unity");
                // if(canvasToRemove){
                //     canvasToRemove.remove();
                //     canvasToRemove = null;
                // }
                // clearTimeout();
                setReadyForBabylon(true);
                setAlertMsg("");
            },4000);
            
            // router.push('/babylon');
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
        document.addEventListener('keydown', handleKeyDown);

        return function cleanup() {
          document.removeEventListener('keydown', handleKeyDown);
        }
    });

    // useEffect(function () {
    //     console.log("PROPS UNITY PROVIDER: ", props.unityProvider);
    //     // props.unityContext.on("quitted", function () {
    //     //     setReadyForBabylon(true);
    //     // });
    //   }, [props]);

    useEffect(()=>{
        if(props.unityProvider){
            props.sendMessage("MainCamera", "UserLongitude", props.longitude);
            props.sendMessage("MainCamera", "UserLatitude", props.latitude);
        }
    },[props, props.longitude, props.latitude])
    
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
                console.log("THE UNITY INSTANCE: ", unityRef.current);
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
                    fileList.id="blobSelect";
                    document.append(fileList);
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
                form.append("file[]", blob, `${props.longitude}_${props.latitude}_${utcTimestamp}.mp3`);
                console.log("audio file to save: ", form.getAll("file[]")[0]);
                uploadToAzureBlob(form.getAll("file[]")[0],form.getAll("file[]")[0].name);
              });
        }
    }
        
    let gameLevel = ["Campus View","Campus Data","AR", "AR Data", "Cardboard VR", "VR", "Hololens", "Global Data"];
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
                        sliderReady && isRecording
                        ?
                        <UmbrellaSlider sendMessage={props.sendMessage} />
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
                            border: "solid 1px rgb(12, 95, 80)",
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

