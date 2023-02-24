import React from "react";
import "./Screen.css"
import { Canvas } from "@react-three/fiber";

import NormalMix from "./NormalMix";

const Screen = (screenName) => {

    return (
        <>
            <div className="screenContainer">
                <Canvas
                    camera={{
                        position: [0, 3, 9]
                    }}
                >
                    <color attach={"background"} args={['black']}/>
                    <NormalMix />
                </Canvas>
            </div>
        </>
    )
}

export default Screen