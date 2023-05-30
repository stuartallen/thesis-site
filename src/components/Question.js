import { useState, useEffect } from "react";

import './Question.css'
import Option from "./Option";
import Expression from "./Expression";
import QuestionScreen from "./QuestionScreen";

const MIN_SIDE_TO_SIDE_WIDTH = 700

export default function Question({question, eqPieces, visual, options, expandedOptions, correctness, isChromeMobile, setRenderedCanvas, canvasNum, renderedCanvas}) {
    const [selected, setSelected] = useState(-1)
    const [visible, setVisible] = useState(false)
    const [ windowWidth, setWindowWidth] = useState(window.innerWidth)

    const updateWindowWidth = () => {
        setWindowWidth(window.innerWidth)
    }

    useEffect(() => {
        window.addEventListener('resize', updateWindowWidth)
        return () => {
            window.removeEventListener('resize', updateWindowWidth)
        }
    })

    if(options.length == 2) {
        options = windowWidth < MIN_SIDE_TO_SIDE_WIDTH && visual != 'kmeans' ? ['Top', 'Bottom'] : ['Left', 'Right']
    }

    return (<>
        <div className="questionContainer">
            <div>{question}</div>
            <Expression pieces={eqPieces}/>
            {visual ? 
                visual == 'kmeans' ? 
                    <img src={'/newClusters.jpg'} className="questionImg"/>
                : <QuestionScreen 
                    visualName={visual} 
                    visible={visible} 
                    setVisible={setVisible} 
                    column={windowWidth < MIN_SIDE_TO_SIDE_WIDTH && visual != 'kmeans'} 
                    isChromeMobile={isChromeMobile} 
                    setRenderedCanvas={setRenderedCanvas}
                    canvasNum={canvasNum}
                    renderedCanvas={renderedCanvas}
                    />
            : null}
            <div className="optionsContainer" style={{
                flexDirection: visual == 'kmeans' || options.length === 2 && windowWidth > MIN_SIDE_TO_SIDE_WIDTH ? 'row' : 'column',
                alignItems: visual == 'kmeans' || windowWidth > MIN_SIDE_TO_SIDE_WIDTH ? 'start' : 'center'
            }}>
                {options.map((text, key) => 
                    <Option 
                        key={key} 
                        text={text} 
                        expanded={key == selected} 
                        expandedText={expandedOptions[key]} 
                        correctness={correctness[key]}
                        setSelected={() => setSelected(key)} 
                        >
                    </Option>)}
            </div>
        </div>
    </>)
}