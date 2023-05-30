import * as THREE from 'three'
import { useThree, extend, useFrame } from "@react-three/fiber"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gaussian from '../../utils/gaussian'
import MultivariateNormal from 'multivariate-normal'

import normalMixFragment from '../../shaders/fragment/normalMixFragment'
import normalMixVertex from '../../shaders/vertex/normalMixVertex.js'
import hexToRGB from '../../utils/hexToRGB'
import useColor from '../../hooks/useColor'
import Grid from './parts/Grid'

const NUM_POINTS = 50
//  These will not be the singularity thetas, they are just used to generate points
const thetas = [0.5, 0.5, 0.0]

export default function SingularityDemo() {
    const downScale = 1
    const gauss1 = gaussian(2.5, 0.0, 1.0 / downScale, 0.0/ downScale, 0.0/ downScale, 1.0/ downScale)
    const gauss2 = gaussian(-2.5, 0.0, 1.0/ downScale, -4.0/ downScale, 1.0/ downScale, 4.0/ downScale)
    const singularityScale = 10
    const gauss3 = gaussian(3.5, -3.5, 1.0/ singularityScale, -0.9/ singularityScale, 0.0/ singularityScale, 1.0/ singularityScale)

    const { camera, gl } = useThree()

    //  Dataset initialization
    const dists = [ gauss1, gauss2, gauss3 ]

    let dataPositions = []
    for(let i = 0; i < 2; i++) {
        const dist = dists[i]
        var mv = MultivariateNormal(dist[0], [[dist[3][0], dist[3][1]], [dist[3][2], dist[3][3]]])

        for(let j = 0; j < NUM_POINTS * thetas[i]; j++) {
            const sample = mv.sample()
            dataPositions.push(sample[0], 0, -sample[1])
        }
    }
    dataPositions.push(3.5, 0, -3.5)
    const dataPositionsArr = new Float32Array(dataPositions)

    const bottom_color = hexToRGB(useColor('cluster3'))
    const top_color = hexToRGB(useColor('cluster1'))
    const point_color = useColor('dark')

    return (<>
        <orbitControls args={[camera, gl.domElement]} enableZoom={false} enablePan={false}/>

        <Grid />

        <points>
            <bufferGeometry attach={'geometry'}>
                <bufferAttribute 
                    attach={"attributes-position"}
                    array={dataPositionsArr}
                    count={NUM_POINTS + 1}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial color={point_color} sizeAttenuation={false} size={10}/>
        </points>

        <mesh rotation-x={Math.PI * 0.5}>
            <planeGeometry attach={"geometry"} args={[10, 10, 64, 64]}/>
            <shaderMaterial 
                vertexShader={normalMixVertex} 
                fragmentShader={normalMixFragment}
                side={THREE.DoubleSide}
                transparent
                uniforms={{
                    uMean1: {value: gauss1[0]},
                    uDeterminant1: {value: gauss1[1]},
                    uInverseCovariance1: {value: gauss1[2]},
                    uTheta1: {value: 0.48},

                    uMean2: {value: gauss2[0]},
                    uDeterminant2: {value: gauss2[1]},
                    uInverseCovariance2: {value: gauss2[2]},
                    uTheta2: {value: 0.48},

                    uMean3: {value: gauss3[0]},
                    uDeterminant3: {value: gauss3[1]},
                    uInverseCovariance3: {value: gauss3[2]},
                    uTheta3: {value: 0.04},

                    BOTTOM_COLOR: {value: bottom_color},
                    TOP_COLOR: {value: top_color},
                    BASE_ALPHA: {value: 0.6}
                }}
            />
        </mesh>
    </>)
}