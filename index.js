import bodyParser from 'body-parser'
import express from 'express'
import factCheck from './routes/fact-check.js'

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/fact-check', factCheck)

app.listen(3000, () => {
    console.log('Listening on port 3000...')
})
