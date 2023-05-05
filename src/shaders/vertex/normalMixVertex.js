const normalMixVertex = `
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
varying vec3 vPosition;

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
	vPosition = position;

	probability = 	uTheta1 * pdf(uMean1, uDeterminant1, uInverseCovariance1, vec2(position.x, position.y)) +
					uTheta2 * pdf(uMean2, uDeterminant2, uInverseCovariance2, vec2(position.x, position.y)) + 
					uTheta3 * pdf(uMean3, uDeterminant3, uInverseCovariance3, vec2(position.x, position.y));
	modelPosition.y += 30.0 * probability;

	vec4 viewPosition = viewMatrix * modelPosition;
	vec4 projectedPosition = projectionMatrix * viewPosition;

	gl_Position = projectedPosition; 
} 
`

export default normalMixVertex