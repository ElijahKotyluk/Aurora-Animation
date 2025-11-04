const AuroraSettings = {
    debug: false,
    curvePoints: 10,
    curvePointXJitter: 1.5,
    curvePointYJitter: 3.5,
    curvePointMaxFloatXDist: 270,
    curvePointMaxFloatYDist: 80,
    curvePointMinFloatDist: 15,
    curvePointMaxFloatTime: 9000,
    curvePointMinFloatTime: 3000,
    brushCount: 1000,
    brushWidth: 30,
    brushHeight: 450,
    brushMinScaleY: .02,
    brushMaxScaleYVariance: .5,
    brushMaxAlphaVariance: .7,
    brushMaxAnimTime: 7000,
    brushMinAnimTime: 1500,
    brushMaxZAnimTime: 80000,
    brushMinZAnimTime: 58000,
    brushAlphaDropoff: .07,
    mouseXOffset: 50,
    mouseYOffset: 25,
    mouseXPercent: .5,
    mouseYPercent: .5,
}

function getQuadraticCurvePoint(start: number, control: number, end: number, t: number): number {
    return (1 - t) * (1 - t) * start + 2 * (1 - t) * t * control + t * t * end
}

export {
    AuroraSettings,
    getQuadraticCurvePoint,
}
