import React from "react";
import * as THREE from 'three'
import { useThree, extend, useFrame } from "@react-three/fiber"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import LiveNormals from "./parts/LiveNormals";
import useColor from "../../hooks/useColor";
import Datapoints from "./parts/Datapoints";
import Grid from "./parts/Grid";

extend({OrbitControls})

const EMV = ({dataset, means, weights, covs}) => {
    const { camera, gl } = useThree()

    return (
        <>
            <orbitControls args={[camera, gl.domElement]} enableZoom={false} enablePan={false}/>
            
            <Grid />

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