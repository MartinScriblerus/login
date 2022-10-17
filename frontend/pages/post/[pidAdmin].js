import { useRouter } from 'next/router';
import Head from 'next/head';
import { useEffect, useState, useRef } from 'react';
import styles from '../../styles/Admin.module.css'
import { useSession } from "next-auth/react";

const Post = (props) => {
    
    const session = useSession();
    const router = useRouter();

    console.log("pr")

    //console.log("WHAT is session?????? ", session);

   // const [ subusersData, setSubusersData ] = useState([]); 
    const [ pidAdmin, setPidAdmin ] = useState('');
    const [ username,setUsername] = useState('');
    const subuserNameRef = useRef('');
    const subuserNameDeleteRef = useRef('')
    let public_url = process.env.PUBLIC_URL;

    const subusersData = useRef([])

    useEffect(()=>{
        if(!router.isReady) return;
        else {
            if(session.length > 0 && session.data && session.data.user && Object.values(session.data.user).length){
                setUsername(session.data.user.name);
                console.log("user name: ", username);
                let user = prisma.users.findMany({select:{subusers_array:true}});
                console.log("USER DATA FOR SUBUSER DISPLAY");
            }
            console.log("LOOK HERE ", router)
            // console.log("THIS IS GOOD ", router.query.pidAdmin)
            if(router.query.pidAdmin && pidAdmin !== router.query.pidAdmin){
                if(router.query.pidAdmin.indexOf("_") !== -1){
                    setUsername(router.query.pidAdmin.replace("_"," "));
                } else {
                    setUsername(router.query.pidAdmin)
                }
                
                
                setPidAdmin(router.query.pidAdmin);
            }
        }
    }, [pidAdmin, router, router.isReady, router.query.pidAdmin, setPidAdmin, username, session]);


    function handleAddSubuser(){
        let subuserName = document.getElementById("name_NewSubuserRegistration");
        if(subuserName){
            subuserNameRef.current = subuserName.value;
            subuserName.value = '';
            //console.log("subuser name ref: ", subuserNameRef.current);
        }
        console.log("in handle add subuser: ", username);
        let objectWithData = {
            user_name: username,
            // email: email,
            subuserName:subuserNameRef.current
        }
        console.log("an object with data: ", objectWithData);
       
        if(objectWithData.user_name){
            try{
                fetch('/api/addSubuser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': '*',
                    },
                    body: objectWithData.toSString(),
                }).then(async response => {
               
                        const data = await response;
                        // try to add subuser data 
                        if(data){
                        // setSubusersData(data);
                            subusersData.current = data;
                            console.log("curr subusers: ", subusersData.current);
                        }
                        console.log('response data after addd user: ', data);
                        if(data){
                            alert(`added subuser: ${subusersData.current.toString()}`)
                        }
                        return data;
                    // } catch(error) {
                    //     console.log('Error fetching from subusers api!')
                    //     console.error(error)
                    // }
                })
            } catch(e){
                console.log("e: ", e)
                return null;
            } finally{
                // console.log("trying to add new subuser");

               // console.log("subusers data: ", subusersData.current);
                // return;
            }

        }
        // return subuserName;
    }
  
    async function handleDeleteSubuser(){
        let subuserName = document.getElementById("name_NewSubuserDelete");
        if(subuserName){
            subuserNameDeleteRef.current = subuserName.value;
            subuserName.value = '';
            //console.log("subuser name ref: ", subuserNameDeleteRef.current);
        }
        //console.log("in handle add subuser: ", username);
        let objectWithData = {
            user_name: username,
            // email: email,
            subuserName:subuserNameDeleteRef.current
        }

        let ok = await fetch('/api/deleteSubuser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': '*',
            },
            body: JSON.stringify(objectWithData),
        }).then(data=>{
            console.log("deeleted subuser: ", data);

            // try to set subuser data
            // if(data){
            //     setSubusersData(data);
            // }

        })
        console.log("trying to delete a subuser ", ok);
    

    }

    function handleSubuserNameUpdate(){
        console.log(subuserNameRef.current)
    };
    function handleSubuserNameDelete(){
        console.log(subuserNameRef.current)
    }; 

    // useEffect(()=>{
    //     console.log("SUBUSERS!!! ", subusersData);
    // })[subusersData]
        

    return (
        <>
        <Head>
            <title>{username}</title>
            <meta name="description" content="Generated by create next app" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <h2 style={{textAlign:"center",position:"relative",marginTop:"12vh",fontSize:"48px", flexFlow: "column", display: "flex", flexDirection: "column"}}>Hello admin <span style={{color:"rgba(225,70,80,.9)"}}>{pidAdmin}</span></h2>
        <button id="adminBackBtn" style={{position:"absolute",right:"0px",top:"0px",height:"8px",width:"12px",background:"transparent",color:"rgba(255,255,255,.8)"}} onClick={()=> router.push(`/`)}><span style={{background:"transparent"}}>&#11013;</span>  Back</button>
        <div style={{display:"flex", flexDirection:"column", width:"100%",alignItems:"center",justifyContent:"center"}}>
            <input maxLength={32} id="name_NewSubuserRegistration" style={{position: "relative",minWidth:"232px"}} inputref={subuserNameRef} onChange={()=>{handleSubuserNameUpdate()}}/>
            <label style={{color:"rgba(255,255,255,0.78)"}}>Subuser Name</label>
            <button id="adminAddSubuserBtn" onClick={()=> {handleAddSubuser()}} style={{paddingLeft:"10%",paddingRight:"10%"}}>Add Subuser</button>
            
            <input maxLength={32} id="name_NewSubuserDelete" style={{position: "relative",minWidth:"232px"}} inputref={subuserNameDeleteRef} onChange={()=>{handleSubuserNameDelete()}}/>
            <label style={{color:"rgba(255,255,255,0.78)"}}>Name to Delete</label>
            
            <button id="adminDeleteSubuserBtn" onClick={()=> {handleDeleteSubuser()}} style={{paddingLeft:"10%",paddingRight:"10%"}}>Delete Subuser</button>
        </div>
        </>
    )
}
export default Post;




