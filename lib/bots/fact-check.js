import BaseBot from './base-bot.js'

export default class FactCheckBot extends BaseBot {
    constructor(params) { super(params) }

    async execute() {
        const entryLink = await this.page.selectwaitForSelector('article.content-list .entry-title > a')
        console.log(entryLink)
    }
}
