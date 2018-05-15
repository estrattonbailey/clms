#! /usr/bin/env node
'use strict'

const chalk = require('chalk')
const loading = require('loading-indicator')
const fetch = require('cross-fetch')
const cheerio = require('cheerio')

const { _: args } = require('minimist')(process.argv.slice(2))

let loader = loading.start()

let time = Date.now()

function alignRight (str) {
  return str.padStart(20)
}

fetch(args[0], {
  mode: 'cors'
})
  .then(res => res.text())
  .then(res => {
    const $ = cheerio.load(res)
    const head = $('head')[0]

    loading.stop(loader)

    console.log()

    if (!head.children.length) {
      console.log(
        chalk.red(alignRight('failed')),
        (Date.now() - time) / 1000,
        's'
      )
      console.log()
      return
    }

    for (let el of head.children) {
      if (el.name === 'title') {
        console.log(
          chalk.green(alignRight('title')),
          el.children[0].data
        )
      }

      if (el.name !== 'meta') continue

      if (el.attribs) {
        for (let k in el.attribs) {
          if (/name|property/.test(k)) {
            console.log(
              chalk.green(alignRight(el.attribs[k])),
              el.attribs.content
            )
          }
        }
      }
    }

    console.log()

    console.log(
      chalk.magenta(alignRight('complete')),
      (Date.now() - time) / 1000,
      's'
    )

    console.log()
  })
  .catch(e => {
    console.log(e)
    loading.stop(loader)
  })



