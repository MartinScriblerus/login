import styles from '../styles/Home.module.css'
import LogInOutButton from '../components/login-btn';
import {useState, useEffect} from 'react';
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


export default function Dashboard({session, listSubusers}, props){
    // console.log("PROPS IN DASHBOARD: ", props);
    const { unityProvider, sendMessage, loadingProgression } = useUnityContext({
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
    const [parsedProg,setParsedProg]=useState(0);
    const [awake,setAwake] = useState(true)

    if (typeof window !== 'undefined' && awake === true) {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
        setAwake(false);
    }

    console.log("LOADING PROG: ", loadingProgression);

    // const allUsers = useRef();
    // if(props && props.allUsers){
    //     allUsers.current = props.allUsers;
    //     console.log("All Users in Dashboard: ", allUsers.current);
    // }
    
      // UI MAIN TICK
      useEffect(() => {
        
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

    async function getUserPosition(){
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };
        function success(pos) {
            const crd = pos.coords;
            
            setLongitude(crd.longitude);
            setLatitude(crd.latitude);
            console.log('Your current position is:');
            // console.log(`Latitude : ${crd.latitude}`);
            // console.log(`Longitude: ${crd.longitude}`);
            console.log(`Latitude : ${latitude}`);
            console.log(`Longitude: ${longitude}`);
            console.log(`More or less ${crd.accuracy} meters.`);
            return crd;
        };
        function error(err) {
            console.warn(`ERROR(${err.code}): ${err.message}`);
        };  
        if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
            navigator.geolocation.getCurrentPosition(success, error, options);
        }
    }
    getUserPosition();


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

                <main style={{objectFit:"cover"}}>               
                    {
                    startedUnity
                    ?
                        <Unity style={{minHeight:"100%"}} width={width} height={height} unityProvider={unityProvider} sendMessage={sendMessage} longitude={longitude} latitude={latitude} loadingProgression={loadingProgression}></Unity>
               
                    // ADD NEW PATH
                    :
                    <>
                    <h1 className={styles.title}>   
                        {/* <img 
                            id="loginDashboardImg"
                            style={{
                                zIndex:"-1",
                                    
                                backgroundSize: "cover",
                                backgroundRepeat: "no-repeat",
                                minWidth: "600px",
                                minHeight: "100%",
                                width:"100%",
                                position: "absolute",
                                inset: "0px",
                                boxSizing: "border-box",
                                padding: "0px",

                                margin: "auto",
                                display: "block",
                                justifyContent: "center",
                                alignItems: "center",
                                
  
                            }}
                            
                            alt="RiverScene"
  
                            src={src}
                        /> */}
 
                        <LogInOutButton />
                    </h1>
                    <button id="unityStartBtn" onClick={startUnity}>Start</button>
                    <select style={{
                        display:"flex", 
                        id:"subusersSelect",
                        class:"select",
                        flexDirection:"row",
                        zIndex: 7,
                        position: "absolute",
                        top: "4%",
                        width: "10rem",
                        maxWidth: "10rem",
                        right: "2rem",
                        textAlign: "center",
                        borderRadius:"24px",
                        border: "solid 1px rgba(50,220,300,1)"
                    }}    
                    >
                    <option  disabled>--Subusers--</option>
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
