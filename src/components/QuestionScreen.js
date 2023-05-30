import React from "react"
import './QuestionScreen.css'
import { Canvas } from "@react-three/fiber";

import TrueCovarianceDemo from "./scenes/TrueCovarianceDemo";
import FalseCovarianceDemo from "./scenes/FalseCovarianceDemo";
import SingularityDemo from "./scenes/SingularityDemo";
import ClusterNumberDemo from "./scenes/ClusterNumberDemo";
import ChoosePath from "./scenes/ChoosePath";
import useColor from "../hooks/useColor";
import TrueSingularityDemo from "./scenes/TrueSingularityDemo";
import TrueClusterNumberDemo from "./scenes/TrueClusterNumberDemo";

const QuestionScreen = ({visualName, visible, setVisible, column}) => {

    return (
        <>
            <div className="visual" style={{flexDirection: column ? 'column' : 'row'}}>
                {visualName === 'covarianceDemo' ?
                    <>
                        <Canvas
                        camera={{
                            position: [0, 3, 9]
                        }}
                        >
                            <TrueCovarianceDemo />
                        </Canvas> 
                        <Canvas
                        camera={{
                            position: [0, 3, 9]
                        }}
                        >
                            <FalseCovarianceDemo />
                        </Canvas> 
                    </>
                : visualName === 'singularityDemo' ?
                    <>
                        <Canvas
                        camera={{
                            position: [0, 3, 9]
                        }}
                        >
                            <SingularityDemo />
                        </Canvas> 
                        <Canvas
                        camera={{
                            position: [0, 3, 9]
                        }}
                        >
                            <TrueSingularityDemo />
                        </Canvas> 
                    </>
                : visualName === 'clusterNumberDemo' ?
                    <>
                        <Canvas
                        camera={{
                            position: [0, 3, 9]
                        }}
                        >
                            <ClusterNumberDemo />
                        </Canvas> 
                        <Canvas
                        camera={{
                            position: [0, 3, 9]
                        }}
                        >
                            <TrueClusterNumberDemo />
                        </Canvas> 
                    </>
                : visualName === 'choosePath' ? 
                    <>
                        <Canvas
                        camera={{
                            position: [0, 3, 9]
                        }}
                        >
                            <ChoosePath />
                        </Canvas> 
                    </>
                : null}
            </div>
        </>
    )
}

export default QuestionScreen