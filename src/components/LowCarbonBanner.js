export default class LowCarbonBanner extends HTMLElement {

    #repeat = 6

    static get tag () { return 'low-carbon-banner' }

    constructor() {
        super()
        let content = ''
        for (let i = 0; i < this.#repeat; i++) content += this.#content
        this.innerHTML = `
            <div class="bg-default p-20 flex gap-50 overflow-hidden w-100vw">${content}</div>
        `
    }

    get #content() {
        return `
            <div class="flex gap-10">
                <span class="text-nowrap">This is a </span>
                <page-link class="text-nowrap" href="/low-carbon">low carbon˚</page-link>
                <span>website.</span>
            </div>
        `
    }
}
