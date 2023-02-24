import * as THREE from 'three'
import { useThree, extend } from "@react-three/fiber"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import normalMixGradientFragment from '../../shaders/fragment/normalMixGradientFragment'
import normalMixVertex from '../../shaders/vertex/normalMixVertex.js'

import gaussian from "../../gaussian"

import MultivariateNormal from 'multivariate-normal'
import { randInt } from 'three/src/math/MathUtils'
const GMM = require('gaussian-mixture-model')

const thetas = [0.3, 0.4, 0.3]

export default function EMVisualization() {
    const gauss1 = gaussian(0.0, 2.0, 1.0, 0.0, 0.0, 1.0)
    const gauss2 = gaussian(2.0, -2.0, 2.0, -1.0, 2.0, 1.0)
    const gauss3 = gaussian(-3.0, -2.0, 1.0, -0.9, 0.0, 1.0)

    const dists = [ gauss1, gauss2, gauss3]

    const { camera, gl } = useThree()

    const dataset = []
    for(let i = 0; i < dists.length; i++) {
        const dist = dists[i]
        var mv = MultivariateNormal(dist[0], [[dist[3][0], dist[3][1]], [dist[3][2], dist[3][3]]])

        const dist1Points = []
        for(let j = 0; j < 75 * thetas[i]; j++) {
            const sample = mv.sample()
            dist1Points.push(sample[0], sample[1], 0)
            dataset.push(sample)
        }
    }

    const means = []

    //  Initialize means to a random point
    for(let i = 0; i < 3; i++) {
        let val = dataset[randInt(0, dataset.length)]

        //  ASSUMES THERE ARE LESS CLUSTERS THAN DATASETS
        while(means[i - 1] && means[i - 1][0] == val[0] && means[i - 1][1] == val[1]) {
            val = means[randInt(0, dataset.length)]
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

    return (<>
        <orbitControls args={[camera, gl.domElement]}/>

        <mesh rotation-x={Math.PI * 0.5}>
            <planeGeometry attach={"geometry"} args={[10, 10, 64, 64]}/>
            <shaderMaterial 
                vertexShader={normalMixVertex} 
                fragmentShader={normalMixGradientFragment}
                side={THREE.DoubleSide}
                transparent
                uniforms={{
                    uMean1: {value: gauss1[0]},
                    uDeterminant1: {value: gauss1[1]},
                    uInverseCovariance1: {value: gauss1[2]},
                    uTheta1: {value: 0.3},

                    uMean2: {value: gauss2[0]},
                    uDeterminant2: {value: gauss2[1]},
                    uInverseCovariance2: {value: gauss2[2]},
                    uTheta2: {value: 0.4},

                    uMean3: {value: gauss3[0]},
                    uDeterminant3: {value: gauss3[1]},
                    uInverseCovariance3: {value: gauss3[2]},
                    uTheta3: {value: 0.3}
                }}
            />
        </mesh>
        <mesh rotation-x={Math.PI * -0.5} position-y={-0.1}>
            <planeGeometry args={[10, 10, 20, 20]}/>
            <meshBasicMaterial wireframe side={THREE.DoubleSide}/>
        </mesh>
        {dataset.map((pos, i) => (
            <points key={i}>
                <bufferGeometry>
                    <bufferAttribute 
                        attach={"attributes-position"}
                        array={new Float32Array([pos[0], 0, pos[1]])}
                        count={1}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial color={"red"} sizeAttenuation={false} size={10}/>
            </points>
        ))}
    </>)
}