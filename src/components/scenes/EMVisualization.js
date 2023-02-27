import * as THREE from 'three'
import { useThree, extend } from "@react-three/fiber"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import gaussian from "../../gaussian"

import MultivariateNormal from 'multivariate-normal'
import { randInt } from 'three/src/math/MathUtils'
import { useEffect, useState } from 'react'
import Datapoints from './parts/Datapoints'
import LiveNormals from './parts/LiveNormals'
const GMM = require('gaussian-mixture-model')

const thetas = [0.3, 0.4, 0.3]
const NUM_POINTS = 500

extend({OrbitControls})

export default function EMVisualization() {

    //  True Distribution

    const gauss1 = gaussian(0.0, 2.0, 1.0, 0.0, 0.0, 1.0)
    const gauss2 = gaussian(2.0, -2.0, 2.0, -1.0, 2.0, 1.0)
    const gauss3 = gaussian(-3.0, -2.0, 1.0, -0.9, 0.0, 1.0)

    const dists = [ gauss1, gauss2, gauss3 ]

    const { camera, gl } = useThree()

    //  Dataset visualization

    const dataPositions = []
    for(let i = 0; i < dists.length; i++) {
        const dist = dists[i]
        var mv = MultivariateNormal(dist[0], [[dist[3][0], dist[3][1]], [dist[3][2], dist[3][3]]])

        const dist1Points = []
        for(let j = 0; j < NUM_POINTS * thetas[i]; j++) {
            const sample = mv.sample()
            dist1Points.push(sample[0], sample[1], 0)
            dataPositions.push(sample)
        }
    }

    const initDataset = dataPositions.map((pos) => {
        return [pos, new THREE.Color(1 / (1 + Math.exp(pos[0])), 0, 1 / (1 + Math.exp(pos[1])))]
    })
    const [dataset, setDataset] = useState(initDataset)

    const initMeans = []

    //  Initialize means to a random point
    for(let i = 0; i < 3; i++) {
        let val = dataPositions[randInt(0, dataPositions.length)]

        //  ASSUMES THERE ARE LESS CLUSTERS THAN DATASETS
        while(initMeans[i - 1] && initMeans[i - 1][0] == val[0] && initMeans[i - 1][1] == val[1]) {
            val = initMeans[randInt(0, dataPositions.length)]
        }

        initMeans.push(val)
    }
    // const initMeans = [
    //     [0,-2],
    //     [4,4],
    //     [-4,4]
    // ]

    const initWeights = []
    const initCovariances = []
    //  Yes this should be i IN
    for(let i in initMeans) {
        initWeights.push(1.0 / initMeans.length)
        //  Assume the identity matrix in R2
        initCovariances.push(
            [   [1.0, 0.0], 
                [0.0, 1.0]  ]
        )
    }

    const [weights, setWeights] = useState(initWeights)
    const [covariances, setCovariances] = useState(initCovariances)
    const [means, setMeans] = useState(initMeans)

    const learnMixture = new GMM.GMM({
        weights: weights,
        means: means,
        covariances: covariances
    })

    useEffect(() => {
        //  Yes this library is kinda code smelly
        for(const point of dataPositions) {
            learnMixture.addPoint(point)
        }

        updatePointColors(learnMixture, dataset, setDataset)
    }, [])

    return (<>
        <orbitControls args={[camera, gl.domElement]}/>

        
        <mesh rotation-x={Math.PI * -0.5} position-y={-0.1}>
            <planeGeometry args={[10, 10, 20, 20]}/>
            <meshBasicMaterial wireframe side={THREE.DoubleSide}/>
        </mesh>
        <Datapoints dataset={dataset}/>
        <LiveNormals weights={weights} means={means} covariances={covariances}/>
    </>)
}

const updatePointColors = (learnMixture, dataset, setDataset) => {
    const updatedDataset = []

    for(const dataVal of dataset) {
        const likelihoodValues = learnMixture.predict([dataVal[0][0], -dataVal[0][1]])
        const sum = likelihoodValues[0] + likelihoodValues[1] + likelihoodValues[2]
        const color = new THREE.Color(likelihoodValues[0] / sum, likelihoodValues[1] / sum, likelihoodValues[2] / sum)
        // const color = new THREE.Color(1 / (1 + Math.exp(dataVal[0][0])), 1 / (1 + Math.exp(dataVal[0][1])), 0)
        updatedDataset.push([dataVal[0], color])
    }

    setDataset(updatedDataset)
}