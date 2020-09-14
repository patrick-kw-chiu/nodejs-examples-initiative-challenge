
// std lib
const assert = require('assert')

// lib
const tape = require('tape')
const nock = require('nock')
const bent = require('bent')
const getPort = require('get-port')

const getJSON = bent('json')
const getBuffer = bent('buffer')

// server
const server = require('../')

// sample response
const sampleMinimumReleases = require('./fixtures/minimumReleases.json')
const sampleLatestReleases = require('./fixtures/latestReleases.json')


const context = {}

tape('setup', async function (t) {
	const port = await getPort()
	context.server = server.listen(port)
	context.origin = `http://localhost:${port}`

	t.end()
})

tape('should get dependencies', async function (t) {
	const html = (await getBuffer(`${context.origin}/dependencies`)).toString()
    
    t.ok(html.includes('bent - ^7.3.10'), 'should contain bent');
    t.ok(html.includes('express - ^4.17.1'), 'should contain express');
    t.ok(html.includes('hbs - ^4.1.1'), 'should contain hbs');
    t.ok(html.includes('semver - ^7.3.2'), 'should contain semver');
})

tape('should get minimum secure versions', async function (t) {
    nock(`http://localhost:${context.origin}`, {
		reqheaders: {
			accept: 'application/json'
		}
	})
		.get('/minimum-secure')
        .reply(200, sampleMinimumReleases)
        
    const minSecureReleases = await getJSON(`${context.origin}/minimum-secure`)

    t.ok(minSecureReleases.v0.version === 'v0.12.17', 'v0 version should match')
    t.ok(minSecureReleases.v4.version === 'v4.9.0', 'v4 version should match')
})

tape('should get latest-releases', async function (t) {
    nock(`http://localhost:${context.origin}`, {
		reqheaders: {
			accept: 'application/json'
		}
	})
		.get('/latest-releases')
        .reply(200, sampleLatestReleases)

    const latestReleases = await getJSON(`${context.origin}/latest-releases`)

    t.ok(latestReleases.v14.version === 'v14.10.1', 'v14 version should match')
    t.ok(latestReleases.v13.version === 'v13.14.0', 'v13 version should match')
})

tape('teardown', function (t) {
	context.server.close()
	t.end()
})
