import { AuroraSettings } from "./utils.js"

// @TODO Add getters and setters, make some members private if they don't need to be exposed.
class CurvePoint {
    x: number
    y: number
    z: number
    pointLength: number
    pointYOffset: number

    xAnimationTime: number
    xVariance: number
    xMin: number
    xAnimationOffset: number

    yAnimationTime:  number
    yVariance: number
    yMin: number
    yAnimationOffset: number

    startTime?: number

    constructor (
        x: number,
        y: number,
        z: number,
        pointLength: number,
    ) {
        this.x = x
        this.y = y
        this.z = z
        this.pointLength = pointLength
        this.pointYOffset = Math.random() * pointLength - pointLength

        this.xAnimationTime = Math.random() * (AuroraSettings.curvePointMaxFloatTime - AuroraSettings.curvePointMinFloatTime) + AuroraSettings.curvePointMinFloatTime
        this.xVariance = Math.max(Math.random() * this.z * (AuroraSettings.curvePointMaxFloatXDist), AuroraSettings.curvePointMinFloatDist)
        this.xMin = this.x - this.xVariance / 2
        this.xAnimationOffset = Math.random() * Math.PI

        this.yAnimationTime = Math.random() * (AuroraSettings.curvePointMaxFloatTime - AuroraSettings.curvePointMinFloatTime) + AuroraSettings.curvePointMinFloatTime
        this.yVariance = Math.max(Math.random() * this.z * (AuroraSettings.curvePointMaxFloatYDist), AuroraSettings.curvePointMinFloatDist)
        this.yMin = this.y - this.yVariance / 2
        this.yAnimationOffset = Math.random() * Math.PI
    }

    getCurvePoints (): Array<{x: number, y: number}> {
        return [
            {
                x: this.x - this.pointLength,
                y: this.y - this.pointYOffset,
            },
            {
                x: this.x + this.pointLength,
                y: this.y + this.pointYOffset,
            },
        ]
    }

    updatePosition (): void {
        if (!this.startTime) {
            this.startTime = new Date().getTime()
            const now = new Date().getTime()
            const deltaTime = now - this.startTime

            this.x = this.xMin + (Math.sin((deltaTime / this.xAnimationTime) * Math.PI + this.xAnimationOffset) * .5 + .5) * this.xVariance
            this.x += this.z * (1 - .5 * 2) * AuroraSettings.mouseXOffset

            this.y = this.yMin + (Math.sin((deltaTime / this.yAnimationTime) * Math.PI + this.yAnimationOffset) * .5 + .5) * this.yVariance
            this.y += this.z * (1 - .5 * 2) * AuroraSettings.mouseYOffset
        }
    }
}

export {
    CurvePoint,
}
