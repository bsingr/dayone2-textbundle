#!/usr/bin/env node

/* eslint-disable */

const parseDayOne2JSONExport = require('../lib/parseDayOne2JSONExport')
const buildTextBundleZip = require('../lib/buildTextBundleZip')
const fs = require('fs')
const filenamify = require('filenamify');
const Utimes = require('@ronomon/utimes');

const inputPath = process.argv[2]
const outputPath = process.argv[3]

if (!inputPath || !outputPath) {
  console.log(`${process.argv0} <dayone2-export-json-file> <target-dir>`)
} else {
  const dayOne2JSONExport = parseDayOne2JSONExport(inputPath)
  dayOne2JSONExport.entries.forEach(async entry => {
    const zip = buildTextBundleZip(entry)
    const data = await zip.generateAsync({"type": 'nodebuffer'})
    const path = outputPath + '/' + filenamify(entry.title) + '.textpack'
    fs.writeFileSync(path, data)
    try {
      await new Promise((resolve) => {
        const createdAt = new Date(entry.createdAt).getTime() || undefined
        const modifiedAt = new Date(entry.modifiedAt).getTime() || undefined
        const accessedAt = undefined
        Utimes.utimes(path, createdAt, createdAt, accessedAt, () => {
          resolve()
        })
      })
    } catch (e) {
      console.log(e)
    }
  })
}
