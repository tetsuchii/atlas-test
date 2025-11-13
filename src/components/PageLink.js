export default class PageLink extends HTMLElement {

    #el
    #style
    #href
    #observer

    static get tag() { return 'page-link' }

    constructor() {
        super()
        this.#el = document.createElement('a')
        this.#el.classList.add('page-link')
        if(this.classList.contains('no-style'))
            this.#el.classList.add('no-style')
        this.#el.addEventListener('click', (e) => e.preventDefault())
        this.#el.innerHTML = this.innerHTML
        this.href = this.getAttribute('href')

        const router = document.querySelector('page-router')
        if (router) {
            this.addEventListener('click', (e) => router.navigate({ target: { href: this.href }, preventDefault: () => {} }))
            router.addEventListener('routechanged', (e) => {
                this.checkActive()
            })
        }

        this.innerHTML = ''
        this.append(this.#el)

        this.#observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (oldHref != document.location.href) {
                    oldHref = document.location.href
                }
            });
        })
    }

    static get observedAttributes() {
        return ['href']
    }

    async connectedCallback() {
        this.checkActive()
    }

    checkActive() {
        if (this.href === window.location.pathname)
            this.#el.classList.add('active')
        else
            this.#el.classList.remove('active')
    }

    get href() {
        return this.#href
    }

    set href(val) {
        this.#href = val
        this.#el.href = val
        this.checkActive()
    }

    attributeChangeCallback(attr, oldVal, newVal) {
        if (attr === 'href') this.#href = newVal
    }

}
