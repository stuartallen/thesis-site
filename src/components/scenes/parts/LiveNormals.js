import * as THREE from 'three'

import normalMixGradientFragment from '../../../shaders/fragment/normalMixGradientFragment.js'
import normalMixVertex from '../../../shaders/vertex/normalMixVertex.js'
import gaussian from '../../../gaussian.js'

export default function LiveNormals({weights, means, covariances}) {
    const clusters = []
    //  Yest this should be in
    for(const i in weights) {
        clusters.push([gaussian(   
            means[i][0], 
            means[i][1], 
            covariances[i][0][0], 
            covariances[i][0][1], 
            covariances[i][1][0], 
            covariances[i][1][1]
        ), weights[i]])
    }

    return (<>
        <mesh rotation-x={Math.PI * -0.5}>
            <planeGeometry args={[10, 10, 128, 128]}/>
            <shaderMaterial 
                vertexShader={normalMixVertex} 
                fragmentShader={normalMixGradientFragment}
                side={THREE.DoubleSide}
                transparent
                uniforms={{
                    uMean1: {value: clusters[0][0][0]},
                    uDeterminant1: {value: clusters[0][0][1]},
                    uInverseCovariance1: {value: clusters[0][0][2]},
                    uTheta1: {value: clusters[0][1]},

                    uMean2: {value: clusters[1][0][0]},
                    uDeterminant2: {value: clusters[1][0][1]},
                    uInverseCovariance2: {value: clusters[1][0][2]},
                    uTheta2: {value: clusters[1][1]},

                    uMean3: {value: clusters[2][0][0]},
                    uDeterminant3: {value: clusters[2][0][1]},
                    uInverseCovariance3: {value: clusters[2][0][2]},
                    uTheta3: {value: clusters[2][1]}
                }}
            />
        </mesh>
    </>)
}