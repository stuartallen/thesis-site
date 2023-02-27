import * as THREE from 'three'
import { useThree, extend } from "@react-three/fiber"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import normalMixGradientFragment from '../../shaders/fragment/normalMixGradientFragment'
import normalMixVertex from '../../shaders/vertex/normalMixVertex.js'

import gaussian from "../../gaussian"

import MultivariateNormal from 'multivariate-normal'
import { randInt } from 'three/src/math/MathUtils'
import { useEffect, useState } from 'react'
import Datapoints from './parts/Datapoints'
const GMM = require('gaussian-mixture-model')

const thetas = [0.3, 0.4, 0.3]
const NUM_POINTS = 75

export default function EMVisualization() {

    const gauss1 = gaussian(0.0, 2.0, 1.0, 0.0, 0.0, 1.0)
    const gauss2 = gaussian(2.0, -2.0, 2.0, -1.0, 2.0, 1.0)
    const gauss3 = gaussian(-3.0, -2.0, 1.0, -0.9, 0.0, 1.0)

    const dists = [ gauss1, gauss2, gauss3]

    const { camera, gl, scene } = useThree()

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

    const means = []

    //  Initialize means to a random point
    for(let i = 0; i < 3; i++) {
        let val = dataPositions[randInt(0, dataPositions.length)]

        //  ASSUMES THERE ARE LESS CLUSTERS THAN DATASETS
        while(means[i - 1] && means[i - 1][0] == val[0] && means[i - 1][1] == val[1]) {
            val = means[randInt(0, dataPositions.length)]
        }

        means.push(val)
    }

    const weights = []
    const covariances = []
    //  Yes this should be i IN
    for(let i in means) {
        weights.push(1.0 / means.length)
        //  Assume the identity matrix in R2
        covariances.push(
            [   [1.0, 0.0], 
                [0.0, 1.0]  ]
        )
    }

    const learnMixture = new GMM.GMM({
        weights: weights,
        means: means,
        covariances: covariances
    })

    //  Yes this library is kinda code smelly
    for(const point of dataPositions) {
        learnMixture.addPoint(point)
    }

    //  Display final mixture
    let learnC1 = gaussian(   
        learnMixture.means[0][0], 
        learnMixture.means[0][1], 
        learnMixture.covariances[0][0][0], 
        learnMixture.covariances[0][0][1], 
        learnMixture.covariances[0][1][0], 
        learnMixture.covariances[0][1][1]
    )
    let learnC2 = gaussian(   
        learnMixture.means[1][0], 
        learnMixture.means[1][1], 
        learnMixture.covariances[1][0][0], 
        learnMixture.covariances[1][0][1], 
        learnMixture.covariances[1][1][0], 
        learnMixture.covariances[1][1][1]
    )
    let learnC3 = gaussian(   
        learnMixture.means[2][0], 
        learnMixture.means[2][1], 
        learnMixture.covariances[2][0][0], 
        learnMixture.covariances[2][0][1], 
        learnMixture.covariances[2][1][0], 
        learnMixture.covariances[2][1][1]
    )  

    useEffect(() => updatePointColors(learnMixture, dataset, setDataset), [])

    return (<>
        <orbitControls args={[camera, gl.domElement]}/>

        {/* <mesh rotation-x={Math.PI * 0.5}>
            <planeGeometry attach={"geometry"} args={[10, 10, 128, 128]}/>
            <shaderMaterial 
                vertexShader={normalMixVertex} 
                fragmentShader={normalMixGradientFragment}
                side={THREE.DoubleSide}
                transparent
                uniforms={{
                    uMean1: {value: learnC1[0]},
                    uDeterminant1: {value: learnC1[1]},
                    uInverseCovariance1: {value: learnC1[2]},
                    uTheta1: {value: learnMixture.weights[0]},

                    uMean2: {value: learnC2[0]},
                    uDeterminant2: {value: learnC2[1]},
                    uInverseCovariance2: {value: learnC2[2]},
                    uTheta2: {value: learnMixture.weights[1]},

                    uMean3: {value: learnC3[0]},
                    uDeterminant3: {value: learnC3[1]},
                    uInverseCovariance3: {value: learnC3[2]},
                    uTheta3: {value: learnMixture.weights[2]}
                }}
            />
        </mesh> */}
        <mesh rotation-x={Math.PI * -0.5} position-y={-0.1}>
            <planeGeometry args={[10, 10, 20, 20]}/>
            <meshBasicMaterial wireframe side={THREE.DoubleSide}/>
        </mesh>
        <Datapoints dataset={dataset}/>
    </>)
}

const updatePointColors = (learnMixture, dataset, setDataset) => {
    const updatedDataset = []

    for(const dataVal of dataset) {
        // const likelihoodValues = learnMixture.predict([dataVal[0][0], dataVal[0][1]])
        // const color = new THREE.Color( 100 * likelihoodValues[0], 100 * likelihoodValues[1], 100 * likelihoodValues[2])
        const color = new THREE.Color(1 / (1 + Math.exp(dataVal[0][0])), 1 / (1 + Math.exp(dataVal[0][1])), 0)
        updatedDataset.push([dataVal[0], color])
    }

    setDataset(updatedDataset)

    // for(let child of scene.children) {
    //     if(child.type == "Points") {
    //         const position = child.geometry.getAttribute('position').array

    //         console.log(position)
    //         const likelihoodValues = learnMixture.predict([position[0], position[2]])
    //         console.log(likelihoodValues)
    //         const sum = likelihoodValues[0] + likelihoodValues[1] + likelihoodValues[2]
    //         const color = new THREE.Color( 100 * likelihoodValues[0], 100 * likelihoodValues[1], 100 * likelihoodValues[2])

    //         child.material.color = color
    //     }
    // }
}