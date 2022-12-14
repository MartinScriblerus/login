import styles from '../styles/Home.module.css'
import LogInOutButton from '../components/login-btn';
import {useState, useEffect, useRef} from 'react';
import { getSession } from "next-auth/react";
import Unity from '../pages/unity'
import { useRouter } from 'next/router';
import { useUnityContext } from "react-unity-webgl";

  
async function RedirectPage() {
    const [routing,setRouting] = useState(false);
    
    const session = getSession();
    const user = session.user;
    const router = useRouter();
    let public_url = process.env.PUBLIC_URL;

    router.push('/login');
    //setTimeout(()=>{console.log("long resolution...")},5000)
    // Make sure we're in the browser
    if (typeof window !== 'undefined') {
        if(!routing || !user || !session){
            setRouting(true);
        
            router.push('/login');
            // setTimeout(()=>{setRouting(false)}, 10000);
            // clearTimeout();
    } else {

    } 
    return; 
  }
}



export default function Dashboard({session, listSubusers, blobServiceClient,userAlias}, props){
    console.log("PROPS IN DASHBOARD: ", userAlias);
    const { unityProvider, sendMessage, loadingProgression, addEventListener, removeEventListener } = useUnityContext({
        loaderUrl: "ResearchBuild/Build/ResearchBuild.loader.js",
        dataUrl: "ResearchBuild/Build/ResearchBuild.data",
        frameworkUrl: "ResearchBuild/Build/ResearchBuild.framework.js",
        codeUrl: "ResearchBuild/Build/ResearchBuild.wasm",
    });
    
    const [width, setWidth] = useState(800);
    const [height, setHeight] = useState(800);
    const [latitude,setLatitude] = useState(0);
    const [longitude,setLongitude] = useState(0);


    const [startedUnity,setStartedUnity] = useState(false);
    // const [parsedProg,setParsedProg]=useState(0);
    // const [maxElevation,setMaxElevation]=useState(0);
    // const [minElevation,setMinElevation]=useState(0);
    // const [avgElevation,setAvgElevation]=useState(0);
    const [awake,setAwake] = useState(true)

    if (typeof window !== 'undefined' && awake === true) {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
        setAwake(false);
    }


    //console.log("LOADING PROG: ", loadingProgression);

    // const allUsers = useRef();
    // if(props && props.allUsers){
    //     allUsers.current = props.allUsers;
    //     console.log("All Users in Dashboard: ", allUsers.current);
    // }
    




    useEffect(()=>{
        if(!unityProvider){
            setLoadingProgression(0);
        } else {
            console.log("UNITY PROVIDER: ", unityProvider);
        }
    },[unityProvider])

      // UI MAIN TICK
      useEffect(() => {
        //         if(window.playAud && window.playAud.length > audioToPlayArray.current.length){
        //     audioToPlayArray.current = window.playAud;
        //     console.log("audio to play array HOORAY! ", audioToPlayArray.current);  
        // }
        const updateWindowDimensions = () => {
            if (typeof window !== 'undefined') {  
                const newWidth = window.innerWidth;
                const newHeight = window.innerHeight;
                setWidth(newWidth);
                setHeight(newHeight);
                console.log("updating width");
            }
        };
    
            window.addEventListener("resize", updateWindowDimensions);
    
            return () => window.removeEventListener("resize", updateWindowDimensions) 
   
    }, []);

    function tryGetAltitude(){
        function sortProper(a,b){
            return a-b;
        }
        // if(latitude !== 0 && longitude !== 0){
            
        //     fetch(`https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/tilequery/${longitude},${latitude}.json?&access_token=pk.eyJ1IjoibWF0dGhld2ZyZWlsbHkiLCJhIjoiY2s1dW9mYmR1MWJ0cjNtb25lY240N3oxYyJ9.oUoPX11hY_Rz6ausgTENyw`)
        //     .then(res=>res.json())
        //     .then(data=>{
        //         // console.log("DATA: ", data);
        //         let geoEleArr = [];
        //         if(!data || data.length <= 0){
        //             return;
        //         } else {
        //             data.features.map(i=>geoEleArr.push(i.properties.ele));
        //             setMaxElevation(geoEleArr.sort(sortProper)[geoEleArr.length - 1]);
        //             setMinElevation(geoEleArr.sort(sortProper)[0]);
        //             let total = 0;
        //             geoEleArr.map((i,ind)=>{
        //                 total = total + i;
        //                 setAvgElevation(total/(ind+1));
        //             });
                    
        //         }
        //     });
        // }
    }

    async function getUserPosition(){
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };
        let unityContext = unityProvider;
        function success(pos) {
            const crd = pos.coords;
            
            setLongitude(crd.longitude);
            setLatitude(crd.latitude);
            
         
            // unityContext.unload();
            // console.log(`Latitude : ${crd.latitude}`);
            // console.log(`Longitude: ${crd.longitude}`);
            // console.log(`Latitude : ${latitude}`);
            // console.log(`Longitude: ${longitude}`);
            // console.log(`More or less ${crd.accuracy} meters.`);
            return crd;
        };
        function error(err) {
            console.warn(`ERROR(${err.code}): ${err.message}`);
        };  
        if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
            navigator.geolocation.getCurrentPosition(success, error, options);
            // tryGetAltitude();
        }
    }
    getUserPosition();
    // edit to place getUsrPosition in a requestAnimationFrame

    // console.log("WHAT IS SESSION? ", session);
    const user = session?.user;

    // console.log("user in dashboard: ", user);
    // console.log("session in dashboard : ", session);

    if(session && user){
        // console.log("IDENTIFY USER: ", user);
        let src = "https://www.icegif.com/wp-content/uploads/icegif-5590.gif";
        //console.log("------------------------------------------------")
        //console.log("USER: ", user);

        function startUnity(){
            setStartedUnity(true);
        }

        return (
            <div className={styles.container}>
                <span id="userAliasDisplay" style={{position:"fixed",top:"8px",left:"8px",background:"transparent",width:"25%"}}>{userAlias}</span>
                <main style={{objectFit:"cover",height:"100%"}}>               
                    {
                    startedUnity
                    ?
                        <Unity 
                            style={{
                                minHeight:"100%", 
                                zIndex:9999,
                                pointerEvents:"all"}} 
                                width={width} 
                                height={height} 
                                addEventListener={addEventListener}
                                removeEventListener={removeEventListener}
                                user={user}
                                unityProvider={unityProvider} 
                                sendMessage={sendMessage} 
                                longitude={longitude} 
                                latitude={latitude} 
                                // maxElevation={maxElevation}
                                // minElevation={minElevation}
                                // avgElevation={avgElevation}
                                loadingProgression={loadingProgression} 
                                blobServiceClient={blobServiceClient}
                        ></Unity>
               
                    // ADD NEW PATH
                    :
                    <>
                    <div id="titleStartWrapperDiv" styles={{width:"100%",top:"0px"}}>
                        <h1 style={{fontSize:"80px",position:"absolute",color:"#501214",fontFamily:"monospace",fontWeight:"100",width:"50%",left:"25%",textAlign:"center"}}>Mosaic</h1>
                        <button id="unityStartBtn" style={{marginBottom:"12px",fontSize:"28px"}} onClick={startUnity}>Start</button>
                        {/* <h1 className={styles.title}>    */}
                            {/* CAN PLACE BACKGROUND HERE */}
                            <LogInOutButton />
                        {/* </h1> */}

                    </div>
                    <select 
                        defaultValue={"--Aliases--"}
                        style={{
                            display:"flex", 
                            id:"subusersSelect",
                            class:"select",
                            flexDirection:"row",
                            zIndex: 7,
                            width: "100%",
                            position: "absolute",
                            right: "24px",
                            top: "8px",
                            textAlign:"center",
                            justifyContent: "center",
                            textAlign: "center",
                            borderRadius:"24px",
                            // border: "solid 1px rgb(12, 95, 80)",
                            border:"transparent",
                            // background:"rgba(12, 95, 80,0.5)",
                            maxWidth:"10rem",
                            position:"absolute",
                            fontWeight:"100",
                            minHeight:"46px"
                        }}    
                    >
                    
                    <option disabled>--Aliases--</option>
                    {listSubusers}
                </select>
   
                    </>
                }
                </main>
                {/* <button id="unityStartBtn" onClick={startUnity}>Start</button> */}
            </div>
        )
    } else {
        console.log("no current session");
        // // redirect
        try{ 
            RedirectPage();
        } catch {

        }
    }



}
