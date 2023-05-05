import React, { useEffect, useState } from "react";
import "./Screen.css"
import { Canvas } from "@react-three/fiber";

import NormalMix from "./scenes/NormalMix";
import LineIntegral from "./scenes/LineIntegral";
import EMVisualizationWrapper from "./EMVisualizationWrapper";
import SingleGaussian from "./scenes/SingleGaussian";

const Screen = ({scene}) => {
    const [needsLoadEMVis, setNeedsLoadEMVis] = useState(false)

    const Loading = () => {
        useEffect(() => setNeedsLoadEMVis(false), [])

        return (
            <div>Reloading...</div>
        )
    }

    return (
        <>
            <div className="screenContainer">
                    {scene === "emVisualization" ? 
                        needsLoadEMVis ? 
                            <Loading /> :
                            <EMVisualizationWrapper setNeedsLoadEMVis={setNeedsLoadEMVis}/>
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
                                        scene === "singleGaussian" ? 
                                            <SingleGaussian covariance={[1.0, 0.0, 0.0, 1.0]} /> : 
                                                scene === "singleGaussianDiagonal" ? 
                                                    <SingleGaussian covariance={[4.0, -1.0, 2.0, 3.0]} />
                                                    : null
                            }
                        </Canvas>
                    </>}
            </div>
        </>
    )
}

export default Screen