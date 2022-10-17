import Head from 'next/head';
import Image from 'next/image';
import RegisterNewUser from '../components/registerNewUser';
import styles from '../styles/Home.module.css'
import {createRef, useContext,useState} from 'react';
import { useSession } from "next-auth/react";
import LogInOutButton from '../components/login-btn';



export default function LoginWrapper(props){
    
    const [allUsers,setAllUsers] = useState();
    if(props.allUsers.length > allUsers.length){
        setAllUsers(props.allUsers.length)
    }
    console.log("props in login wrapper: ", props);
    const { data: session } = useSession();
    // console.log("session ", session);
    // if(session){
    //     console.log('we have a session in /login: ', session);
    // } else {
    //     console.log('no session yet it login');
    // }

    return(        
        <div className={styles.container}>

        <Head>
          <title>Login</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main >
            <h1 className={styles.title}>   
                    {session
                    ?
                        <span>Welcome back, {session.user.name}!</span>
                    :
                        <span style={{fontSize:"32px"}}>You will need to log in!</span>
                    }
                    <LogInOutButton allUsers={allUsers} />
                    {/* <RegisterNewUser /> */}
            </h1>
        </main>
    </div>
    )
}

