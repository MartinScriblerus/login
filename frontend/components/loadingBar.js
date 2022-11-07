import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function LoadingBar(props){
    //console.log("Loading Prog $$: ", typeof props.loadingProgression);
    let value = 0;
    if(props.loadingProgression && props.loadingProgression > 0){
        value = parseFloat(props.loadingProgression).toFixed(2);
    }
    
    return (
        <>
            <h1 style={{width:"100%", top:"12rem", textAlign:"center"}}>Loading...</h1>
            <span style={{position:"absolute",width:"8rem", height:"4.5rem",left: "calc(50% - 4rem)",top:"calc(50% - 8rem)",zIndex:"9999", background:"transparent"}}>
                <CircularProgressbar 
                    style={{
                        fill:"#000",
                        stroke:"#aaf",
                        textAlign:"center",
                        justifyContent:"center",
                        alignItems:"center",
                        fontSize:"24px",color:"#501214"}} 
                        value={value} 
                        maxValue={1} 
                        text={`${value * 100}%`} />
            </span>
        </>
    )
}