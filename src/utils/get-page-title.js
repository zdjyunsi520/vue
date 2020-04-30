import defaultSettings from '@/settings'

var title = defaultSettings.title || ''

export default function getPageTitle(pageTitle, someTitle) {
    title = someTitle || title
    if (pageTitle) {
        return `${title} - ${pageTitle}`
    }
    return `${title}`
}