export default class PageLogo extends HTMLElement {

    static get tag () { return 'page-logo' }

    constructor() {
        super()
        this.innerHTML = `
            <page-link class="logo-link no-style" href="${this.getAttribute('href')}">
                <div class="logo">
                    <div class="atlas"><i>A</i>TLAS<span>,</span></div>
                    <div class="rise"><i><b>R</b>i<b>S</b></i>e<b>!</b></div>
                </div>
            </page-link>
        `
    }
}
