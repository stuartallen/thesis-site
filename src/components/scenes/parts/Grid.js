import * as THREE from 'three'
import React from "react";
import useColor from "../../../hooks/useColor";
import hexToRGB from '../../../utils/hexToRGB';

const Grid = () => {
    const gridColor = new THREE.Color(0, 0, 0, 0.25) 

    const SIDE_LEN = 10

    const y_lines = []
    for(let i = 0; i < SIDE_LEN + 1; i++) {
        y_lines.push(
            <mesh key={i} rotation-x={Math.PI * 0.5} position-x={-5 + i}>
                <boxGeometry args={[0.01, 10, 0.01]}/>
                <meshBasicMaterial color={gridColor} />
            </mesh>
        )
    }

    const x_lines = []
    for(let i = 0; i < SIDE_LEN + 1; i++) {
        x_lines.push(
            <mesh key={i} rotation-x={Math.PI * 0.5} position-z={-5 + i}>
                <boxGeometry args={[10, 0.01, 0.01]}/>
                <meshBasicMaterial color={gridColor} />
            </mesh>
        )
    }

    return (
        <>
            {y_lines}
            {x_lines}
        </>
    )
}

export default Grid