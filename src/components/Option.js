import './Option.css'

export default function Option({text, expanded, expandedText, correctness, setSelected}) {
    return (<>
        <div onClick={setSelected} className="option" style={expanded ? {backgroundColor: `${correctness ? '#BFEBCD' : '#BFA1B4'}`}: {}}>
            {text}
            {expanded ? <div>{expandedText}</div> : null}
        </div>
    </>)
}