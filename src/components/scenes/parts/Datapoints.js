export default function Datapoints({dataset}) {
    return (<>
        {dataset.map((dataVal, i) => (
            <points key={i}>
                <bufferGeometry>
                    <bufferAttribute 
                        attach={"attributes-position"}
                        array={new Float32Array([dataVal[0][0], 0, dataVal[0][1]])}
                        count={1}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial color={dataVal[1]} sizeAttenuation={false} size={10}/>
            </points>
        ))}
    </>)
}