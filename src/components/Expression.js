import React, { useState } from "react";

import { MathComponent } from "mathjax-react";
import './Expression.css'
import useColor from "../hooks/useColor";
import { useEffect } from "react";

const Expression = ({ pieces }) => {
    const [ windowWidth, setWindowWidth] = useState(window.innerWidth)
    const [ visibleHover, setVisibleHover] = useState(-1)
    let scale = window.innerWidth < 350 ? 0.4 : window.innerWidth < 700 ? 0.6 : 1

    const updateWindowWidth = () => {
        setWindowWidth(window.innerWidth)
    }

    useEffect(() => {
        window.addEventListener('resize', updateWindowWidth)
        return () => {
            window.removeEventListener('resize', updateWindowWidth)
        }
    })

    const backgroundColor = useColor('light')

    return (
        <>
            <div className="equation-container" style={{transform: `scale(calc(${scale}))`}}>
                {Array.isArray(pieces) ? pieces.map((val, i) => (
                    <div 
                    key={i}
                    onMouseEnter={() =>  setVisibleHover(i)}
                    onMouseLeave={() => setVisibleHover(-1)}
                    >
                        <MathComponent tex={val.latex}/>
                        {visibleHover === i && val.explanation ? <div className="label" style={{backgroundColor: backgroundColor}}>{val.explanation}</div> : null}
                    </div>
                )) : null}
            </div>
        </>
    )
}

export default Expression