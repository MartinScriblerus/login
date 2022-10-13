import { useSession, signIn, signOut } from "next-auth/react";
// import signIn from "../pages/api/auth/signin";
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css';
import axios from 'axios';
import {ThemeContext, themes, getIsNew} from './registerNewUser';
import ThemedButton, {getTheme} from './registerNewUserContext';
import {useRef, useState} from 'react';



function  onSubmit (value) {
    console.log("VAL ", value);
    let data={content : value}
    axios.post('/api/auth/callback', data)
    .then((response) => {
        console.log(response)
    })
    .catch((e) => { console.log(e)}
)}


export default function LogInOutButton(user, props) {

    const [theme,setTheme] = useState(false);

    const router = useRouter();
    const nameRef = useRef('');
    const passRef = useRef('');
    const passRef2 = useRef('');

    // TO-DO => Create new variable checking whether client is whitelisted as a sub-user  

    const { data: session } = useSession();
 
    if (session) {

        if(!session.user.name){
            return;
            // hardcode name value to prevent big break
            //session.user.name = 'default test'
        }

        console.log('in login-btn session', session);
        const { pidAdmin } = session.user.name;

        let hasSpaces = false;

        try {
            hasSpaces = session.user.name.split(' ').length > 1;
        } catch {

        }

        let editedUsername = hasSpaces ? session.user.name.replace(" ","_") : session.user.name;

        return (
        <div className={styles.main}>
            Hello {session.user.name} <br/>
            {/* Signed in.... as {session.user.email} <br /> */}
            <div id="horizontalRow">
                <button onClick={()=> router.push('/')}>Hub</button>
                <button onClick={()=> router.push(`/post/${editedUsername}`)} >Admin</button>
                <button onClick={() => signOut()}>Sign out</button>
            </div>
        </div>
        )
    } 

    async function handleSubmit(){

        let objectWithData = {
       
                user_name: "newUser***!!!!",
                email: "email",
                
              
        }

        fetch('/api/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(objectWithData),
          })
          console.log("trying to create new user");

        }


    // TO-DO =>     Create else-if condition for whitelisted subusers
    //              and an empty else to default to login failure
    return (
        <div id="userStatusLoginWrapper">
        {/* Not signed in <br /> */}
        <ThemeContext.Provider value={theme}>
   
        
    <ThemedButton onClick={()=>{setTheme(!theme); handleSubmit()}}>
        {theme
        ?<>
        <span onClick={()=>handleSubmit()}>New User</span>
        </>
        :
        <span>Returning User</span>
        }
    </ThemedButton>
    {/* </ThemeContext.Provider> */}
        {
            theme
            ?
                <button style={{backgroundColor:"rgba(100,100,100,0.3)",pointerEvents:"none"}} disabled onClick={() => signIn()}>Awaiting Account</button>
            :
                <button style={{pointerEvents:"auto"}} onClick={() => signIn()}>Sign in</button>
        }
        </ThemeContext.Provider>
        {

        theme
        ?
        <div style={{  display:"flex",flexDirection:"column",paddingLeft: "20%", paddingRight:"20%",paddingTop:"4%"}}>
            <input style={{margin:"1%", minHeight:"36px"}} placeholder="Name" inputref={nameRef}></input>
            <input type="password" style={{margin:"1%", minHeight:"36px"}} placeholder="Pass" inputref={passRef}></input>
            <input type="password" style={{margin:"1%", minHeight:"36px"}} placeholder="Confirm" inputref={passRef2}></input>
        </div>
        :
        null
        }
        </div>
        
    )
}

export async function getStaticProps() {
    const prisma = new PrismaClient();
    const user = await prisma.user.create({
        data: {
          username: String,
          email: String,
          image: String,
        },
      })
    return {
      props: { // This will be sent to the component as props
        user, 
      },
    };
  }