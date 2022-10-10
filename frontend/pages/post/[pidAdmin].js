import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Post = () => {
    const [ pidAdmin, setPidAdmin ] = useState('');
  const router = useRouter();
    useEffect(()=>{
        if(!router.isReady) return;
        else {
            console.log("THIS IS GOOD ", router.query)
            setPidAdmin(router.query.pidAdmin);
        }
    }, [router.isReady, router.query, setPidAdmin, pidAdmin]);

    return (
        <h2>Hello admin {pidAdmin}</h2>
    )
}


export default Post