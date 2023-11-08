import puppeteer from 'puppeteer'

export default class BaseBot {
    constructor(params) {
        this.params = params
    }        

    async setup() {
        this.browser = await puppeteer.launch({
            headless: 'new',
            ignoreDefaultArgs: ['--disable-extensions'],
            args: [
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--no-first-run',
                '--no-sandbox',
                '--no-zygote',
                '--deterministic-fetch',
                '--disable-features=IsolateOrigins',
                '--disable-site-isolation-trials',
            ]
        })
        this.page = await this.browser.newPage()
        
        await this.page.goto(this.params.url, { waitUntil: ['domcontentloaded']})

        await this.execute()
        await this.kill()
    }

    async execute() {
        throw new Error('execute() is not implemented! Please extend lib/base-bot.js and implement a custom executed')
    }

    async kill() {
        this.browser.close()
    } 
}
