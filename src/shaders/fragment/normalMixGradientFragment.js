const normalMixGradientFragment=`
varying float probability;

const float LINES_FREQ = 0.005;
const float LINES_WIDTH = 0.0000001;

void main() {
	//	Original way
	// vec4 color = mix(vec4(0.0, 0.0, 0.0, 0.7), vec4(0.7, 0.7, 1.0, 1.0), sqrt(sqrt(sqrt(probability))));

	vec3 color = vec3(0.0, 0.0, 0.0);
	
	float k = mod(probability, LINES_FREQ);
	float sk = smoothstep(0.008/2.0 - LINES_WIDTH, 0.008/2.0 + LINES_WIDTH, k);

	gl_FragColor = vec4(color, max(sk, 0.1));
}`

export default normalMixGradientFragment