import * as THREE from 'three'
import { useThree, extend } from "@react-three/fiber"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import normalMixFragment from '../../shaders/fragment/normalMixFragment.js'
import normalMixVertex from '../../shaders/vertex/normalMixVertex.js'

import gaussian from '../../utils/gaussian.js'
import hexToRGB from '../../utils/hexToRGB.js'
import useColor from '../../hooks/useColor.js'

extend({OrbitControls})

export default function SingleGaussian({covariance}) {
    const gauss1 = gaussian(0.0, 0.0, covariance[0], covariance[1], covariance[2], covariance[3])
    const gauss2 = gaussian(100.0, 100.0, 2.0, -1.0, 2.0, 1.0)
    const gauss3 = gaussian(100.0, 100.0, 1.0, -0.9, 0.0, 1.0)

    const { camera, gl } = useThree()

    const bottom_color = hexToRGB(useColor('cluster3'))
    const top_color = hexToRGB(useColor('cluster1'))

    return (<>
        <orbitControls args={[camera, gl.domElement]} enableZoom={false} enablePan={false}/>

        <mesh rotation-x={Math.PI * -0.5} position-y={-0.1}>
            <planeGeometry args={[10, 10, 20, 20]}/>
            <meshBasicMaterial color={useColor('dark')} wireframe side={THREE.DoubleSide}/>
        </mesh>

        <mesh rotation-x={Math.PI * 0.5}>
            <planeGeometry attach={"geometry"} args={[10, 10, 64, 64]}/>
            <shaderMaterial 
                vertexShader={normalMixVertex} 
                fragmentShader={normalMixFragment}
                side={THREE.DoubleSide}
                transparent={true}
                uniforms={{
                    uMean1: {value: gauss1[0]},
                    uDeterminant1: {value: gauss1[1]},
                    uInverseCovariance1: {value: gauss1[2]},
                    uTheta1: {value: 1.0},

                    uMean2: {value: gauss2[0]},
                    uDeterminant2: {value: gauss2[1]},
                    uInverseCovariance2: {value: gauss2[2]},
                    uTheta2: {value: 0.5},

                    uMean3: {value: gauss3[0]},
                    uDeterminant3: {value: gauss3[1]},
                    uInverseCovariance3: {value: gauss3[2]},
                    uTheta3: {value: 0.4},

                    BOTTOM_COLOR: {value: bottom_color},
                    TOP_COLOR: {value: top_color},
                    BASE_ALPHA: {value: 0.6}
                }}
            />
        </mesh>
    </>)
}