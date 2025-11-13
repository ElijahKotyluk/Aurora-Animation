import type { Curve } from "./Curve.js"

class Aurora {
    parentElement: HTMLElement
    width: number
    height: number
    canvas: HTMLCanvasElement
    canvasContext: CanvasRenderingContext2D | null

    curves: Array<Curve>

    running: boolean = false

    constructor (parent: HTMLElement, width: number | null, height: number | null, curves?: Array<Curve>) {
        this.parentElement = parent
        this.width = width || window.innerWidth
        this.height = height || window.innerHeight
        this.curves = curves || []

        this.canvas = document.createElement("canvas")
        this.canvas.width = this.width
        this.canvas.height = this.height
        this.canvasContext = this.canvas.getContext("2d")

        if (this.canvasContext) {
            this.canvasContext.globalCompositeOperation = "color-dodge"
        }

        this.start()

        this.parentElement.appendChild(this.canvas)
    }

    start () {
        this.running = true
        const lastTime = new Date().getTime();
        const _this = this;


        (function animate () {
            if (_this.canvasContext) {
                _this.canvasContext.clearRect(0, 0, _this.width, _this.height)
                for (let i = 0, len = _this.curves.length; i < len; i++) {
                    _this.curves[i]?.update()
                    _this.curves[i]?.draw(_this.canvasContext)
                }
                
                if (_this.running) {
                    requestAnimationFrame(animate)
                }
            }
        })()
    }

    stop () {
        this.running = false
    }

    getCanvas () {
        return this.canvas
    }
    
    getCurves () {
        return this.curves
    }
}

export {
    Aurora,
}
