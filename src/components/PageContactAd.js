export default class PageContactAd extends HTMLElement {

    static get tag () { return 'page-contact-ad' }

    constructor() {
        super()
        this.innerHTML = `
<section style="background-image: url('/assets/images/dodo-invert.webp');">
    <div class="flex flex-column h-40 side-padding pt-80">
        <div class="mb-40">
            <h1 class="main-header">LET'S CONTINUE OVER A COFFEE.*</h1>
        </div>

        <div class="mb-40 light-shadow p-20 bg-default times italic">
            <p>*or any of the numerous remote meeting tools that have been making our lives wonderful for the past three years.  But be prepared to be judged by your virtual background - and we can tell if you aren’t really sitting on a beach among palm trees.</p>
        </div>

        <div class="mb-40">
            <page-link href="/contact-us" class="button block onblack">GET IN TOUCH</page-link>
        </div>

        <div class="mb-40 light-shadow p-20 bg-default">
            <p>We don’t send newsletters because, well, it’s 2025 and there is a really slim chance of you ever opening one. Also mass emails require servers, servers require electricity… you know the rest. So if you would like to hear updates from us, you can follow us on: LinkedIn</p>
        </div>

        <div class="mb-40 alt light-shadow p-20">
            <p>We are a remote first company, most of the time you can find us in Budapest, Hungary. We do most of our work in Europe (because time zones), but feel free to contact us from anywhere, we will find a way to sort it out.</p>
        </div>
    </div>
</section>
        `
    }
}
