const normalMixFragment = `
uniform vec3 BOTTOM_COLOR;
uniform vec3 TOP_COLOR;
uniform float BASE_ALPHA;

varying float probability;

const float LINES_FREQ = 0.005;
const float LINES_WIDTH = 0.0000001;

float sigmoid(float value) {
	return 1.0 / (1.0 + exp(-value));
}

void main() {
	vec3 color = mix(BOTTOM_COLOR, TOP_COLOR, sigmoid(150.0 * (probability - 0.01)));
	
	float k = mod(probability, LINES_FREQ);
	float sk = smoothstep(0.008/2.0 - LINES_WIDTH, 0.008/2.0 + LINES_WIDTH, k);

	gl_FragColor = vec4(color, max(sk, BASE_ALPHA));
}
`

export default normalMixFragment