const useColor = (key) => {
    const colorCodes = {
        'light'     :   '#ffffff',
        'dark'      :   '#695d46',
        'neutral'   :   '#B3A77D',
        'cluster1'  :   '#5CC2A9',
        'cluster2'  :   '#DF8F10',
        'cluster3'  :   '#E27F7F'
    }

    if(colorCodes[key]) {
        return colorCodes[key]
    } else {
        console.warn('A non existent color was chosen from the color hook')
    }
}

export default useColor