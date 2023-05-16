//	Adapted from https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
export default function hexToRGB(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return [
		parseInt(result[1], 16) / 255,
		parseInt(result[2], 16) / 255,
		parseInt(result[3], 16) / 255
    ]
}