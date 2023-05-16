import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import MultivariateNormal from 'multivariate-normal'
import { randInt } from 'three/src/math/MathUtils'

import EMV from "./scenes/EMV";
import gaussian from "../utils/gaussian";

const NUM_POINTS = 100
const thetas = [0.3, 0.4, 0.3]

const EMVWrapper = () => {
    //  Get distribution properties
    const dists = trueDistributions()

    //  Initialize dataset positions
    const [dataset, setDataset] = useState(initialDataset(dists))

    //  Initialize the number of steps in the simulation
    const [step, setStep] = useState(0)

    //  Initialize the means
    const [means, setMeans] = useState(initMeans(dataset))

    //  Initialize the covariance matrices
    const [covs, setCovs] = useState(initCovs())

    //  Initialize the weights
    const [weights, setWeights] = useState([1.0/3.0, 1.0/3.0, 1.0/3.0])

    //  Initialize the colors

    return (
        <>
            <Canvas
                    camera={{
                        position: [0, 3, 9]
                    }}
                >
                <EMV />
            </Canvas>
        </>
    )
}

const trueDistributions = () => {
    const downScale = 2
    const gauss1 = gaussian(0.0, 2.0, 1.0 / downScale, 0.0/ downScale, 0.0/ downScale, 1.0/ downScale)
    const gauss2 = gaussian(2.0, -2.0, 2.0/ downScale, -1.0/ downScale, 2.0/ downScale, 1.0/ downScale)
    const gauss3 = gaussian(-3.0, -2.0, 1.0/ downScale, -0.9/ downScale, 0.0/ downScale, 1.0/ downScale)

    const dists = [ gauss1, gauss2, gauss3 ]

    return dists
}

//  Generates NUM_POINTS points from the dataset
const initialDataset = (dists) => {
    const dataPositions = []

    //  For each distribution
    for(let i = 0; i < dists.length; i++) {
        const dist = dists[i]
        var mv = MultivariateNormal(dist[0], [[dist[3][0], dist[3][1]], [dist[3][2], dist[3][3]]])

        for(let j = 0; j < NUM_POINTS * thetas[i]; j++) {
            const sample = mv.sample()
            dataPositions.push(sample)
        }
    }
    
    return dataPositions
}

//  Returns an array of 3 points selected from the dataset
const initMeans = (dataset) => {
    const initMeans = []

    //  For each cluster
    for(let i = 0; i < 3; i++) {
        let val = dataset[randInt(0, dataset.length)]

        //  Reselect until a new point is chosen
        //  Assumes there are less clusters than data points (should always be the case when using GMMs)
        while(initMeans[i - 1] && initMeans[i - 1][0] == val[0] && initMeans[i - 1][1] == val[1]) {
            val = initMeans[randInt(0, dataset.length)]
        }

        initMeans.push(val)
    }

    return initMeans
}

//  Returns an array of 3 identity matrices
const initCovs = () => {
    const covs = []

    for(let i = 0; i < 3; i++) {
        covs.push([[1, 0], [0, 1]])
    }

    return covs
}

//  Returns the partial assignments based on the dataset & distribution parameters
const ExpectationStep = (dataset, means, covs, weights) => {
    const partialAssignments = []

    //  For each point
    for(let datapoint of dataset) {
        let totalLikelihood = 0

        //  For each distribution
        for(let i = 0; i < 3; i++) {

        }
    }
}

//  Returns the pdf value of a multivariate gaussian given its parameters


export default EMVWrapper