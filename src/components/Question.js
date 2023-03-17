import { useState } from "react";
import './Question.css'
import Option from "./Option";
import Expression from "./Expression";
import { Canvas } from "@react-three/fiber";

import TrueCovarianceDemo from "./scenes/TrueCovarianceDemo";
import FalseCovarianceDemo from "./scenes/FalseCovarianceDemo";
import SingularityDemo from './scenes/SingularityDemo'
import ClusterNumberDemo from "./scenes/ClusterNumberDemo";
import QuestionScreen from "./QuestionScreen";

export default function Question({question, eqPieces, visual, options, expandedOptions, correctness}) {
    const [selected, setSelected] = useState(-1)
    const [visible, setVisible] = useState(false)

    return (<>
        <div className="questionContainer">
            <div>{question}</div>
            <Expression pieces={eqPieces}/>
            {visual ? 
                visual == 'kmeans' ? 
                    <img src={'/clusters.jpg'} />
                : <QuestionScreen visualName={visual} visible={visible} setVisible={setVisible}/>
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