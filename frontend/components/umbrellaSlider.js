import React, {useState,useEffect} from 'react';
import { Range } from 'react-range';

export default function UmbrellaSlider(props) {
    // const [size,setSize] = useState({ values: [10] });

    useEffect(()=>{
        console.log("SIZE IS/... ", props.size.values[0]);
        console.log("SIZE IS type/... ", typeof props.size.values[0]);
        // if(size.values[0]){
            // setTimeout(()=>{
                props.sendMessage("MainCamera","resizeAudioUmbrella",props.size.values[0]);
            // },100);
            // clearTimeout();
        // }
    },[props]);

    return (
        <Range
            id="umbrellaSlider"
            step={1}
            min={1}
            max={100}
            values={props.size.values}
            onChange={(values) => props.handleSetSize(values)}
            renderTrack={({ props, children }) => (
            <div
                {...props}
                style={{
                    ...props.style,
                    height: '6px',
                    width: '16rem',
                    position:"absolute",
                    top: "calc(100% - 12rem)",
                    left: "2rem",
                    backgroundColor: 'rgba(0,0,0,.9)'
                }}
            >
                {children}
            </div>
        )}
        renderThumb={({ props }) => (
            <div
            {...props}
            style={{
                ...props.style,
                pointerEvents:"all",
                height: '24px',
                width: '24px',
                backgroundColor: 'rgb(12, 95, 80)',
                borderRadius:'50%'
            }}
            />
        )}
        />
    );
}