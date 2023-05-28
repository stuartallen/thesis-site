import React, { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import MultivariateNormal from 'multivariate-normal'
import { randInt } from 'three/src/math/MathUtils'
import * as THREE from 'three'
import './EMVWrapper.css'

import { BsCaretRightFill, BsCaretLeftFill } from "react-icons/bs";
import { BsArrowCounterclockwise } from 'react-icons/bs/index.js'

import EMV from "./scenes/EMV";
import gaussian from "../utils/gaussian";
import useColor from "../hooks/useColor";
import hexToRGB from "../utils/hexToRGB";

const NUM_POINTS = 100
const thetas = [0.3, 0.4, 0.3]
const MAX_ITER = 10

const EMVWrapper = ({setNeedsLoadEMVis}) => {
    const color1 = hexToRGB(useColor('good'))
    const color2 = hexToRGB(useColor('bad'))
    const color3 = hexToRGB(useColor('neutral'))

    //  Initialize the number of steps in the simulation
    const [step, setStep] = useState(0)

    //  Get distribution properties
    const dists = trueDistributions()
    //  Initialize dataset positions
    const datasetPositions = initialDataset(dists)
    //  Initialize the means
    const initMeanList = initMeans(datasetPositions)
    //  Initialize the covariance matrices
    const initCovList = initCovs()
    //  Initialize the weights
    const initWeights = [1.0/3.0, 1.0/3.0, 1.0/3.0]

    const mixtureStepsList = useRef([{
        means: initMeanList,
        covs: initCovList,
        weights: initWeights
    }]) 

    //  Used only to generate the first data colors
    //  Initial colors
    const initColors = partialAssignmentsToColor(expectationStep(datasetPositions, initMeanList, initCovList, initWeights), color1, color2, color3)
    const initDataPointsColor = []
    for(let i = 0; i < datasetPositions.length; i++) {
        initDataPointsColor.push([datasetPositions[i], initColors[i]])
    }
    const dataPositionsColorsStepsList = useRef([initDataPointsColor])

    useEffect(() => {
        if(dataPositionsColorsStepsList.current.length == 1) {
            for(let i = 1; i < MAX_ITER; i++) {
                console.log(mixtureStepsList.current)
                const partialAssignmentList = expectationStep(
                    datasetPositions,
                    mixtureStepsList.current[i - 1].means,
                    mixtureStepsList.current[i - 1].covs,
                    mixtureStepsList.current[i - 1].weights
                )

                //  We'll have already done this for the first iteration
                if(i > 1) {
                    const colors = partialAssignmentsToColor(partialAssignmentList, color1, color2, color3)
            
                    const dataPointsColors = []
                    for(let i = 0; i < datasetPositions.length; i++) {
                        dataPointsColors.push([datasetPositions[i], colors[i]])
                    }
                    dataPositionsColorsStepsList.current.push(dataPointsColors)
                }
                
                const maximizationResults = maximizationStep(partialAssignmentList, datasetPositions)
                mixtureStepsList.current.push(maximizationResults)
            }
        }
    }, [])

    const reload = () => {
        setNeedsLoadEMVis(true)
    }

    const leftArrowClick = () => {
        console.log(mixtureStepsList.current)
        setStep(Math.max(step - 1, 0))
    }

    const rightArrowClick = () => {
        setStep(Math.min(step + 1, 2 * (MAX_ITER - 1) - 1))
    }

    const datasetListIdx = Math.floor(step / 2) 
    const mixtureListIdx = Math.floor((step + 1) / 2)

    return (
        <>
            <div className="visAndControlsContainer">
                <div className="controls">
                    <div className="lastStep">
                        <div>{`Step Number: ${step}`}</div>
                        <div>{`Last Step Taken: ${step === 0 ? 'None' : step % 2 === 0 ? 'Expectation Step' : 'Maximization Step'}`}</div>
                    </div>
                    <BsArrowCounterclockwise className="restartButton" onClick={reload}/>
                    <div id="arrowContainer">
                        <BsCaretLeftFill className={`arrow  ${step == 0 ? 'disabled' : null}`} size={100} onClick={leftArrowClick}/> 
                        <BsCaretRightFill className={`arrow ${step == 2 * (MAX_ITER - 1) - 1 ? 'disabled' : null}`} size={100} onClick={rightArrowClick}/>
                    </div>
                </div>
                <Canvas
                        camera={{
                            position: [0, 3, 9]
                        }}
                    >
                    <EMV 
                        dataset={dataPositionsColorsStepsList.current[datasetListIdx]} 
                        means={mixtureStepsList.current[mixtureListIdx].means} 
                        weights={mixtureStepsList.current[mixtureListIdx].weights} 
                        covs={mixtureStepsList.current[mixtureListIdx].covs}
                    />
                </Canvas>
            </div>
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

//  Returns the value of a 2D multivariate gaussian at point, given the mean and covariance
const multiVariateGaussianPDFin2D = (point, mean, cov) => {
    const det = cov[0][0] * cov[1][1] - cov[0][1] * cov[1][0]
    const diffXMu = [point[0] - mean[0], point[1] - mean[1]]
    const inverseMatrix = [[cov[1][1] / det, -cov[0][1]/det], [-cov[1][0]/det, cov[0][0]/det]]
    const matrixMult =  diffXMu[0] * diffXMu[0] * (inverseMatrix[0][0] + inverseMatrix[1][0]) +
                        diffXMu[1] * diffXMu[1] * (inverseMatrix[0][1] + inverseMatrix[1][1])

    return (1.0 / (2.0 * Math.PI * Math.sqrt(det))) * Math.exp(-0.5 * matrixMult)
}

//  Returns the partial assignments based on the dataset & distribution parameters
const expectationStep = (dataset, means, covs, weights) => {
    const partialAssignments = []

    //  For each point
    for(let datapoint of dataset) {
        let totalLikelihood = 0
        const pointsPA = []

        //  For each distribution
        for(let i = 0; i < 3; i++) {
            pointsPA.push(weights[i] * multiVariateGaussianPDFin2D(datapoint, means[i], covs[i]))
            totalLikelihood += pointsPA[i]
        }

        //  Divide each partial assignment by the total likelihood to ensure a probability
        for(let i = 0; i < 3; i++) {
            pointsPA[i] /= totalLikelihood
        }

        partialAssignments.push(pointsPA)
    }

    return partialAssignments
}

//  Gives the color values for each point given the partial assignments
const partialAssignmentsToColor = (partialAssignments, color1, color2, color3) => {
    const colors = []

    for(let pa of partialAssignments) {
        var redValue =      (pa[0] * color1[0] +
            pa[1] * color2[0] +
            pa[2] * color3[0]) / 3
        var blueValue =     (pa[0] * color1[1] +
            pa[1] * color2[1] +
            pa[2] * color3[1]) / 3
        var greenValue =    (pa[0] * color1[2] +
            pa[1] * color2[2] +
            pa[2] * color3[2]) / 3

        colors.push(new THREE.Color(redValue, blueValue, greenValue))
    }

    return colors   
}

//  Return the new means, covariances, and weights based on the partial assignments
const maximizationStep = (partialAssignments, dataset) => {
    //  The total of the partialAssignments for each cluster respectively
    //  All updates need this so we do this here
    const assignmentTotals = []

    for(let i = 0; i < 3; i++) {
        let total = 0

        for(let j = 0; j < partialAssignments.length; j++) {
            total += partialAssignments[j][i]
        }

        assignmentTotals.push(total)
    }

    const updatedMeans = updateMeans(partialAssignments, dataset, assignmentTotals)
    const updatedCovs = updateCovs(partialAssignments, dataset, assignmentTotals, updatedMeans)
    const updatedWeights = updateWeights(partialAssignments, assignmentTotals)

    return {
        means: updatedMeans,
        covs: updatedCovs,
        weights: updatedWeights
    }
}

const updateWeights = (partialAssignments, assignmentTotals) => {
    const newWeights = [0.0, 0.0, 0.0]

    //  For each cluster
    for(let i = 0; i < 3; i++) {
        newWeights[i] = assignmentTotals[i] / partialAssignments.length
    }

    return newWeights
}

const updateMeans = (partialAssignments, dataset, assignmentTotals) => {
    const newMeans = []

    //  For each cluster
    for(let i = 0; i < 3; i++) {
        let totalX = 0
        let totalY = 0

        for(let j = 0; j < dataset.length; j++) {
            totalX += partialAssignments[j][i] * dataset[j][0]
            totalY += partialAssignments[j][i] * dataset[j][1]
        }

        newMeans.push([totalX / assignmentTotals[i], totalY / assignmentTotals[i]])
    }

    return newMeans
}

const updateCovs = (partialAssignments, dataset, assignmentTotals, means) => {
    const newCovs = []

    //  For each cluster
    for(let i = 0; i < 3; i++) {
        let covTotal = [[0, 0], [0, 0]]

        for(let j = 0; j < dataset.length; j++) {
            //  Difference between mean and data
            const diff = [dataset[j][0] - means[i][0], dataset[j][1] - means[i][1]]
            
            covTotal[0][0] += partialAssignments[j][i] * diff[0] * diff[0]
            covTotal[0][1] += partialAssignments[j][i] * diff[0] * diff[1]
            covTotal[1][0] += partialAssignments[j][i] * diff[1] * diff[0]
            covTotal[1][1] += partialAssignments[j][i] * diff[1] * diff[1]
        }

        covTotal[0][0] /= assignmentTotals[i]
        covTotal[0][1] /= assignmentTotals[i]
        covTotal[1][0] /= assignmentTotals[i]
        covTotal[1][1] /= assignmentTotals[i]

        covTotal[0][0] += 0.1
        covTotal[1][1] += 0.1

        newCovs.push(covTotal)
    }

    return newCovs
}

export default EMVWrapper