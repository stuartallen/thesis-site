import React, { useState } from "react";
import { BsCaretRightFill, BsCaretLeftFill } from "react-icons/bs";
import { Canvas } from "@react-three/fiber";
import { randInt } from 'three/src/math/MathUtils'
import MultivariateNormal from 'multivariate-normal'
import * as THREE from 'three'

import StartVis from "./StartVis";
import EMVisualization from "./scenes/EMVisualization";
import gaussian from "../gaussian"

const GMM = require('gaussian-mixture-model')

const NUM_POINTS = 100
const thetas = [0.3, 0.4, 0.3]

const EMVisualizationWrapper = (visible, setVisible) => {
    //  This determines what step of the process the visualization is on
    const [stepCount, setStepCount] = useState(0)

    //  True Distribution
    const dists = trueDistributions()
    
    //  Dataset initialization
    const {initDataset, dataPositions} = initialDataset(dists)
    const [datasetList, setDatasetList] = useState([initDataset])
    console.log(datasetList)

    //  Cluster initialization
    const initClusters = initialClusters(dataPositions)
    const [mixtureList, setMixtureList] = useState([initClusters])
    console.log(mixtureList)

    //  Set our mixture object to begin with our initial state
    const learnMixture = new GMM.GMM(mixtureList[0])
    //  Add all our dataset points to the objects dataset
    for(const point of datasetList[0]) {
        //  We use point[0] as the mixture has no use for color data
        learnMixture.addPoint(point[0])
    }

    return (
        <>
            {visible ? 
                <>
                    <BsCaretLeftFill size={100} onClick={() => setStepCount(Math.max(stepCount - 1, 0))}/>
                    <div>{stepCount}</div>
                    <Canvas
                        camera={{
                            position: [0, 3, 9]
                        }}
                    >
                        <color attach={"background"} args={['black']}/>
                        <EMVisualization dataset={datasetList[stepCount]} mixture={mixtureList[stepCount]}/>
                    </Canvas>
                    <BsCaretRightFill size={100} onClick={() => setStepCount(stepCount + 1)}/>
                </>
            :
                <StartVis />
            }
        </>
    )
}

const initialClusters = (dataPositions) => {
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
    return {
        weights: initWeights, 
        covariances: initCovariances,
        means: initMeans
    }
}

const initialDataset = (dists) => {
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
    
    return {initDataset, dataPositions}
}

const trueDistributions = () => {
    const downScale = 2
    const gauss1 = gaussian(0.0, 2.0, 1.0 / downScale, 0.0/ downScale, 0.0/ downScale, 1.0/ downScale)
    const gauss2 = gaussian(2.0, -2.0, 2.0/ downScale, -1.0/ downScale, 2.0/ downScale, 1.0/ downScale)
    const gauss3 = gaussian(-3.0, -2.0, 1.0/ downScale, -0.9/ downScale, 0.0/ downScale, 1.0/ downScale)

    const dists = [ gauss1, gauss2, gauss3 ]

    return dists
}

export default EMVisualizationWrapper