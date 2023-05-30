import React from "react";
import * as THREE from 'three'
import { useThree, extend, useFrame } from "@react-three/fiber"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import LiveNormals from "./parts/LiveNormals";
import useColor from "../../hooks/useColor";
import Datapoints from "./parts/Datapoints";

extend({OrbitControls})

const EMV = ({dataset, means, weights, covs}) => {
    const { camera, gl } = useThree()

    return (
        <>
            <orbitControls args={[camera, gl.domElement]} enableZoom={false} enablePan={false}/>
            
            <mesh rotation-x={Math.PI * -0.5} position-y={-0.1}>
                <planeGeometry args={[10, 10, 20, 20]}/>
                <meshBasicMaterial color={useColor('dark')} wireframe side={THREE.DoubleSide}/>
            </mesh>

            <Datapoints dataset={dataset}/>
            
            <LiveNormals mixture={{
                weights: weights,
                means: means,
                covariances: covs
            }}/>
        </>
    )
}

export default EMV