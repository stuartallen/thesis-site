export default function Option({text, expanded, expandedText, correctness, setSelected}) {
    return (<>
        <div onClick={setSelected} className="option" style={expanded ? {backgroundColor: `${correctness ? 'green' : 'red'}`}: {}}>
            {text}
            {expanded ? <div>{expandedText}</div> : null}
        </div>
    </>)
}