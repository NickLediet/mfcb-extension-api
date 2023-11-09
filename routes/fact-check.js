import { getBaseURL } from '../lib/utils.js'
import axios from 'axios'
import cheerio from 'cheerio'

let resualtCache = {}

const getBiasSearchURL = baseUrl => {
    const params = new URLSearchParams({ s: baseUrl }).toString()
    return `https://mediabiasfactcheck.com/?${params}`
}

const getSourceListPage = async (url) => {
    const { data: html } = await axios.get(url)
    const $ = cheerio.load(html)
    return $('article.content-list .entry-title a').attr('href')
}

const getReport = async (url) => {
    const { data: html } = await axios.get(url)
    const $ = cheerio.load(html)
    const content = $('.entry-content .entry-content p:nth-of-type(2)')
    const reportDataKeys = [
        'biasRating',
        'factualReporting',
        'country',
        'pressFreedomRank',
        'mediaType',
        'trafficAndPopularity',
        'credibilityRating'
    ]
    const reportElementValues = content.text().split('\n')
        .map(kvp => kvp.split(':')[1].trim());

    return reportDataKeys.reduce((reportData, key, index) => {
        reportData[key] = reportElementValues[index]
        return reportData
    },{})
}

export default (req, res) => {
    const { url } = req.body
    const baseURL = getBaseURL(url)

    if(resualtCache[baseURL]) return res.json({ ...resualtCache[baseURL], cached: true })

    const searchURL = getBiasSearchURL(baseURL)

    getSourceListPage(searchURL)
        .then(async (searchSourceURL) => await getReport(searchSourceURL))
        .then(reportDataJson => {
            const response = {
                ...reportDataJson,
                baseURL,
                searchURL,
                cached: false
            }
            resualtCache[baseURL] = response
            res.json(response)
        })
}