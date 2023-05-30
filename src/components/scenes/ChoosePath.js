import * as THREE from 'three'
import { useThree, extend } from "@react-three/fiber"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import normalMixFragment from '../../shaders/fragment/normalMixFragment'
import normalMixVertex from '../../shaders/vertex/normalMixVertex.js'

import gaussian from '../../utils/gaussian'
import hexToRGB from '../../utils/hexToRGB'
import useColor from '../../hooks/useColor'

extend({OrbitControls})

const BEGIN = -5
const END = 5
const SEGMENTS = 50
const thetas = [0.3, 0.4, 0.3]

const gauss1 = gaussian(0.0, 2.0, 1.0, 0.0, 0.0, 1.0)
const gauss2 = gaussian(2.0, -2.0, 2.0, -1.0, 2.0, 1.0)
const gauss3 = gaussian(-3.0, -2.0, 1.0, -0.9, 0.0, 1.0)

const Path = ({x, x_inv, y, color}) => {
    const wire_color = useColor('dark')

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

    //  Uncomment this section to see the line integral of each path
    // //  To find area under the curve
    // console.log(color)

    // let totalArea = 0    
    // for(let i = 0; i < vertices.length - 6; i += 6) {
    //     //  point 1
    //     const x_1 = vertices[i]
    //     const y_1 = vertices[i + 2]
    //     const h_1 = vertices[i + 4] / 30

    //     //  point 2
    //     const x_2 = vertices[i + 6]
    //     const y_2 = vertices[i + 8]
    //     const h_2 = vertices[i + 10] / 30

    //     //  Distance between points
    //     const dist = ((x_1 - x_2) ** 2 + (y_1 - y_2) ** 2) ** 0.5
        
    //     const area = 0.5 * (h_1 + h_2) * dist

    //     totalArea += area
    // }
    // console.log(totalArea)

    return (
        <>
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
                <meshBasicMaterial color={color} side={THREE.DoubleSide}/>
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
                <meshBasicMaterial color={wire_color} side={THREE.DoubleSide} wireframe/>
            </mesh>
            <mesh rotation-x={Math.PI * 0.5} position-z={0.1}>
                <planeGeometry attach={"geometry"} args={[10, 10, 10, 10]}/>
                <meshBasicMaterial color={wire_color} side={THREE.DoubleSide} wireframe/>
            </mesh>
        </>
    )
}

export default function ChoosePath() {
    const { camera, gl } = useThree()

    //  We could define the coordinates in terms of x or a mix of both but this more readable

    const x = (t) => {
        return t
    }
    
    const x_inv = (val) => {
        return val
    }
    
    const y_1 = (t) => {
        return 0.2*t*t - 5
    }

    const y_2 = (t) => {
        return 0.5 * t
    }

    const y_3 = (t) => {
        return 0.01 * t * t * t - 1
    }

    const bottom_color = hexToRGB(useColor('cluster3'))
    const top_color = hexToRGB(useColor('cluster1'))

    const path_1_color = useColor('cluster1')
    const path_2_color = useColor('cluster2')
    const path_3_color = useColor('cluster3')
    const wire_color = useColor('dark')

    return (<>
        <orbitControls args={[camera, gl.domElement]} enableZoom={false} enablePan={false}/>

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
                    uTheta3: {value: 0.3},

                    BOTTOM_COLOR: {value: bottom_color},
                    TOP_COLOR: {value: top_color},
                    BASE_ALPHA: {value: 0.3}
                }}
            />
        </mesh>
       <Path x={x} x_inv={x_inv} y={y_1} color={path_1_color}/>
       <Path x={x} x_inv={x_inv} y={y_2} color={path_2_color}/>
       <Path x={x} x_inv={x_inv} y={y_3} color={path_3_color}/>
       <mesh rotation-x={Math.PI * 0.5} position-z={0.1}>
            <planeGeometry attach={"geometry"} args={[10, 10, 10, 10]}/>
            <meshBasicMaterial color={wire_color} wireframe />
        </mesh>
    </>)
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

