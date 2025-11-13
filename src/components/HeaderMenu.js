export default class HeaderMenu extends HTMLElement {

    static get tag() { return 'header-menu' }

    #items = [
        {
            name: 'Services',
            target: '/services'
        },
        /*
        {
            name: 'Academy',
            target: '/academy'
        },
        */
        {
            name: 'Case Studies',
            target: '/case-studies'
        },
        {
            name: 'Get in touch',
            target: '/contact-us'
        },
        {
            name: 'Low Carbon˚',
            target: '/low-carbon'
        },
        {
            name: 'About us',
            target: '/about-us'
        },
    ]

    constructor() {
        super()

        this.innerHTML = `
        <nav>
            <div class="mobile">
                <button class="font-bold bll">Menu <span class="arrow"></span></button>
                <ul>
                    ${this.listMenuItems}
                </ul>
            </div>
            <ul class="desktop">
                ${this.listMenuItems}
            </ul>
        </nav>
        `
        this.querySelector('nav .mobile button').addEventListener('click', (e) => {
            this.isOpen = !this.isOpen
            e.preventDefault()
        })

        this.addEventListener('click', (e) => {
            if (e.target.tagName != 'BUTTON')
                this.isOpen = false
        })
    }

    get listMenuItems() {
        return this.#items.reduce((acc, el) => {
            acc += `<li><page-link class="no-style" href="${el.target}">${el.name}</page-link></li>`
            return acc
        }, '')
    }

    get isOpen() {
        return this.querySelector('nav .mobile ul').classList.contains('open')
    }

    set isOpen(v) {
        if (v) {
            this.querySelector('nav .mobile button').classList.add('menu-open')
            this.querySelector('nav .mobile ul').classList.add('open')
        }
        else {
            this.querySelector('nav .mobile button').classList.remove('menu-open')
            this.querySelector('nav .mobile ul').classList.remove('open')
        }
    }
}
