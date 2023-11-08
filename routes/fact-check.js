import { getBaseURL } from '../lib/utils.js'
import FactCheckBot from '../lib/bots/fact-check.js'

const getBiasSearchURL = baseUrl => {
    const params = new URLSearchParams({ s: baseUrl }).toString()
    return `https://mediabiasfactcheck.com/?${params}`
}

export default (req, res) => {
    const { url } = req.body
    const baseURL = getBaseURL(url)
    const searchURL = getBiasSearchURL(baseURL)
    const factCheckBotInstance = new FactCheckBot({ url: baseURL })
    factCheckBotInstance.setup();

    res.json({
        baseURL,
        searchURL
    })
}