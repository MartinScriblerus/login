import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css';

// function RedirectPage({ ctx }) {
//   const router = useRouter()
//   // Make sure we're in the browser
//   if (typeof window !== 'undefined') {
//     router.push('/login');
//     return; 
//   }
// }

// RedirectPage.getInitialProps = ctx => {
//   // We check for ctx.res to make sure we're on the server.
//   if (ctx.res) {
//     ctx.res.writeHead(302, { Location: '/login' });
//     ctx.res.end();
//   }
//   return { };
// }



export default function LogInOutButton() {

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
        <div className={styles.grid}>
            Hello {session.user.name} <br/>
            Signed in as {session.user.email} <br />
            <button onClick={()=> router.push('/')}>Hub</button>
            <button onClick={()=> router.push(`/post/${session.user.name}`)} >Admin</button>
            <button onClick={() => signOut()}>Sign out</button>
        </div>
        )
    } 
    // TO-DO =>     Create else-if condition for whitelisted subusers
    //              and an empty else to default to login failure
    return (
        <>
        Not signed in <br />
        <button onClick={() => signIn()}>Sign in</button>
        </>
    )
}