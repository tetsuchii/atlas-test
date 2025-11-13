import PageRouter from './PageRouter'
import PageLink from './PageLink'
import PageMeta from './PageMeta'
import ContactForm from './ContactForm'
import CaptchaImg from './CaptchaImg'
import HeaderMenu from './HeaderMenu'
import PageLogo from './PageLogo'
import PageContactAd from './PageContactAd'
import LowCarbonBanner from './LowCarbonBanner'

const components = [
    PageRouter, PageLink, PageMeta, ContactForm, CaptchaImg, HeaderMenu, PageLogo, PageContactAd, LowCarbonBanner
]

export default async() => {
    components.forEach(async(comp) => {
        try {
            if (comp && comp.tag)
                customElements.define(comp.tag, comp)
        } catch (e) { console.warn(`! Failed loading component: `, e)}
    })
}
