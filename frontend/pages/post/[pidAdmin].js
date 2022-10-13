import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import styles from '../../styles/Admin.module.css'
import { useSession } from "next-auth/react";

const Post = (props) => {
    
    const session = useSession();
    const router = useRouter();

    console.log("WHAT is session?????? ", session);

    const [ subusersData, setSubusersData ] = useState([]); 
    const [ pidAdmin, setPidAdmin ] = useState('');
    const [ username,setUsername] = useState('');
    const subuserNameRef = useRef('');
  
    useEffect(()=>{
        if(!router.isReady) return;
        else {
            if(session.length > 0 && session.data && session.data.user && Object.values(session.data.user).length){
                setUsername(session.data.user.name);
                console.log("subuser name: ", username);
                
            }
            console.log("LOOK HERE ", router)
            console.log("THIS IS GOOD ", router.query.pidAdmin)
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

    // fetch('http://localhost:3000/api/getAllSubusers', {
    //     method: 'GET',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    // }).then(response=>console.log("RESPONSEEEEE ", response));


    function handleAddSubuser(){
        let subuserName = document.getElementById("name_NewSubuserRegistration");
        if(subuserName){
            subuserNameRef.current = subuserName.value;
            console.log("subuser name ref: ", subuserNameRef.current);
        }
        console.log("in handle add subuser: ", username);
        let objectWithData = {
            user_name: username,
            // email: email,
            subuserName:subuserNameRef.current
        }
        console.log("an object with data: ", objectWithData);
        if(objectWithData.user_name){
            fetch('http://localhost:3000/api/addSubuser', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(objectWithData),
            }).then(response => {
                // res.statusCode = 200
                // res.setHeader('Content-Type', 'application/json');
                // res.setHeader('Cache-Control', 'max-age=180000');
                // res.end(JSON.stringify(response));
                // resolve();
                console.log("reeeeeesponse: ", response);
            })
            .catch(error => {
                console.log("err: ", error);
            });
            console.log("trying to add new subuser");
        }
        return subuserName;
    }
  
    function handleDeleteSubuser(user_name,email,subuserName){
        console.log("in handle delete subuser: ", user_name);
        let objectWithData = {
       
                user_name: user_name,
                email: email,
                subuserName:subuserName
    
        }
        console.log("an object with data: ", objectWithData);
        fetch('http://localhost:3000/api/deleteSubuser', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(objectWithData),
        }).then(response => {
            // res.statusCode = 200
            // res.setHeader('Content-Type', 'application/json');
            // res.setHeader('Cache-Control', 'max-age=180000');
            // res.end(JSON.stringify(response));
            // resolve();
            console.log("response is./... ", response);
          })
          .catch(error => {
            console.log("errrrr ", error)
            // res.json(error);
            // res.status(405).end();
            // resolve(); // in case something goes wrong in the catch block (as vijay commented)
          });
        console.log("trying to delete a subuser");

    }

    function handleSubuserNameUpdate(){

    };

    function handleSelect(){

    }

    console.log("WHAT IS SUBUSERS DATA??? ", subusersData);

    return (
        <>
        <h2 style={{textAlign:"center",position:"relative",fontSize:"64px"}}>Hello admin {pidAdmin}</h2>
        <button id="adminBackBtn" style={{position:"absolute",right:"0px",top:"0px",height:"24px",width:"64px",background:"transparent",color:"rgba(255,255,255,.8)"}} onClick={()=> router.push('/')}>Back</button>
        <div style={{display:"flex", flexDirection:"column", width:"100%",alignItems:"center",justifyContent:"center"}}>
            <input maxLength={32} id="name_NewSubuserRegistration" style={{position: "relative",minWidth:"232px"}} inputref={subuserNameRef} onChange={()=>{handleSubuserNameUpdate()}}/>
            <label style={{color:"rgba(255,255,255,0.78)"}}>Subuser Name</label>
            <button id="adminAddSubuserBtn" onClick={()=> {handleAddSubuser()}} style={{paddingLeft:"10%",paddingRight:"10%"}}>Add Subuser</button>
            <select id="subusersSelect" onChange={handleSelect} style={{minHeight:"32px", minWidth:"240px"}}>
                <option default key={"Subusers"} value={"Subusers"}>--- subusers ---</option>
                {subusersData.map((item) =>
               
                item.subusers_array.map((subuser) => (
                    <option key={subuserNameRef} value={subuserNameRef}>
                    {subuser}
                    </option>
                ))
                )}
      
            </select>
            <button id="adminDeleteSubuserBtn" onClick={()=> {handleDeleteSubuser()}} style={{paddingLeft:"10%",paddingRight:"10%"}}>Delete Subuser</button>
        </div>
        </>
    )
}

export default Post