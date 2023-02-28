import * as THREE from 'three'
import { useThree, extend, useFrame } from "@react-three/fiber"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import gaussian from "../../gaussian"

import MultivariateNormal from 'multivariate-normal'
import { randInt } from 'three/src/math/MathUtils'
import { useEffect, useRef, useState } from 'react'
import Datapoints from './parts/Datapoints'
import LiveNormals from './parts/LiveNormals'
const GMM = require('gaussian-mixture-model')

const thetas = [0.3, 0.4, 0.3]
const NUM_POINTS = 100

extend({OrbitControls})

export default function EMVisualization() {

    //  True Distribution

    const downScale = 2
    const gauss1 = gaussian(0.0, 2.0, 1.0 / downScale, 0.0/ downScale, 0.0/ downScale, 1.0/ downScale)
    const gauss2 = gaussian(2.0, -2.0, 2.0/ downScale, -1.0/ downScale, 2.0/ downScale, 1.0/ downScale)
    const gauss3 = gaussian(-3.0, -2.0, 1.0/ downScale, -0.9/ downScale, 0.0/ downScale, 1.0/ downScale)

    const dists = [ gauss1, gauss2, gauss3 ]

    const { camera, gl } = useThree()

    //  Dataset initialization

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

    //  Initialize cluster attributes

    //  Initialize means to a random point
    const initMeans = []

    for(let i = 0; i < 3; i++) {
        let val = dataPositions[randInt(0, dataPositions.length)]

        //  ASSUMES THERE ARE LESS CLUSTERS THAN DATASETS
        while(initMeans[i - 1] && initMeans[i - 1][0] == val[0] && initMeans[i - 1][1] == val[1]) {
            val = initMeans[randInt(0, dataPositions.length)]
        }

        initMeans.push(val)
    }

    //  Initialize weights & covariance
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

    const initLearnMixture = new GMM.GMM({
        weights: initWeights,
        means: initMeans,
        covariances: initCovariances
    })
    for(const point of dataPositions) {
        initLearnMixture.addPoint(point)
    }
    const learnMixWithFuncs = useRef(initLearnMixture)
    const [learnMixture, setLearnMixture] = useState(initLearnMixture)

    useEffect(() => {
        //  Yes this library is kinda code smelly
        for(const point of dataPositions) {
            learnMixture.addPoint(point)
        }

        updatePointColors(learnMixture, dataset, setDataset)
    }, [])

    let startTime = 0
    useFrame((state, delta) => {
        startTime += delta
        if(startTime > 1) {
            // const updatedMixture = new GMM.GMM({
            //     weights: learnMixture.weights,
            //     means: learnMixture.means,
            //     covariances: learnMixture.covariances
            // })
            // console.log(updatedMixture)
            // updatedMixture.weights = learnMixture.weights
            // console.log(updatedMixture)

            // for(const point of dataPositions) {
            //     updatedMixture.addPoint(point)
            // }

            // // updatedMixture.runExpectation()
            // // updatedMixture.runMaximization()
            // // updatedMixture.runCleanUp()

            // updatedMixture.runEM(100)

            learnMixWithFuncs.current.runEM(100)

            updatePointColors(learnMixWithFuncs.current, dataset, setDataset)

            setLearnMixture(learnMixWithFuncs.current)
        }
    })

    return (<>
        <orbitControls args={[camera, gl.domElement]}/>
        
        <mesh rotation-x={Math.PI * -0.5} position-y={-0.1}>
            <planeGeometry args={[10, 10, 20, 20]}/>
            <meshBasicMaterial wireframe side={THREE.DoubleSide}/>
        </mesh>
        <Datapoints dataset={dataset}/>
        <LiveNormals learnMixture={learnMixture}/>
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