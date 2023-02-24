import React from "react";
import "./Screen.css"
import { Canvas } from "@react-three/fiber";

import NormalMix from "./scenes/NormalMix";
import LineIntegral from "./scenes/LineIntegral";

const Screen = (scene) => {
    console.log(scene.scene)

    return (
        <>
            <div className="screenContainer">
                <Canvas
                    camera={{
                        position: [0, 3, 9]
                    }}
                >
                    <color attach={"background"} args={['black']}/>
                    {scene.scene == "normalMix" ?
                        <NormalMix /> :
                        scene.scene == "lineIntegral" ? <LineIntegral /> :
                        null
                    }
                </Canvas>
            </div>
        </>
    )
}

export default Screen