import React, { useEffect, useState } from "react";
import "./Screen.css"
import { Canvas } from "@react-three/fiber";

import NormalMix from "./scenes/NormalMix";
import LineIntegral from "./scenes/LineIntegral";
import EMVisualizationWrapper from "./EMVisualizationWrapper";
import SingleGaussian from "./scenes/SingleGaussian";
import useColor from "../hooks/useColor";
import EMVWrapper from "./EMVWrapper";
import TitleImage from "./scenes/TitleImage";

const Screen = ({scene}) => {
    const [needsLoadEMVis, setNeedsLoadEMVis] = useState(false)

    const Loading = () => {
        useEffect(() => setNeedsLoadEMVis(false), [])

        return (
            <div>Reloading...</div>
        )
    }

    const borderColor = useColor('dark')

    return (
        <>
            <div className="screenContainer" style={{borderColor: borderColor}}>
                    {scene === "emVisualization" ? 
                        needsLoadEMVis ? 
                            <Loading /> :
                            <EMVWrapper setNeedsLoadEMVis={setNeedsLoadEMVis}/>
                    :
                    <>
                        <Canvas
                            camera={{
                                position: [0, 3, 9]
                            }}
                        >
                            {scene === "normalMix" ?
                                <NormalMix /> :
                                scene === "lineIntegral" ? 
                                    <LineIntegral /> :
                                        scene === "singleGaussian" ? 
                                            <SingleGaussian covariance={[1.0, 0.0, 0.0, 1.0]} /> : 
                                                scene === "singleGaussianDiagonal" ? 
                                                    <SingleGaussian covariance={[4.0, -1.0, 2.0, 3.0]} /> :
                                                        scene === 'titleImage' ? 
                                                            <TitleImage/> : 
                                                            null
                            }
                        </Canvas>
                    </>}
            </div>
        </>
    )
}

export default Screen