import React, { useEffect } from 'react'
import useColor from '../hooks/useColor'
import './Option.css'
import hexToRGB from '../utils/hexToRGB'

export default function Option({text, expanded, expandedText, correctness, setSelected}) {
    const correctColor = hexToRGB(useColor('cluster1'))
    const incorrectColor = hexToRGB(useColor('cluster3'))

    const hoverColor = hexToRGB(useColor('neutral'))

    useEffect(() => {
        document.documentElement.style.setProperty('--hover-color', `rgba(${255 * hoverColor[0]}, ${255 * hoverColor[1]}, ${255 * hoverColor[2]}, 0.4)`)
    }, [])

    return (<>
        <div onClick={setSelected} 
            className="option" 
            style={expanded ? 
                {backgroundColor: `${correctness ? `rgba(${255 * correctColor[0]}, ${255 * correctColor[1]}, ${255 * correctColor[2]}, 0.2)` 
                : `rgba(${255 *incorrectColor[0]}, ${255 * incorrectColor[1]}, ${255 * incorrectColor[2]}, 0.2)`}`}: {}}>
            <div>{text}</div>
            {expanded ? <div    className='expandedText' >
                            {expandedText}
                        </div> : 
                        null}
        </div>
    </>)
}