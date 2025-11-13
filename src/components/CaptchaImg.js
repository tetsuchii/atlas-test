export default class CaptchaImg extends HTMLElement {

    #id = Math.floor(Math.random() * 10000000000)
    #X = 256
    #Y = 64
    #loadTime = 250
    #el
    #img
    #ctx
    #hasError

    static get tag() { return 'captcha-img' }

    constructor() {
        super()
        const shadow = this.attachShadow({ mode: 'open' })
        this.#el = document.createElement('canvas')
        this.#el.title = "Reload ..."
        this.#el.width = this.#X
        this.#el.height = this.#Y
        this.#ctx = this.#el.getContext('2d')
        this.#el.addEventListener('click', (e) => this.reload())
        const style = document.createElement('style')
        style.textContent = this.style
        shadow.append(style, this.#el)
    }

    async connectedCallback() {
        if (window.cimg) this.#img = window.cimg
        else this.#img = await this.#loadImg(this.imageSrc)
        window.cimg = this.#img
        this.#draw()
    }

    get imageSrc() {
        return `/cimg?rand=${this.#id}`
    }

    get style() {
        return `
            * { margin: 0; padding: 0; box-sizing: border-box;}
            :host {
                background-color: rgba(0,0,0, 0.25);
                display: flex;
                justify-content: center;
                align-items: center;
                overflow: hidden;
                user-select: none;
                cursor: pointer;
                width: ${this.#X}px;
                height: ${this.#Y}px;
            }
            canvas {
                border: 2px solid black;
                width: 100%;
                height: 0;
                max-width: 100%;
                max-height: 100%;
                transition: all ${this.#loadTime / 1000}s ease-in-out;
                will-change: height;
            }
        `
    }

    #draw() {
        requestAnimationFrame(() => {
            this.#ctx.clearRect(0, 0, this.#X, this.#Y)
            this.#ctx.width = this.#X
            this.#ctx.height = this.#Y
            if (this.#hasError)
            {
                this.#ctx.lineWidth = 5
                this.#ctx.strokeStyle = 'red'
                this.#ctx.beginPath()
                this.#ctx.arc(
                    this.#X / 2, this.#Y / 2, this.#X / 16, 0, Math.PI * 2
                )
                this.#ctx.stroke()
                this.#ctx.textAlign = 'center'
                this.#ctx.fillStyle = 'white'
                this.#ctx.font = '40px Helvetica'
                this.#ctx.fillText('!', this.#X / 2, this.#Y / 2 + 15)
            } else {
                this.#ctx.drawImage(this.#img, 0, 0, this.#X, this.#Y)
            }
            this.#el.style.height = `${this.#Y}px`
        })
    }

    #loadImg(src) {
        this.#hasError = false
        const img = document.createElement('img')
        img.src = src
        return new Promise((resolve) => {
            img.onload = () => resolve(img)
            img.onerror = () => {
                this.#hasError = true
                const img = new Image(this.#X, this.#Y)
                resolve(img)
            }
        })
    }

    reload() {
        this.#el.style.height = 0
        setTimeout(async() => {
            this.#id = Math.floor(Math.random() * 10000000000)
            this.#img = await this.#loadImg(this.imageSrc)
            window.cimg = this.#img
            this.#draw()
        }, this.#loadTime)
    }

}
