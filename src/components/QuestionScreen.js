import React from "react"
import './QuestionScreen.css'
import StartVis from "./StartVis"
import { BsFillXCircleFill } from "react-icons/bs";
import { Canvas } from "@react-three/fiber";

import TrueCovarianceDemo from "./scenes/TrueCovarianceDemo";
import FalseCovarianceDemo from "./scenes/FalseCovarianceDemo";
import SingularityDemo from "./scenes/SingularityDemo";
import ClusterNumberDemo from "./scenes/ClusterNumberDemo";

const QuestionScreen = ({visualName, visible, setVisible}) => {
    return (
        <>
            <div className="visual">
                {!visible ? 
                    <div className="start-vis-container">
                        <StartVis setVisible={setVisible}/>
                    </div>
                : visualName === 'covarianceDemo' ?
                    <>
                        <Canvas
                        camera={{
                            position: [0, 3, 9]
                        }}
                        >
                            <color attach={"background"} args={['black']}/>
                            <TrueCovarianceDemo />
                        </Canvas> 
                        <Canvas
                        camera={{
                            position: [0, 3, 9]
                        }}
                        >
                            <color attach={"background"} args={['black']}/>
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
                            <color attach={"background"} args={['black']}/>
                            <SingularityDemo />
                        </Canvas> 
                        <Canvas
                        camera={{
                            position: [0, 3, 9]
                        }}
                        >
                            <color attach={"background"} args={['black']}/>
                            <TrueCovarianceDemo />
                        </Canvas> 
                    </>
                : visualName === 'clusterNumberDemo' ?
                    <>
                        <Canvas
                        camera={{
                            position: [0, 3, 9]
                        }}
                        >
                            <color attach={"background"} args={['black']}/>
                            <ClusterNumberDemo />
                        </Canvas> 
                        <Canvas
                        camera={{
                            position: [0, 3, 9]
                        }}
                        >
                            <color attach={"background"} args={['black']}/>
                            <TrueCovarianceDemo />
                        </Canvas> 
                    </>
                : null}
                {visible ? 
                    <div className="stopButtonContainer">
                        <BsFillXCircleFill className="stopButton" onClick={() => setVisible(false)}/>
                    </div>
                : null}
            </div>
        </>
    )
}

export default QuestionScreen