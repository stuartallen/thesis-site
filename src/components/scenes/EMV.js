import React from "react";
import * as THREE from 'three'
import { useThree, extend, useFrame } from "@react-three/fiber"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

extend({OrbitControls})

const EMV = ({dataset, step}) => {
    const { camera, gl } = useThree()

    return (
        <>
            <orbitControls args={[camera, gl.domElement]}/>
            
            <mesh rotation-x={Math.PI * -0.5} position-y={-0.1}>
                <planeGeometry args={[10, 10, 20, 20]}/>
                <meshBasicMaterial color={'#1B1A1A'} wireframe side={THREE.DoubleSide}/>
            </mesh>
        </>
    )
}

export default EMV