import { Brush } from "./Brush.js"
import { CurvePoint } from "./CurvePoint.js"
import { getQuadraticCurvePoint } from "./utils.js"

const CURVE_POINTS = 10
const CURVE_POINT_X_JITTER = 1.5
const CURVE_POINT_Y_JITTER = 3.5

class Curve {
    vanishingPoint: { x: number, y: number, z: number }
    endPoint: { x: number, y: number, z: number}
    brushCount: number | null
    maxBrushAlpha: number
    
    points: Array<CurvePoint> = []

    brushes: Array<Brush> = []
    
    constructor (
        vanishPointX: number,
        vanishPointY: number,
        vanishPointZ: number,
        endPointX: number,
        endPointY: number,
        endPointZ: number,
        brushCount: number,
        maxBrushAlpha: number,
        fill: string | CanvasGradient
    ) {
        this.vanishingPoint = {
            x: vanishPointX,
            y: vanishPointY,
            z: vanishPointZ,
        }
        this.endPoint = {
            x: endPointX,
            y: endPointY,
            z: endPointZ,
        }
        this.brushCount = brushCount
        this.maxBrushAlpha = maxBrushAlpha
        this.points = [new CurvePoint (this.vanishingPoint.x, this.vanishingPoint.y, this.vanishingPoint.z, 0)]

        for (let i = 0; i < CURVE_POINTS - 1; i++) {
            // Modifier for distance
            let modifier = (i + 1) / CURVE_POINTS
            modifier *= modifier

            // Randomly generate points
            const xJitter = Math.random() * CURVE_POINT_X_JITTER - CURVE_POINT_X_JITTER / 2
            let x = this.vanishingPoint.x + modifier * (this.endPoint.x - this.vanishingPoint.x)
            // @TODO Remove casting
            x += xJitter * (x - this.points[i]!.x)

            const yJitter = (1.2 - modifier) * (Math.random() * CURVE_POINT_Y_JITTER - CURVE_POINT_Y_JITTER / 2)
            let y = this.vanishingPoint.y + modifier * (this.endPoint.y - this.vanishingPoint.y)
            // @TODO Remove casting
            y += yJitter * (y - this.points[i]!.y)

            const z = modifier * (this.endPoint.z - this.vanishingPoint.z) + this.vanishingPoint.z

            // @TODO Remove casting
            this.points.push(new CurvePoint(x, y, z, ((Math.random() * .33 + .33) * (x - this.points[i]!.x))))
        }
        // Last point
        this.points.push(new CurvePoint (this.endPoint.x, this.endPoint.y, this.endPoint.z, 0))

        // Generate Brushes
        for (let i = 0; i < this.brushCount; i++) {
            const noScale = Math.random() < .01
            this.brushes.push(
                new Brush(
                    this,
                    (i / this.brushCount) * (this.endPoint.z - this.vanishingPoint.z) + this.vanishingPoint.z,
                    noScale ? "rgb(200, 200, 220)" : fill,
                    noScale
                )
            )
        }
    }

    draw (canvasContext: CanvasRenderingContext2D) {
        for (let i = 0, len = this.brushes.length; i < len; i++) {
            // @TODO Remove casting
            this.brushes[i]!.draw(canvasContext)
        }
    }

    getPointZ (z: number) {
        if (z <= this.points[0]!.z) {
            return this.points[0]
        }
        else if (z >= this.points[this.points.length - 1]!.z) {
            return this.points[this.points.length - 1]
        }
        else {
            let i = 0
            for (const len = this.points.length; i < len; i++) {
                if (z <= this.points[i]!.z) {
                    break
                }
            }

            const lastPoint = this.points[i - 1]
            const lastPointCurvePoints = lastPoint?.getCurvePoints()
            const nextPoint = this.points[i]
            const nextPointCurvePoints = nextPoint?.getCurvePoints()

            const t = (z - lastPoint!.z) / (nextPoint!.z - lastPoint!.z)

            return {
                x: getQuadraticCurvePoint(lastPoint!.x, lastPointCurvePoints![1]!.x, nextPointCurvePoints![0]!.x, t),
                y: getQuadraticCurvePoint(lastPoint!.y, lastPointCurvePoints![1]!.y, nextPointCurvePoints![0]!.y, t),
            }
        }
    }

    update () {
        for (let i = 0, len = this.points.length; i < len; i++) {
            // @TODO Remove casting
            this.points[i]!.updatePosition()
        }
        for (let i = 0, len = this.brushes.length; i < len; i++) {
            // @TODO Remove casting
            this.brushes[i]!.updatePosition()
        }
    }

    setMaxBrushAlpha (alpha: number) {
        this.maxBrushAlpha = alpha
    }
}

export {
    Curve,
}
