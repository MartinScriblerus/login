import React, {useState,useEffect} from 'react';
import { Range } from 'react-range';

export default function UmbrellaSlider(props) {
    const [size,setSize] = useState({ values: [10] });

    useEffect(()=>{
        console.log("SIZE IS/... ", size.values[0]);
        console.log("SIZE IS type/... ", typeof size.values[0]);
        // if(size.values[0]){
            // setTimeout(()=>{
                props.sendMessage("MainCamera","resizeAudioUmbrella",size.values[0]);
            // },100);
            // clearTimeout();
        // }
    },[size,props]);

    return (
        <Range
            id="umbrellaSlider"
            step={1}
            min={1}
            max={20}
            values={size.values}
            onChange={(values) => setSize({ values })}
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
                backgroundColor: '#501214',
                borderRadius:'50%'
            }}
            />
        )}
        />
    );
}