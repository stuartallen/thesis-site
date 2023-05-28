import { useState } from "react";

import './Question.css'
import Option from "./Option";
import Expression from "./Expression";
import QuestionScreen from "./QuestionScreen";

export default function Question({question, eqPieces, visual, options, expandedOptions, correctness}) {
    const [selected, setSelected] = useState(-1)
    const [visible, setVisible] = useState(false)

    const scale = window.innerWidth < 500 ? 0.3 : window.innerWidth < 1000 ? 0.6 : 1

    return (<>
        <div className="questionContainer">
            <div>{question}</div>
            <Expression pieces={eqPieces}/>
            {visual ? 
                visual == 'kmeans' ? 
                    <img src={'/newClusters.jpg'} style={{transform: `scale(${scale})`}}/>
                : <QuestionScreen visualName={visual} visible={visible} setVisible={setVisible}/>
            : null}
            <div className="optionsContainer" style={{
                flexDirection: options.length === 2 ? 'row' : 'column', 
                justifyContent: options.length === 2 ? 'space-between' : null
            }}>
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