import Head from 'next/head';
import Image from 'next/image';
// import Image from 'next/image';
// import Link from 'next/link'
import styles from '../styles/Home.module.css'
import LogInOutButton from '../components/login-btn';
// import LoginWrapper from './login'
import {useState, useRef} from 'react';
import { getSession } from "next-auth/react";

import { useRouter } from 'next/router';

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

// RedirectPage.getInitialProps = ctx => {
//   // We check for ctx.res to make sure we're on the server.
//   if (ctx.res) {
//     ctx.res.writeHead(302, { Location: '/login' });
//     ctx.res.end();
//   }
//   return { };
// }

export default function Dashboard({session}){
    // console.log("PROPS IN DASHBOARD: ", props);
    
    // const allUsers = useRef();
    // if(props && props.allUsers){
    //     allUsers.current = props.allUsers;
    //     console.log("All Users in Dashboard: ", allUsers.current);
    // }
    
    // console.log("WHAT IS SESSION? ", session);
    const user = session?.user;

    console.log("------------------------------------------------")
    // console.log("user in dashboard: ", user);
    // console.log("session in dashboard : ", session);

    if(session && user){
        // console.log("IDENTIFY USER: ", user);
        let src = "https://www.icegif.com/wp-content/uploads/icegif-5590.gif";
        //console.log("------------------------------------------------")
        //console.log("USER: ", user);

        return (
            <div className={styles.container}>
                <Head>
                <title>Welcome!</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
                </Head>
                <main style={{objectFit:"cover"}}>
                    <h1 className={styles.title}>   
                        <Image 
                            style={{
                                zIndex:"-1",
                                backgroundSize: "cover",
                                backgroundRepeat: "no-repeat",
                                minWidth:"750px",
                                minHeight:"550px"
                            }}
                            
                            alt="RiverScene"
                            // width={500}
                            // height={500}
                            loader={() => src}
                            layout="fill"
                            unoptimized
                            src={src}
                        />
                        <span id="loggedInDashboardMsg">This is a dashboard for logged in users only</span> <br/>
                        <LogInOutButton />
                    </h1>
                    {/* {
                        props && props.fullUserData
                        ?
                        <div id="dashboardSubUsersWrapper" class="grid">
                        {props.fullUserData.map((subuser, i)=>{
                            <div key={i.toString()} id="dashboardSubuser" class="card">{subuser}</div>
                        })}
                        </div>
                        :
                        <></>
                    } */}
                </main>
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
