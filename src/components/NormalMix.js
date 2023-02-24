import * as THREE from 'three'
import { useThree, extend } from "@react-three/fiber"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

extend({OrbitControls})

export default function NormalMix() {
    const gauss1 = gaussian(0.0, 2.0, 1.0, 0.0, 0.0, 1.0)
    const gauss2 = gaussian(2.0, -2.0, 2.0, -1.0, 2.0, 1.0)
    const gauss3 = gaussian(-3.0, -2.0, 1.0, -0.9, 0.0, 1.0)

    const { camera, gl } = useThree()

    return (<>
        <orbitControls args={[camera, gl.domElement]}/>

        <mesh rotation-x={Math.PI * 0.5}>
            <planeGeometry attach={"geometry"} args={[10, 10, 64, 64]}/>
            <shaderMaterial 
                vertexShader={vertexShader} 
                fragmentShader={fragmentShader}
                side={THREE.DoubleSide}
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
    </>)
}

const fragmentShader = `
varying float probability;

void main() {
	vec3 color = mix(vec3(0.0, 0.0, 1.0), vec3(1.0, 0.0, 0.0), sqrt(sqrt(probability)));

	gl_FragColor = vec4(color, 1.0);
}
`

const vertexShader = `
uniform vec2 uMean1;
uniform float uDeterminant1;
uniform mat2 uInverseCovariance1;
uniform float uTheta1;

uniform vec2 uMean2;
uniform float uDeterminant2;
uniform mat2 uInverseCovariance2;
uniform float uTheta2;

uniform vec2 uMean3;
uniform float uDeterminant3;
uniform mat2 uInverseCovariance3;
uniform float uTheta3;

varying float probability;

const float PI 	= 3.141592;
const float E 	= 2.71828;

float pdf(vec2 mean, float determinant, mat2 inverseCovariance, vec2 pos) {
	vec2 diff = pos - mean;
	float matMult = inverseCovariance[0][0] * diff.x * diff.x +
					inverseCovariance[0][1] * diff.x * diff.y +
					inverseCovariance[1][0] * diff.y * diff.x + 
					inverseCovariance[1][1] * diff.y * diff.y;
	return (1.0 / (2.0 * PI * sqrt(determinant))) * pow(E, -(1.0 / 2.0) * matMult);
}

void main() {
	vec4 modelPosition = modelMatrix * vec4(position, 1.0);

	probability = 	uTheta1 * pdf(uMean1, uDeterminant1, uInverseCovariance1, vec2(position.x, position.y)) +
					uTheta2 * pdf(uMean2, uDeterminant2, uInverseCovariance2, vec2(position.x, position.y)) + 
					uTheta3 * pdf(uMean3, uDeterminant3, uInverseCovariance3, vec2(position.x, position.y));
	modelPosition.y += 50.0 * probability;

	vec4 viewPosition = viewMatrix * modelPosition;
	vec4 projectedPosition = projectionMatrix * viewPosition;

	gl_Position = projectedPosition; 
} 
`

const gaussian = (x, y, a, b, c, d) => {
    const covarianceMatrix = new Array(2);

    covarianceMatrix[0] = new Array(2);
    covarianceMatrix[1] = new Array(2);
    
    covarianceMatrix[0][0] = a;
    covarianceMatrix[0][1] = b;
    covarianceMatrix[1][0] = c;
    covarianceMatrix[1][1] = d;
    
    const determinant = covarianceMatrix[0][0] * covarianceMatrix[1][1] - covarianceMatrix[0][1] * covarianceMatrix[1][0]
    
    const inverseCovarianceMatrix = new Array(2);
    
    inverseCovarianceMatrix[0] = new Array(2);
    inverseCovarianceMatrix[1] = new Array(2);
    
    inverseCovarianceMatrix[0][0] = (1 / determinant) * covarianceMatrix[1][1];
    inverseCovarianceMatrix[0][1] = (1 / determinant) * -covarianceMatrix[0][1];
    inverseCovarianceMatrix[1][0] = (1 / determinant) * -covarianceMatrix[1][0];
    inverseCovarianceMatrix[1][1] = (1 / determinant) * covarianceMatrix[0][0];
    
    const invCov = new Array(4)
    invCov[0] = inverseCovarianceMatrix[0][0]
    invCov[1] = inverseCovarianceMatrix[0][1]
    invCov[2] = inverseCovarianceMatrix[1][0]
    invCov[3] = inverseCovarianceMatrix[1][1]
    
    const mean = new Array(2);
    mean[0] = x
    mean[1] = y

    return [mean, determinant, invCov]
}