import Head from 'next/head';
// import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { useSession } from "next-auth/react";
import Dashboard from './dashboard';
import { prisma, PrismaClient } from "@prisma/client";
// import {useState} from 'react';
import { useRouter } from 'next/router';
// import LogInOutButton from '../components/login-btn';
import {useRef} from 'react';
import LoginWrapper from './login';
import getAllUsers from './api/getAllUsers';


export default function Home(props) {

  const { data: session } = useSession();
  
  let fullUserData;

  console.log("session in index: ", session);
  console.log("PROPS ARE USERS HERE? ", props);
  const router = useRouter()


  if(session && session.user && props && props.allUsers.length){
    // console.log('SESSION--------------- ', session);
    fullUserData = props.allUsers.filter(i=>i.user_name === session.user.name);
    console.log("FULL USER DATA: ", fullUserData);
  } else {
    // console.log("no session yet");
  }



  return (
    <div id="pageWrapper" className={styles.container}>
      <Head>
        {
        !session
        ?
        <title>Verify</title>
        :
        <title>Logged In</title>
        }
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {
          !session
          ?
          <>
            <h1 className={styles.title}>
              Status:  
              {
                session
              ?
                <span style={{color:"rgba(225,70,80,.9)"}}> logged in</span>
              :
                <span style={{color:"rgba(225,70,80,.9)"}}> logged out</span>
              }
            </h1>
            <LoginWrapper allUsers={props.allUsers}></LoginWrapper>
          </>
        :
          <>
            <Dashboard session={session} fullUserData={fullUserData} allUsers={props.allUsers}/>
          </>
        }
      </main>

      <footer className={styles.footer}>

      </footer>
    </div>
  )
}

export async function getStaticProps(){
  let allUsers = await getAllUsers();
  return {
    props: 
    {
      allUsers: JSON.parse(JSON.stringify(allUsers))
    }
  }
}
