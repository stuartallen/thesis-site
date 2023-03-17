import React from "react"
import './StartVis.css'

const StartVis = ({setVisible, styleClass}) => {
    return (
        <>
            <div className={styleClass}>
                <div className="begin-button" onClick={() => setVisible(true)}>Begin Visualization</div>
            </div>
        </>
    )
}

export default StartVis