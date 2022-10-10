import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css';
import axios from 'axios';

// function  onSubmit (value) {
//     console.log("VAL ", value)
//     let data={content : value}
//     axios.post('/api/post', data)
//     .then((response) => {
//         console.log(response)
//     })
//     .catch((e) => { console.log(e)}
// )}

export default function LogInOutButton() {
    // onSubmit();
    const router = useRouter();

    // TO-DO => Create new variable checking whether client is whitelisted as a sub-user  

    const { data: session } = useSession();

    if (session) {

        console.log('in login-btn SESSH', session);
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
            Signed in.... as {session.user.email} <br />
            <div id="horizontalRow">
                <button onClick={()=> router.push('/')}>Hub</button>
                <button onClick={()=> router.push(`/post/${session.user.name}`)} >Admin</button>
                <button onClick={() => signOut()}>Sign out</button>
            </div>
        </div>
        )
    } 
    // TO-DO =>     Create else-if condition for whitelisted subusers
    //              and an empty else to default to login failure
    return (
        <>
        {/* Not signed in <br /> */}
        <button onClick={() => signIn()}>Signs in</button>
        </>
    )
}