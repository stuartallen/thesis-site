const normalMixFragment = `
varying float probability;

void main() {
	vec3 color = mix(vec3(0.0, 0.0, 1.0), vec3(1.0, 0.0, 0.0), sqrt(sqrt(probability)));

	gl_FragColor = vec4(color, 1.0);
}
`

export default normalMixFragment