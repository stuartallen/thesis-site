import * as THREE from 'three'

import normalMixGradientFragment from '../../../shaders/fragment/normalMixGradientFragment.js'
import normalMixVertex from '../../../shaders/vertex/normalMixVertex.js'
import gaussian from '../../../gaussian.js'
import { useEffect, useRef } from 'react'

export default function LiveNormals({mixture}) {
    const { weights, means, covariances } = mixture

    const clusters = []
    //  Yest this should be in
    for(const i in weights) {
        clusters.push([gaussian(   
            means[i][0], 
            -means[i][1], 
            covariances[i][0][0], 
            -covariances[i][0][1], 
            -covariances[i][1][0], 
            covariances[i][1][1]
        ), weights[i]])
    }

    const normalsMaterial = useRef(new THREE.ShaderMaterial({
        vertexShader: normalMixVertex,
        fragmentShader: normalMixGradientFragment,
        side: THREE.DoubleSide,
        transparent: true,
        uniforms: {
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
                uTheta3: {value: clusters[2][1]
            }
        }
    }))

    useEffect(() => {
        normalsMaterial.current.uniforms.uMean1.value = clusters[0][0][0]
        normalsMaterial.current.uniforms.uDeterminant1.value = clusters[0][0][1]
        normalsMaterial.current.uniforms.uInverseCovariance1.value = clusters[0][0][2]
        normalsMaterial.current.uniforms.uTheta1.value = clusters[0][1]

        normalsMaterial.current.uniforms.uMean2.value = clusters[1][0][0]
        normalsMaterial.current.uniforms.uDeterminant2.value = clusters[1][0][1]
        normalsMaterial.current.uniforms.uInverseCovariance2.value = clusters[1][0][2]
        normalsMaterial.current.uniforms.uTheta2.value = clusters[1][1]

        normalsMaterial.current.uniforms.uMean3.value = clusters[2][0][0]
        normalsMaterial.current.uniforms.uDeterminant3.value = clusters[2][0][1]
        normalsMaterial.current.uniforms.uInverseCovariance3.value = clusters[2][0][2]
        normalsMaterial.current.uniforms.uTheta3.value = clusters[2][1]
    }, [clusters])

    return (<>
        <mesh material={normalsMaterial.current} rotation-x={Math.PI * -0.5}>
            <planeGeometry args={[10, 10, 128, 128]}/>
        </mesh>
    </>)
}