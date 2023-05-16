const emVisFragment=`
uniform vec2 uMean1;
uniform vec2 uMean2;
uniform vec2 uMean3;

uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;

varying vec3 vPosition;
varying float probability;

const float LINES_FREQ = 0.005;
const float LINES_WIDTH = 0.0000001;

float sigmoid(float x) {
    return 1.0 / (1.0 + exp(-x));
}

void main() {
	float dist1 = length(vPosition.xy - uMean1);
	float dist2 = length(vPosition.xy - uMean2);
	float dist3 = length(vPosition.xy - uMean3);

	float mixVal1 = sigmoid(probability) * (1.0 - (dist1 / (dist1 + dist2 + dist3)));
	float mixVal2 = sigmoid(probability) * (1.0 - (dist2 / (dist1 + dist2 + dist3)));
	float mixVal3 = sigmoid(probability) * (1.0 - (dist3 / (dist1 + dist2 + dist3)));

	vec3 color = color1 * mixVal1 + color2 * mixVal2 + color3 * mixVal3;

	float k = mod(probability, LINES_FREQ);
	float sk = smoothstep(0.008/2.0 - LINES_WIDTH, 0.008/2.0 + LINES_WIDTH, k);

	gl_FragColor = vec4(color, sk + 5.0 * probability + 0.2);
}`

export default emVisFragment