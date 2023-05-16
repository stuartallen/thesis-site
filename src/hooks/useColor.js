const useColor = (key) => {
    const colorCodes = {
        'light'     :   '#ffffff',
        'dark'      :   '#695d46',
        'good'      :   '#4db6ac',
        'bad'       :   '#f3830f',
        'neutral'   :   '#b3a77d'
    }

    if(colorCodes[key]) {
        return colorCodes[key]
    } else {
        console.warn('A non existent color was chosen from the color hook')
    }
}

export default useColor