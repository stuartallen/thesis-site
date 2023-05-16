import React, { useState } from "react";

import { MathComponent } from "mathjax-react";
import './Expression.css'
import useColor from "../hooks/useColor";

const Expression = ({ pieces }) => {
    const [ visibleHover, setVisibleHover] = useState(-1)
    const scale = window.innerWidth < 500 ? 0.3 : window.innerWidth < 1000 ? 0.6 : 1

    const backgroundColor = useColor('light')

    return (
        <>
            <div className="equation-container" style={{transform: `scale(${scale})`}}>
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