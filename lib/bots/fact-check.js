import BaseBot from './base-bot.js'

export default class FactCheckBot extends BaseBot {
    constructor(params) { super(params) }

    async execute() {
        try {
            await this.page.screenshot({ path: './test.jpg'})
            const entryLink = await this.page.waitForSelector('article.content-list .entry-title > a')
            console.log(entryLink)
        } catch(error) {
            console.error(error)
        }
    }
}
