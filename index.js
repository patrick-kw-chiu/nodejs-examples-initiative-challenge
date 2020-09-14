
// config
const PORT = 3000

// std lib
const fs = require('fs')

// lib
const express = require('express')
const hbs = require('hbs')
const bent = require('bent')

const app = express()
const getJSON = bent('json')

// utilities
const { extractLatestVersion } = require('./utilities/utilities')

// app
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.set('view engine', 'hbs')

app.get('/dependencies', (req, res) => {
    fs.readFile(`${__dirname}/package.json`, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: 'Internal Server Error',
                message: err,
            })
        }
        
        const dependencies = Object
            .entries(JSON.parse(data).dependencies)
            .map((dependency) => {
                const [package, version] = dependency;
                return {package, version};
            })
        
        return res.render('dependencies.hbs', { dependencies })
    })
})

app.get('/minimum-secure', async (req, res) => {
    const versions = await getJSON('https://nodejs.org/dist/index.json')
    const secureVersions = versions.filter(version => version && version.security === true)
    const minimumSecure = extractLatestVersion(secureVersions)
    return res.json(minimumSecure)
})

app.get('/latest-releases', async (req, res) => {
    const versions = await getJSON('https://nodejs.org/dist/index.json')
    const latestReleases = extractLatestVersion(versions)
    return res.json(latestReleases)
})

app.listen(PORT, () => {
    console.log(`App listening on PORT: ${PORT}`)
});

module.exports = app
