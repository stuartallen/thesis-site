import * as THREE from 'three'
import { useThree, extend } from "@react-three/fiber"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import normalMixFragment from '../../shaders/fragment/normalMixTransparentFragment'
import normalMixVertex from '../../shaders/vertex/normalMixVertex.js'

import gaussian from '../../gaussian'

extend({OrbitControls})

const BEGIN = -5
const END = 5
const SEGMENTS = 50
const thetas = [0.3, 0.4, 0.3]

export default function LineIntegral() {
    const gauss1 = gaussian(0.0, 2.0, 1.0, 0.0, 0.0, 1.0)
    const gauss2 = gaussian(2.0, -2.0, 2.0, -1.0, 2.0, 1.0)
    const gauss3 = gaussian(-3.0, -2.0, 1.0, -0.9, 0.0, 1.0)

    const { camera, gl } = useThree()

    const t_b = x_inv(BEGIN)
    const t_e = x_inv(END)

    const vertices = new Float32Array(3 * 2 * SEGMENTS)
    for(let i = 0; i < vertices.length; i += 6) {
        const t_i = t_b + (i / (6 * (SEGMENTS - 1))) * (t_e - t_b)
    
        vertices[i]     = x(t_i)
        vertices[i + 1] = 0
        vertices[i + 2] = y(t_i)
    
        vertices[i + 3] = x(t_i)
        vertices[i + 4] = 30 * gmmVal(x(t_i), y(t_i), gauss1, gauss2, gauss3, thetas)
        vertices[i + 5] = y(t_i)
    }

    let indices = []
    for(let i = 0; i < 2 * (SEGMENTS - 1); i += 1) {
        indices.push(i, i + 1, i + 2)
    }
    indices = new Uint32Array(indices)

    return (<>
        <orbitControls args={[camera, gl.domElement]}/>

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
        <mesh>
            <bufferGeometry>
                <bufferAttribute 
                    attach={"attributes-position"}
                    array={vertices}
                    count={vertices.length / 3}
                    itemSize={3}
                />
                <bufferAttribute
                    attach={"index"}
                    array={indices}
                    count={indices.length}
                    itemSize={1}
                />
            </bufferGeometry>
            <meshBasicMaterial color={'green'/*'#bfa1b4'*/} side={THREE.DoubleSide}/>
        </mesh>
        <mesh>
            <bufferGeometry>
                <bufferAttribute 
                    attach={"attributes-position"}
                    array={vertices}
                    count={vertices.length / 3}
                    itemSize={3}
                />
                <bufferAttribute
                    attach={"index"}
                    array={indices}
                    count={indices.length}
                    itemSize={1}
                />
            </bufferGeometry>
            <meshBasicMaterial color={'#BFEBCD'} side={THREE.DoubleSide} wireframe/>
        </mesh>
    </>)
}

const x = (t) => {
    return t
}

const x_inv = (val) => {
    return val
}

const y = (t) => {
    return 0.2*t*t - 5
}

const pdf = (mean, determinant, inverseCovariance, pos) => {
    const diff = [pos[0] - mean[0], pos[1] - mean[1]];
	const matMult = inverseCovariance[0] * diff[0] * diff[0] +
					inverseCovariance[1] * diff[0] * diff[1] +
					inverseCovariance[2] * diff[1] * diff[0] + 
					inverseCovariance[3] * diff[1] * diff[1];
	const answr = (1.0 / (2.0 * Math.PI * Math.sqrt(determinant))) * Math.pow(Math.E, -(1.0 / 2.0) * matMult);
    return answr
}

const gmmVal = (x, y, gauss1, gauss2, gauss3, thetas) => {
    const total = thetas[0] * pdf(gauss1[0], gauss1[1], gauss1[2], [x, y]) + 
            thetas[1] * pdf(gauss2[0], gauss2[1], gauss2[2], [x, y]) + 
            thetas[2] * pdf(gauss3[0], gauss3[1], gauss3[2], [x, y])
    return total
}

