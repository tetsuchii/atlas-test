export default class ContactForm extends HTMLElement {

    static get tag() { return 'contact-form' }

    #url = '/submit'

    constructor() {
        super()

        this.innerHTML = `
        <form method="post" action="${this.#url}" enctype="multipart/form-data" class="side-padding">
        <ul class="form-fields">
            <li class="flex flex-wrap gap-20">
                <div class="flex-1" style="min-width: 200px;">
                    <label for="name">Name</label>
                    <input id="name" type="text" name="name" placeholder="Your name" required>
                </div>
                <div class="flex-1" style="min-width: 200px;">
                    <label for="company">Company</label>
                    <input id="company" type="text" name="company" placeholder="Company">
                </div>
            </li>
            <li>
                <label for="discuss">What would you like to discuss?</label>
                <textarea id="discuss" name="discuss"></textarea>
            </li>

            <li class="flex flex-wrap gap-20">
                <div class="flex-1" style="min-width: 200px;">
                    <label for="email">Email address</label>
                    <input id="email" type="email" name="email" id="email" placeholder="user@example.com" required>
                </div>
                <div class="flex flex-column flex-1">
                    <captcha-img></captcha-img>
                </div>
                <div class="flex-1" style="min-width: 200px;">
                    <label for="cimginput">Captcha</label>
                    <input id="cimginput" type="text" name="c" required>
                </div>
            </li>
            <li>
                <label class="flex align-end">
                    <input type="checkbox" required value="1" name="privacy">
                    I agree to the privacy policy of Atlas, Rise!
                </label>
            </li>
            <li class="form-error font-bold text-center"></li>
            <li>
                <button type="submit" value="submit" class"block">Send</button>
            </li>
        </ul>
        </form>
        `

        const form = this.querySelector('form')
        form.addEventListener('submit', (e) => {
            this.#send()
            e.preventDefault()
        })
    }

    async connectedCallback() {
        const router = document.querySelector('page-router')
        if (router)
            router.attachLazyObservers()
    }

    #lockElements(locked = false) {
        this.querySelectorAll('input').forEach((el) => el.disabled = locked)
        this.querySelectorAll('textarea').forEach((el) => el.disabled = locked)
        this.querySelectorAll('button').forEach((el) => el.disabled = locked)
    }

    async #send() {
        this.querySelector('li.form-error').innerHTML = ''
        const formData = new FormData(this.querySelector('form'))

        this.#lockElements(true)

        try {
            const res = await fetch(this.#url, {
                method: 'POST',
                mode: 'no-cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Accept': 'application/json'
                },
                body: formData
            }).then((r) => r.json())
            if (res && res.status && res.status == 'OK') {
                const router = document.querySelector('page-router')
                if (router) router.navigate({
                    target: { href: '/thank-you' },
                    preventDefault: () => {}
                })
            } else {
                this.querySelector('li.form-error').innerHTML = 'Error, please check required fields and retry.'
            }
        } catch (e) {
            this.querySelector('li.form-error').innerHTML = 'Failed sending the form, please retry ...'
        }

        this.#lockElements(false)
    }

}
