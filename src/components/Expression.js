import React, { useState } from "react";
import { MathComponent } from "mathjax-react";
import './Expression.css'

const Expression = ({ pieces }) => {
    const [ visibleHover, setVisibleHover] = useState(-1)

    return (
        <>
            <div className="equation-container">
                {Array.isArray(pieces) ? pieces.map((val, i) => (
                    <div 
                    key={i}
                    onMouseEnter={() =>  setVisibleHover(i)}
                    onMouseLeave={() => setVisibleHover(-1)}
                    >
                        <MathComponent tex={val.latex}/>
                        {visibleHover == i && val.explanation ? <div className="label">{val.explanation}</div> : null}
                    </div>
                )) : null}
            </div>
        </>
    )
}

export default Expression