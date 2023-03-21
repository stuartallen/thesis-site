import * as THREE from 'three'
import { useThree, extend, useFrame } from "@react-three/fiber"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import gaussian from "../../gaussian"

import MultivariateNormal from 'multivariate-normal'
import { randInt } from 'three/src/math/MathUtils'
import { useEffect, useState } from 'react'
import Datapoints from './parts/Datapoints'
import LiveNormals from './parts/LiveNormals'
const GMM = require('gaussian-mixture-model')

const thetas = [0.3, 0.4, 0.3]
const NUM_POINTS = 100

extend({OrbitControls})

export default function EMVisualization({dataset, mixture}) {
    const { camera, gl } = useThree()
    
    return (<>
        <orbitControls args={[camera, gl.domElement]}/>
        
        <mesh rotation-x={Math.PI * -0.5} position-y={-0.1}>
            <planeGeometry args={[10, 10, 20, 20]}/>
            <meshBasicMaterial wireframe side={THREE.DoubleSide}/>
        </mesh>
        <Datapoints dataset={dataset}/>
        <LiveNormals mixture={mixture}/>
    </>)
}

const updatePointColors = (learnMixture, dataset, setDataset) => {
    const updatedDataset = []

    const predictMixture = new GMM.GMM({
        weights: learnMixture.weights,
        means: learnMixture.means,
        covariances: learnMixture.covariances
    })

    for(const dataVal of dataset) {
        const likelihoodValues = predictMixture.predict([dataVal[0][0], dataVal[0][1]])
        const sum = likelihoodValues[0] + likelihoodValues[1] + likelihoodValues[2]
        const color = new THREE.Color(likelihoodValues[0] / sum, likelihoodValues[1] / sum, likelihoodValues[2] / sum)
        updatedDataset.push([dataVal[0], color])
    }

    setDataset(updatedDataset)
}