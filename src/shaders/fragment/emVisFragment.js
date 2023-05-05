const emVisFragment=`
uniform vec2 uMean1;
uniform vec2 uMean2;
uniform vec2 uMean3;

varying vec3 vPosition;
varying float probability;

const float LINES_FREQ = 0.005;
const float LINES_WIDTH = 0.0000001;

void main() {
	//	Original way
	// vec4 color = mix(vec4(0.0, 0.0, 0.0, 0.7), vec4(0.7, 0.7, 1.0, 1.0), sqrt(sqrt(sqrt(probability))));

	const vec3 color1 = vec3(1.0, 1.0, 0.0);
	const vec3 color2 = vec3(0.0, 1.0, 1.0);
	const vec3 color3 = vec3(1.0, 0.0, 1.0);

	// vec3 vertexPos = vPosition.xyz / vPosition.w;

	float dist1 = length(vPosition.xy - uMean1);
	float dist2 = length(vPosition.xy - uMean2);
	float dist3 = length(vPosition.xy - uMean3);

	vec3 color = 	(dist1 <= dist2 && dist1 <= dist3) ? color1 :
                	(dist2 <= dist1 && dist2 <= dist3) ? color2 :
                	color3;
	
	float k = mod(probability, LINES_FREQ);
	float sk = smoothstep(0.008/2.0 - LINES_WIDTH, 0.008/2.0 + LINES_WIDTH, k);

	gl_FragColor = vec4(color, sk + 5.0 * probability);
}`

export default emVisFragment