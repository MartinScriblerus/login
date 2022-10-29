import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function LoadingBar(props){
    console.log("Loading Prog: ", props);
    let value = props.loadingProgression;
    return (
        <span style={{position:"absolute",width:"16rem", height:"9rem",left: "calc(50% - 8rem)",top:"calc(50% - 8rem)",zIndex:"9999", background:"transparent"}}>
            {/* <span style={{position:"absolute",paddingLeft:`${20 * (16/9)}vw`,width:`${100 - (40 * (16/9))}vw`,paddingTop:"20vh", height:"60vh"}}> */}
                <CircularProgressbar style={{position:"relative", fontSize:"32px"}} value={value} maxValue={1} text={`${value * 100}%`} />
            {/* </span> */}
        </span>
    )
}