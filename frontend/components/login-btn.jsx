import { useSession, signIn, signOut } from "next-auth/react";
// import signIn from "../pages/api/auth/signin";
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css';
import axios from 'axios';
import {ThemeContext, themes, getIsNew} from './registerNewUser';
import ThemedButton, {getTheme} from './registerNewUserContext';
import {useRef, useState} from 'react';



// function  onSubmit (value) {
//     console.log("VAL ", value);
//     let data={content : value}
//     axios.post('http://localhost:3000/api/auth/callback', data)
//     .then((response) => {
//         console.log(response)
//     })
//     .catch((e) => { console.log(e)}
// )}


export default function LogInOutButton(props, user) {

    //console.log("Props in login-btn: ", props);

    const [theme,setTheme] = useState(false);
    const [passMismatch,setPassMisMatch]=useState(false);
    const [nameVerified,setNameVerified]=useState(true);
    const [hasMatchingNameCantSubmit,setHasMatchingNameCantSubmit]=useState(false);
    const allUsers = useRef({});

    const router = useRouter();
    const nameRef = useRef('');
    const passRef = useRef('');
    const passRef2 = useRef('');

    if(props.allUsers){
        allUsers.current = props.allUsers;
    }

    // TO-DO => Create new variable checking whether client is whitelisted as a sub-user  

    const { data: session } = useSession();
    // const public_url = process.env.PUBLIC_URL;
    if (session) {

        if(!session.expires){
            console.log("NO USER NAME!!! ", session);
            return;
            // hardcode name value to prevent big break
            //session.user.name = 'default test'
        } 

        //console.log('in login-btn session', session);
        // TODO => ERROR CHECK HERE to stop break...
        if(!session || session.length < 1){
            console.error("returning due to error [no session].")
            return;
        }
        const { pidAdmin } = session.user.email;

        let hasSpaces = false;

        try {
            hasSpaces = session.user.name.split(' ').length > 1;
        } catch {

        }

        let editedUsername = hasSpaces ? session.user.name.replace(" ","_") : session.user.name;
        //router.push(`/post/${editedUsername}`)
        return (
        <div id="main">
            <span style={{
                // fontSize: "32px",
                width: "60%",
                left: "20%",
                textAlign: "center",
                position: "absolute",
                bottom: "100px",
                fontWeight:"100", 
                fontSize:"22px",
            }}>
                Logged in as 
                <span style={{color:"#501214"}}>
                     {" " + session.user.name} <br/>
                </span>
            </span>
            {/* Signed in.... as {session.user.email} <br /> */}
            <div id="horizontalRow">
                {/* <button onClick={()=> router.push('/')}>Hub</button> */}
                <button onClick={()=> router.push(`/post/${editedUsername}`)} >Admin</button>
                <button onClick={() => signOut()}>Sign out</button>
            </div>
        </div>
        )
    } 



    function handleNameUpdate(){
        console.log("ping");
        
        let name = document.getElementById("name_NewUserRegistration");
        if(name){
            nameRef.current = name.value;
        }
        let matchingNames;
        try{
        matchingNames = allUsers.current.filter(i => i.user_name === nameRef.current);
        } catch(e){
            console.log("err in filter: ", e);
        }
        if(matchingNames.length > 0){
            //console.log("ALREADY IN DB! ", matchingNames);
            setHasMatchingNameCantSubmit(true);
        } else {
            setHasMatchingNameCantSubmit(false);
        }
        return;
    }

    function handlePassRef1Update(){
        let pass1 = document.getElementById("pass1_NewUserRegistration");
        if(pass1){
            passRef.current = pass1.value;
        }
        if(passRef2.current !== passRef.current){
            setPassMisMatch(true);
        } else {
            setPassMisMatch(false);
        }
        return
    }

    function handlePassRef2Update(){
        let pass2 = document.getElementById("pass2_NewUserRegistration");
        if(pass2){
            passRef2.current = pass2.value;
            if(passRef2.current !== passRef.current){
                setPassMisMatch(true);
            }
        }
        if(passRef2.current !== passRef.current){
            setPassMisMatch(true);
        } else {
            setPassMisMatch(false);
        }
        return;
    }

    async function userDataSubmitted(){
        //console.log("hit data submitted");
        // This is a function for checking the input
        if(passRef2.current !== passRef.current){
            setPassMisMatch(true);
        }
    
        handleSubmit(nameRef.current,passRef2.current);
        // There should be an intermediary function here to encrypt passwords
        // let public_url = process.env.PUBLIC_URL;
        // console.log("PUBLIC URL: ", public_url);
        router.push("/login");
    }

    async function handleSubmit(user_name, email){
        //console.log("in handle submit: ", user_name);
        let objectWithData = {
       
                user_name: user_name,
                email: email,
    
        }
        //console.log("an object with data: ", objectWithData);
        // try{
  

        fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': '*',
            },
            body: JSON.stringify(objectWithData),
            }).then(async response => {
                try {
                    console.log("what is response? ", response);
                    const data = await response
                    console.log('response data from register api?', data);
                } catch(error) {
                    console.log('Error happened here!')
                    console.error(error);
                }
          })
       // console.log("register", register);
        }


    // TO-DO =>     Create else-if condition for whitelisted subusers
    //              and an empty else to default to login failure
    return (
        <div id="userStatusLoginWrapper">
        {/* Not signed in <br /> */}
        <ThemeContext.Provider value={theme}>
   
            <ThemedButton onClick={()=>{setTheme(!theme)}}>
                {theme
                ?
                    <span onClick={()=>handleSubmit()}>Back</span>
                :
                    <span >New Users</span>
                }
            </ThemedButton>
            {/* </ThemeContext.Provider> */}
            {
                theme
                ?
                    null    
                //<button style={{backgroundColor:"rgba(100,100,100,0.3)",pointerEvents:"none"}} disabled onClick={() => signIn()}>Awaiting Account</button>
                :
                    <button style={{pointerEvents:"auto"}} onClick={() => signIn()}>Sign in</button>
            }
        </ThemeContext.Provider>
        {
        theme
        ?
            <div style={{ position:"relative",display:"flex",flexDirection:"column",paddingLeft: "32%", paddingRight:"32%",paddingTop:"4%"}}>
                <input maxLength={32} id="name_NewUserRegistration" placeholder="Choose a username..." inputref={nameRef} onChange={()=>{handleNameUpdate()}}></input>
                {
                nameVerified
                ?
                    hasMatchingNameCantSubmit
                    ?
                    <label style={{color:"rgba(255,255,255,0.78)"}}>Name Taken</label>
                    :
                    <label style={{color:"rgba(255,255,255,0.78)"}}>Name</label>
                :
                    hasMatchingNameCantSubmit
                    ?
                    <label style={{color:"red"}}>Name Take</label>
                    :
                    <label style={{color:"red"}}>Name Selection Errors</label>
                }
                <input maxLength={32} id="pass1_NewUserRegistration" type="password" placeholder="**********" inputref={passRef} onChange={()=>handlePassRef1Update()}></input>
                {
                passMismatch
                ?
                    <label>Password Mismatch<span style={{color:"red",fontWeight:"300"}}>&#10060;</span></label>
                :
                    <label>Passwords Match<span style={{color:"green",fontWeight:"300"}}>&#10003;</span></label>
                }
                <input maxLength={32}type="password" id="pass2_NewUserRegistration" placeholder="Confirm" inputref={passRef2} onChange={()=>handlePassRef2Update()}></input>
                {
                passMismatch
                ?
                    <label>Password Mismatch <span style={{color:"red",fontWeight:"300"}}>&#10060;</span></label>
                :
                    <label>Passwords Match<span style={{color:"green",fontWeight:"300"}}>&#10003;</span></label>
                }
                {
                    hasMatchingNameCantSubmit
                    ?
                        <button style={{pointerEvents:"none",opacity:"0.5",color:"red",width:"100%", margin:"0%", marginTop:"24px", paddingLeft:"20%",paddingRight:"20%", position:"relative",justifyContent:"center"}} onClick={()=>{userDataSubmitted()}}>ERROR</button>
                    :
                        <button style={{pointerEvents:"all",opacity:"1",width:"100%", margin:"0%", marginTop:"24px", paddingLeft:"20%",paddingRight:"20%", position:"relative",justifyContent:"center"}} onClick={()=>{userDataSubmitted()}}>SUBMIT</button>
                }
            </div>
        :
            null
        }
        </div>
        
    )
}
