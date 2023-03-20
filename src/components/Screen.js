import React, { useState } from "react";
import "./Screen.css"
import { Canvas } from "@react-three/fiber";
import { BsFillCCircleFill, BsFillXCircleFill } from 'react-icons/bs/index.js'

import NormalMix from "./scenes/NormalMix";
import LineIntegral from "./scenes/LineIntegral";
import EMVisualization from "./scenes/EMVisualization";
import StartVis from "./StartVis";

const Screen = (scene) => {
    const [visible, setVisible] = useState(false)

    return (
        <>
            <div className="screenContainer">
                {visible ? 
                <>
                    <Canvas
                        camera={{
                            position: [0, 3, 9]
                        }}
                    >
                        <color attach={"background"} args={['black']}/>
                        {scene.scene === "normalMix" ?
                            <NormalMix /> :
                            scene.scene === "lineIntegral" ? 
                                <LineIntegral /> :
                                scene.scene === "emVisualization" ? 
                                    <EMVisualization />:
                                    null
                        }
                    </Canvas>
                    <div className="stopButtonContainer">
                        <BsFillXCircleFill className="stopButton" onClick={() => setVisible(false)}/>
                    </div>
                </>
                :
                <StartVis setVisible={setVisible}/>
                }
            </div>
        </>
    )
}

export default Screen