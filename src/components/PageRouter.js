import routes from '../routes'

export default class PageRouter extends HTMLElement {

    #routes = []
    #route = null
    #routeChangedEv
    #imageObserver

    static get tag() { return 'page-router'}

    constructor() {
        super()
        this.#route = null
        this.#routes = routes

        this.#routeChangedEv = new CustomEvent('routechanged', {
            bubbles: true,
            cancelable: false
        })
        window.addEventListener('popstate', () => {
            if (window.location.pathname != this.#route) {
                this.#loadContent()
                window.scrollTo(0, 0)
                this.#route = window.location.pathname
                this.dispatchEvent(this.#routeChangedEv)
            }
        })

        this.#imageObserver =  new IntersectionObserver(function(entries, self) {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    const img = entry.target
                    if (img.dataset.src) {
                        img.src = img.dataset.src
                        delete img.dataset.src
                    }
                    self.unobserve(img)
                }
            })
        }, {
            rootMargin: '0px 0px 50px 0px',
            threshold: 0
        })
        this.attachLazyObservers()
    }

    async connectedCallback() {
        await this.#loadContent(this.innerHTML.trim() != '')
    }

    attachLazyObservers() {
        document.querySelectorAll('[data-src]').forEach((el) => this.#imageObserver.observe(el))
    }

    get route() {
        return this.#route
    }

    set route(v) {
        this.#route = v
        window.history.pushState({}, "", v)
        this.#fadeContent()
        window.scrollTo(0, 0)
        this.dispatchEvent(this.#routeChangedEv)
    }

    navigate(event) {
        event = event || window.event
        event.preventDefault()
        this.route = event.target.href
    }

    #fadeContent() {
        this.classList.add('fade')
        this.ontransitionend =  () => {
            this.ontransitionend = undefined
            requestAnimationFrame(() => {
                this.#loadContent()
                this.classList.remove('fade')
            })
        }
    }

    async #loadContent(noLoad = false) {
        const path = window.location.pathname
        const route = this.#routes[path] || this.#routes[404]
        let pageClass = path.replaceAll('/', '')
        if (!this.#routes[path])
            pageClass = '404'
        const mainContainer = document.querySelector('#main-container')
        let removeClass = mainContainer.classList.value.replace('main', '').trim()
        if(removeClass.length)
            mainContainer.classList.remove(removeClass)
        mainContainer.classList.add( `page-${pageClass.length ? pageClass : 'main'}`)
        if (!noLoad)
            this.innerHTML = await fetch(route).then((data) => data.text())
        this.attachLazyObservers()
    }

}
