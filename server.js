const express = require('express')
const fs = require('fs')
const hbs = require('hbs')
const app = express()

// Heroku port requirement
const port = process.env.PORT || 3000

// Heroku requires 'package.json' to have a start script:
// scripts: "start": "node server.js"
// afterwards, the app can be started from the terminal with 'npm start' instead of 'node server.js'

hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs')

app.use((req, res, next) => {
    const now = new Date().toString()
    const log = `${now}: ${req.method} ${req.url}`

    console.log(log)
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to write to log file.')
        }
    })
    next()
})

// app.use((req, res, next) => {
//     res.render('maintenance')
// })

app.use(express.static(__dirname + '/public'))

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear()
})
hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase()
})

app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home page',
        welcomeMessage: 'Welcome to my website',
    })
})

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page'
    });
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Unable to handle request'
    })
})

app.get('/projects', (req, res) => {
    res.render('projects.hbs', {
        pageTitle: 'Projects'
    })
})
app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})