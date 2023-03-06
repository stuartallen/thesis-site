import { useState } from "react";
import './Question.css'
import Option from "./Option";
import Expression from "./Expression";
import { Canvas } from "@react-three/fiber";

import TrueCovarianceDemo from "./scenes/TrueCovarianceDemo";
import FalseCovarianceDemo from "./scenes/FalseCovarianceDemo";
import SingularityDemo from './scenes/SingularityDemo'
import ClusterNumberDemo from "./scenes/ClusterNumberDemo";

export default function Question({question, eqPieces, visual, options, expandedOptions, correctness}) {
    const [selected, setSelected] = useState(-1)

    return (<>
        <div className="questionContainer">
            <div>{question}</div>
            <Expression pieces={eqPieces}/>
            {visual ? 
                visual == 'covarianceDemo' ? 
                    <div className="visual">
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
                    </div>
                : visual == 'singularityDemo' ? 
                    <div className="visual">
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
                    </div>
                : visual == 'clusterNumberDemo' ?
                    <div className="visual">
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
                    </div>
                : visual == 'kmeans' ? 
                    <img src={'/clusters.jpg'} />
                : null
            : null}
            <div className="optionsContainer">
                {options.map((text, key) => 
                    <Option 
                        key={key} 
                        text={text} 
                        expanded={key == selected} 
                        expandedText={expandedOptions[key]} 
                        correctness={correctness[key]}
                        setSelected={() => setSelected(key)}> 
                    </Option>)}
            </div>
        </div>
    </>)
}