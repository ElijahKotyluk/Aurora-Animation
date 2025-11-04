import { Aurora } from "./Aurora.js"
import { Curve } from "./Curve.js"
import { AuroraSettings } from "./utils.js"

const generateAurora = () => {
    const gradientCanvas = document.createElement("canvas")!
    const gradientContext = gradientCanvas.getContext("2d")!
    const gradient = gradientContext?.createLinearGradient(window.innerWidth * .5, window.innerHeight, window.innerWidth * .35, 0)
    gradient?.addColorStop(.4, "rgb(50, 130, 80)")
    gradient?.addColorStop(.6, "rgb(100, 100, 120, .5)")

    const gradient2 = gradientContext?.createLinearGradient(window.innerWidth * .5, window.innerHeight * .5, window.innerWidth * .3, 0)
    gradient2?.addColorStop(.35, "rgb(50, 130, 140)")
    gradient2?.addColorStop(.7, "rgb(50, 70, 100, .7)")

    const curves = [
        new Curve (window.innerWidth * .16, window.innerHeight * .54, .01, window.innerWidth * .7, window.innerHeight * .7, .7, AuroraSettings.brushCount * .2, .3, "rgb(60, 150, 120)"),
        new Curve (window.innerWidth * .17, window.innerHeight * .94, .01, window.innerWidth * .8, window.innerHeight * .8, .8, AuroraSettings.brushCount * .3, .4, "rgb(60, 150, 120)"),
        new Curve (window.innerWidth * .1, window.innerHeight * .9, .05, window.innerWidth * .8, window.innerHeight * .4, 1, 0, .8, gradient),
        new Curve (window.innerWidth * .25, window.innerHeight * .65, .33, window.innerWidth * .55, 0, 1.1, AuroraSettings.brushCount * .6, 1, gradient2),
        new Curve (window.innerWidth * .35, window.innerHeight * .75, .43, window.innerWidth * .55, 0, 1.1, AuroraSettings.brushCount * .6, 1, gradient2)
    ]

    const auroraAnimation = new Aurora(document.body, null, null, curves)

    return auroraAnimation
}

export {
    generateAurora,
}
