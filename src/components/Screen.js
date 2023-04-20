import React, { useState } from "react";
import "./Screen.css"
import { Canvas } from "@react-three/fiber";
import { BsFillCCircleFill, BsFillXCircleFill } from 'react-icons/bs/index.js'

import NormalMix from "./scenes/NormalMix";
import LineIntegral from "./scenes/LineIntegral";
import EMVisualization from "./scenes/EMVisualization";
import StartVis from "./StartVis";
import EMVisualizationWrapper from "./EMVisualizationWrapper";

const Screen = ({scene}) => {
    const [visible, setVisible] = useState(false)

    return (
        <>
            <div className="screenContainer">
                {visible ? 
                    scene === "emVisualization" ? 
                        <EMVisualizationWrapper visible={visible} setVisible={setVisible}/>
                    :
                    <>
                        <Canvas
                            camera={{
                                position: [0, 3, 9]
                            }}
                        >
                            <color attach={"background"} args={['#f7eedf']}/>
                            {scene === "normalMix" ?
                                <NormalMix /> :
                                scene === "lineIntegral" ? 
                                    <LineIntegral /> :
                                    null
                            }
                        </Canvas>
                        <div className="stopButtonContainer">
                            <BsFillXCircleFill className="stopButton" color="#302f2f" onClick={() => setVisible(false)}/>
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