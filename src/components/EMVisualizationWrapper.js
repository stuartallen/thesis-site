import React, { useEffect, useRef, useState } from "react";
import { BsCaretRightFill, BsCaretLeftFill } from "react-icons/bs";
import { Canvas } from "@react-three/fiber";
import { randInt } from 'three/src/math/MathUtils'
import MultivariateNormal from 'multivariate-normal'
import * as THREE from 'three'
import { BsArrowCounterclockwise } from 'react-icons/bs/index.js'

import EMVisualization from "./scenes/EMVisualization";
import gaussian from "../gaussian"
import './EMVisualizationWrapper.css'

const GMM = require('gaussian-mixture-model')

const NUM_POINTS = 100
const thetas = [0.3, 0.4, 0.3]

const EMVisualizationWrapper = ({setNeedsLoadEMVis}) => {

    //  This determines what step of the process the visualization is on
    const [stepCount, setStepCount] = useState(0)

    //  True Distribution
    let dists = trueDistributions()
    
    //  Dataset initialization
    let {initDataset, dataPositions} = initialDataset(dists)

    //  Cluster initialization
    let initClusters = initialClusters(dataPositions)
    let mixtureList = useRef([initClusters])

    let learnMixture = new GMM.GMM(mixtureList.current[0])
    initDataset = colorsUpdate(learnMixture, initDataset)
    let datasetList = useRef([initDataset])

    useEffect(() => {
        //  Set our mixture object to begin with our initial state
        const learnMixture = new GMM.GMM(mixtureList.current[0])
        //  Add all our dataset points to the objects dataset
        for(const point of datasetList.current[0]) {
            //  We use point[0] as the mixture has no use for color data
            learnMixture.addPoint(point[0])
        }

        //  Until we reach convergence
        for(let i = 0; i < 10; i++) {
            learnMixture.runEM()
            datasetList.current.push(colorsUpdate(learnMixture, initDataset))
            mixtureList.current.push({
                weights: learnMixture.weights,
                covariances: learnMixture.covariances,
                means: learnMixture.means
            })
        }
    }, [])

    const datasetListIdx = Math.floor(stepCount / 2) 
    const mixtureListIdx = Math.floor((stepCount + 1) / 2)

    const reload = () => {
        setNeedsLoadEMVis(true)
    }

    const leftArrowClick = () => {
        setStepCount(Math.max(stepCount - 1, 0))
    }

    const rightArrowClick = () => {
        setStepCount(Math.min(stepCount + 1, datasetList.current.length - 1))
    }

    return (
        <>
            <div className="visAndControlsContainer">
                <div className="controls">
                    <div className="lastStep">
                        <div>{`Step Number: ${stepCount}`}</div>
                        <div>{`Last Step Taken: ${stepCount === 0 ? 'None' : stepCount % 2 === 0 ? 'Expectation Step' : 'Maximization Step'}`}</div>
                    </div>
                    <BsArrowCounterclockwise className="stopButton" onClick={reload}/>
                    <div id="arrowContainer">
                        <BsCaretLeftFill className={`arrow  ${stepCount == 0 ? 'disabled' : null}`} size={100} onClick={leftArrowClick}/> 
                        <BsCaretRightFill className={`arrow ${stepCount == datasetList.current.length - 1 && datasetList.current.length != 1 ? 'disabled' : null}`} size={100} onClick={rightArrowClick}/>
                    </div>
                </div>
                <Canvas
                    camera={{
                        position: [0, 3, 9]
                    }}
                >
                    <color attach={"background"} args={['#f7eedf']}/>
                    <EMVisualization dataset={datasetList.current[datasetListIdx]} mixture={mixtureList.current[mixtureListIdx]}/>
                </Canvas>
            </div>
        </>
    )
}

const colorsUpdate = (learnMixture, lastDataSet) => {
    const newDataset = []

    for(let i = 0; i < lastDataSet.length; i++) {
        const likelihoodValues = learnMixture.predict([lastDataSet[i][0][0], lastDataSet[i][0][1]])
        const sum = likelihoodValues[0] + likelihoodValues[1] + likelihoodValues[2]
        // const color = new THREE.Color(likelihoodValues[0] / sum, likelihoodValues[1] / sum, likelihoodValues[2] / sum)
        const color = colorMix([likelihoodValues[0] / sum, likelihoodValues[1] / sum, likelihoodValues[2] / sum])

        newDataset.push([lastDataSet[i][0], color])
    }

    return newDataset
}

const colorMix = (mixtureValues) => {
    var color1 = [1.0, 1.0, 0.0]
    var color2 = [0.0, 1.0, 1.0]
    var color3 = [1.0, 0.0, 1.0]

    var redValue =      (mixtureValues[0] * color1[0] +
                        mixtureValues[1] * color2[0] +
                        mixtureValues[2] * color3[0]) / 3
    var blueValue =     (mixtureValues[0] * color1[1] +
                        mixtureValues[1] * color2[1] +
                        mixtureValues[2] * color3[1]) / 3
    var greenValue =    (mixtureValues[0] * color1[2] +
                        mixtureValues[1] * color2[2] +
                        mixtureValues[2] * color3[2]) / 3

    return new THREE.Color(redValue, blueValue, greenValue)
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