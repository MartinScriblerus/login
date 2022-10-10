import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Post = () => {
    const [ pidAdmin, setPidAdmin ] = useState('');
  const router = useRouter();
    useEffect(()=>{
        if(!router.isReady) return;
        else {
            // console.log("THIS IS GOOD ", router.query.pidAdmin)
            if(router.query.pidAdmin && pidAdmin !== router.query.pidAdmin){
                setPidAdmin(router.query.pidAdmin);
            }
        }
    }, [router.isReady, router.query.pidAdmin, setPidAdmin]);

    return (
        <h2>Hello admin {pidAdmin}</h2>
    )
}

export default Post