import puppeteer from 'puppeteer'

export default class BaseBot {
    constructor(params) {
        this.params = params
    }        

    async setup() {
        this.browser = await puppeteer.launch({ignoreDefaultArgs: ['--disable-extensions']})
        this.page = await this.browser.newPage()
        
        await this.page.goto(this.params.url)

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
