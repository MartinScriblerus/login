import { useSession, signIn, signOut } from "next-auth/react";

export default function LogInOutButton() {

    const { data: session } = useSession()
    if(session){
        console.log('in login-btn', session);
    }
    if (session) {
        return (
        <>
            Hello {session.user.name} <br/>
            Signed in as {session.user.email} <br />
            <button onClick={() => signOut()}>Sign out</button>
        </>
        )
    }
    return (
        <>
        Not signed in <br />
        <button onClick={() => signIn()}>Sign in</button>
        </>
    )
}