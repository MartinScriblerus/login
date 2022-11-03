import { Router, useRouter } from 'next/router'

export default function CardboardVr(){
    
    const router = useRouter();
    
    function enterCardVr(){
        router.push('/');
    }
    
    return(
        <>
            <h1>In Cardboard VR</h1>
            <button onClick={enterCardVr}>Back</button>
        </>
    )
}