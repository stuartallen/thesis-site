import React, { useEffect, useState } from "react";
import "./Screen.css"
import { Canvas } from "@react-three/fiber";

import NormalMix from "./scenes/NormalMix";
import LineIntegral from "./scenes/LineIntegral";
import EMVisualizationWrapper from "./EMVisualizationWrapper";
import SingleGaussian from "./scenes/SingleGaussian";
import useColor from "../hooks/useColor";

const Screen = ({scene}) => {
    const [needsLoadEMVis, setNeedsLoadEMVis] = useState(false)

    const Loading = () => {
        useEffect(() => setNeedsLoadEMVis(false), [])

        return (
            <div>Reloading...</div>
        )
    }

    const backgroundColor = useColor('light')
    const borderColor = useColor('dark')

    return (
        <>
            <div className="screenContainer" style={{backgroundColor: backgroundColor, borderColor: borderColor}}>
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
                            <color attach={"background"} args={[backgroundColor]}/>
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