const normalMixFragment = `
varying float probability;

const float LINES_FREQ = 0.005;
const float LINES_WIDTH = 0.0000001;

const vec3 BOTTOM_COLOR = vec3(0.0, 0.0, 1.0);
const vec3 TOP_COLOR = vec3(1.0, 0.0, 0.0);

float sigmoid(float value) {
	return 1.0 / (1.0 + exp(-value));
}

void main() {
	vec3 color = mix(BOTTOM_COLOR, TOP_COLOR, sigmoid(100.0 * probability + 0.0));
	
	float k = mod(probability, LINES_FREQ);
	float sk = smoothstep(0.008/2.0 - LINES_WIDTH, 0.008/2.0 + LINES_WIDTH, k);

	gl_FragColor = vec4(color, max(sk, 0.1));
}
`

export default normalMixFragment