const Router = require('koa-router')
const router = new Router()
const got = require('got')
const _ = require('lodash')
const WordPOS = require('wordpos')
const wordpos = new WordPOS()
const BASE_PATH = process.env.BASE_PATH || 'localhost:8080'

router.get('/verbs/:artist/:title', async (ctx) => {
  try {
    var lyrics = await getLyrics(ctx.params.artist, ctx.params.title)
    var verbs = await getVerbs(lyrics)
    ctx.body = {
      verbs: verbs
    }
  } catch (err) {
    ctx.status = 500
    ctx.body = 'An error occurred please try again after some time'
  }
})

router.get('/adjectives/:artist/:title', async (ctx) => {
  try {
    var lyrics = await getLyrics(ctx.params.artist, ctx.params.title)
    var adjectives = await getAjectives(lyrics)
    ctx.body = {
      adjectives: adjectives
    }
  } catch (err) {
    ctx.status = 500
    ctx.body = 'An error occurred please try again after some time'
  }
})

router.get('/healthz', async (ctx) => {
  ctx.status = 200
  ctx.body = 'OK'
})

async function getLyrics (artist, title) {
  var url = `http://${BASE_PATH}/v1/${artist}/${title}`
  var response = await got(url)
  var body = JSON.parse(response.body)
  return body.lyrics
}

async function getVerbs (corpus) {
  return new Promise(resolve => {
    wordpos.getVerbs(corpus, verbs => {
      console.log(verbs)
      verbs = _.map(verbs, verb => verb.toLowerCase())
      verbs = _.uniq(verbs)
      resolve(verbs)
    })
  })
}

async function getAjectives (corpus) {
  return new Promise(resolve => {
    wordpos.getAdjectives(corpus, adjectives => {
      adjectives = _.map(adjectives, adjective => adjective.toLowerCase())
      adjectives = _.uniq(adjectives)
      resolve(adjectives)
    })
  })
}

module.exports = router
