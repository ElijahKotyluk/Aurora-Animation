import type { Curve } from "./Curve.js";
import { AuroraSettings } from "./utils.js";

class Brush {
    curve: Curve
    z: number
    alpha: number
    scaleX: number
    scaleY: number
    noScale: boolean
    color: string | CanvasGradient
    alphaAnimationTime: number
    alphaVariance: number
    alphaMin: number
    alphaAnimationOffset: number
    
    scaleYAnimationTime: number
    scaleYVariance: number
    scaleYMin: number
    scaleYAnimationOffset: number

    zAnimationOffset: number
    zAnimationTime: number

    startTime?: number

    constructor (curve: Curve, z: number, color: string | CanvasGradient, noScale: boolean = false) {

        this.curve = curve
        this.z = z
        this.color = color
        this.noScale = noScale

        this.alpha = z * Math.random() * .55 + .15
        this.scaleY = (1 - AuroraSettings.brushMinScaleY) * Math.random()
        this.scaleX = .5 * Math.random() * (2 - this.scaleY * 2)
        this.noScale = noScale
        this.color = color || "rgb(50, 170, 82)"

        this.alphaAnimationTime = Math.random() * (AuroraSettings.brushMaxAnimTime - AuroraSettings.brushMinAnimTime) + AuroraSettings.brushMinAnimTime
        this.alphaVariance = this.alpha * AuroraSettings.brushMaxAlphaVariance
        this.alphaMin = Math.max(this.alpha - this.alphaVariance / 2, 0)
        this.alphaAnimationOffset = Math.random() * Math.PI

        this.scaleYAnimationTime = Math.random() * (AuroraSettings.brushMaxAnimTime - AuroraSettings.brushMinAnimTime) + AuroraSettings.brushMinAnimTime
        this.scaleYVariance = Math.random() * AuroraSettings.brushMaxScaleYVariance
        this.scaleYMin = this.scaleY - this.scaleYVariance / 2, 0
        this.scaleYAnimationOffset = Math.random() * Math.PI

        this.zAnimationOffset = this.curve.vanishingPoint.z - (this.z - this.curve.vanishingPoint.z)
        this.zAnimationTime = Math.random() * (AuroraSettings.brushMaxZAnimTime - AuroraSettings.brushMinZAnimTime) + AuroraSettings.brushMinZAnimTime

        if (this.noScale) {
            this.alphaMin = 0
            this.alphaVariance = 1
        }
    }

    draw (canvasContext: CanvasRenderingContext2D) {
        if (this.z < this.curve.vanishingPoint.z || this.z > this.curve.endPoint.z) {
            return false;
        }

        let scaleX,
            scaleY

        const point = this.curve.getPointZ(this.z)
        let alpha = ((.5 + .5 * Math.min(this.z, 1)) * this.alpha * this.curve.maxBrushAlpha)

        if (this.z - this.curve.vanishingPoint.z < AuroraSettings.brushAlphaDropoff) {
            alpha *= (this.z - this.curve.vanishingPoint.z) / AuroraSettings.brushAlphaDropoff
        }
        else if (this.curve.endPoint.z - this.z < AuroraSettings.brushAlphaDropoff) {
            alpha *= (this.curve.endPoint.z - this.z) / AuroraSettings.brushAlphaDropoff
        }

        if (!this.noScale) {
            scaleY = this.z * this.scaleY + AuroraSettings.brushMinScaleY
            scaleX = this.z * this.scaleX + .5
        }
        else {
            scaleY = this.scaleY + AuroraSettings.brushMinScaleY
            scaleX = this.scaleX + .5
        }

        if (point) {
            canvasContext.beginPath()
            canvasContext.moveTo(point.x, point.y - scaleY * AuroraSettings.brushHeight)
            canvasContext.quadraticCurveTo(point.x + scaleX * AuroraSettings.brushWidth / 2, point.y - scaleY * AuroraSettings.brushHeight, point.x + scaleX * AuroraSettings.brushWidth / 2, point.y);
            canvasContext.quadraticCurveTo(point.x + scaleX * AuroraSettings.brushWidth / 2, point.y + scaleY * AuroraSettings.brushWidth, point.x, point.y + scaleX * AuroraSettings.brushWidth / 2);
            canvasContext.quadraticCurveTo(point.x - scaleX * AuroraSettings.brushWidth / 2, point.y + scaleY * AuroraSettings.brushWidth, point.x - scaleX * AuroraSettings.brushWidth / 2, point.y);
            canvasContext.quadraticCurveTo(point.x - scaleX * AuroraSettings.brushWidth / 2, point.y - scaleY * AuroraSettings.brushHeight, point.x, point.y - scaleY * AuroraSettings.brushHeight);
            canvasContext.fill();
        }

    }

    updatePosition () {
        if (!this.startTime) {
            this.startTime = new Date().getTime() - 20000
        }

        const now = new Date().getTime()
        const delta = now - this.startTime

        this.alpha = Math.min(this.alphaMin + (Math.sin((delta / this.alphaAnimationTime) * Math.PI + this.alphaAnimationOffset) * .5 + .5) * this.alphaVariance, 1)
        this.scaleY = this.scaleYMin + (Math.sin((delta / this.scaleYAnimationTime) * Math.PI + this.scaleYAnimationOffset) * .5 + .5) * this.scaleYVariance
        this.z = ((delta / this.zAnimationTime) + this.zAnimationOffset) * this.curve.endPoint.z

        if (this.z > this.curve.vanishingPoint.z) {
            this.z *= this.z
        }
        if (this.z > this.curve.endPoint.z) {
            this.z = (this.z - this.curve.endPoint.z) + this.curve.vanishingPoint.z
            this.startTime = now
        }
    }
}

export {
    Brush,
}
