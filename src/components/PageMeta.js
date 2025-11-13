export default class PageMeta extends HTMLElement {

    #title = 'Atlas, Rise!'
    #description = 'Atlas, Rise!'

    static get tag() { return 'page-meta'}

    constructor() {
        super()
        this.title = this.getAttribute('title') || this.#title
        this.description = this.getAttribute('description') || this.#description
    }

    set title(v) {
        document.title = v
        const ogEl = document.querySelector('meta[name="og:title"]')
        if (ogEl) ogEl.content = v
    }

    get title() { return document.title }

    set description(v) {
        const el = document.querySelector('meta[name=description]')
        if (el) el.content = v
        const ogEl = document.querySelector('meta[name="og:description"]')
        if (ogEl) ogEl.content = v
    }

    get description() {
        const el = document.querySelector('meta[name=description]')
        return el ? el.content : undefined
    }

}
