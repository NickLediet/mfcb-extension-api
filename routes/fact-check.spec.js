import { getVersion } from 'jest'
import routeCallback, { getBiasSearchURL, getReport, getSourceListPage } from './fact-check.js'
import axios from 'axios'

const mockAxiosGetHtml = html => {
    const mockGet = jest.spyOn(axios, 'get')
    mockGet.mockImplementation(() => Promise.resolve({ data: html }))
}

describe('routes/fact-check.spec', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('getBiasSearchURL()', () => {
        it('generates an encoded media fact check bias search URL with the provided source base url', () => {            
            expect(getBiasSearchURL('https://www.bbc.com')).toBe('https://mediabiasfactcheck.com/?s=https%3A%2F%2Fwww.bbc.com')
        })

        it('throws an error if a base URL is not provided', () => {
            const t = () => getBiasSearchURL()
            expect(t).toThrow('Missing required param "baseUrl".  Provide URL to be used in Media Fact Check Bias Search')
        })
    })

    describe('getSourceListPage()', () => {
        it('resolves to the link value provided valid markup', async () => {
            const html = `
                <article class="content-list">
                    <div class="entry-title"><a href="https://google.ca"></a></div>
                </article>`
            mockAxiosGetHtml(html)

            expect(await getSourceListPage('https://foo.bar')).toBe('https://google.ca')
        })

        it('returns null if there is no valid link element', async () => {
            const html = `
                    <div class="content-list">
                    <div class="entry-title">
                        <h3>Test header</h3>
                    </div>
                </div>`
            mockAxiosGetHtml(html)
            expect(await getSourceListPage('https://foo.bar')).toBe(null)
        })

        it('throws an error if a source page URL is not provided', async () => {
            await expect(getSourceListPage()).rejects.toThrowError('Missing required param "url".  Provide a Media Fact Check Bias search resualt URL');
        })
    })

    describe('getReport()', () => {
        it('throws an error if a source page URL is not provided', async () => {
            await expect(getReport()).rejects.toThrowError('Missing required param "url".  Provide a Media Fact Check Bias source entry URL');
        })

        it('generates the correct structure report data provided correctly formatter markup', async () => {
            const html = `
                <div class="entry-content">
                    <div class="entry-content">
                        <p></p>
                        <p>
                            Bias Rating: LEFT-CENTER
                            Factual Reporting: HIGH
                            Country: United Kingdom
                            Press Freedom Rank: MOSTLY FREE
                            Media Type: TV Station
                            Traffic/Popularity: High Traffic
                            MBFC Credibility Rating: HIGH CREDIBILITY
                        </p>
                    </div>
                </div>`
            mockAxiosGetHtml(html)

            expect(await getReport('https://mediabiasfactcheck.com/bbc/')).toEqual({
                biasRating: 'LEFT-CENTER',
                factualReporting: 'HIGH',
                country: 'United Kingdom',
                pressFreedomRank: 'MOSTLY FREE',
                mediaType: 'TV Station',
                trafficAndPopularity: 'High Traffic',
                credibilityRating: 'HIGH CREDIBILITY'
            })
        })
    })
})