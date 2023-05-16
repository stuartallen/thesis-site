import React, { useEffect } from 'react'
import useColor from '../hooks/useColor'
import './Option.css'

export default function Option({text, expanded, expandedText, correctness, setSelected}) {
    const correctColor = useColor('good')
    const incorrectColor = useColor('bad')

    const hoverColor = useColor('neutral')

    useEffect(() => {
        document.documentElement.style.setProperty('--hover-color', hoverColor)
    }, [])

    return (<>
        <div onClick={setSelected} className="option" style={expanded ? {backgroundColor: `${correctness ? correctColor : incorrectColor}`}: {}}>
            {text}
            {expanded ? <div className='expandedText'>{expandedText}</div> : null}
        </div>
    </>)
}