const normalMixGradientFragment=`varying float probability;

void main() {
	vec4 color = mix(vec4(0.0, 0.0, 0.0, 0.7), vec4(0.7, 0.7, 1.0, 1.0), sqrt(sqrt(sqrt(probability))));

	gl_FragColor = vec4(color);
}`

export default normalMixGradientFragment