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
  console.log(`dayOne2JSONExport.entries ${dayOne2JSONExport.entries.length}`)
  console.log(`dayOne2JSONExport.entriesWithErrors ${dayOne2JSONExport.entriesWithErrors.length}`)
  dayOne2JSONExport.entriesWithErrors.forEach(async entryWithError => {
    console.log(`${entryWithError.error} ${entryWithError.rawEntry.uuid} ${(entryWithError.rawEntry.attachments || []).length}`)
  })
  Promise.all(dayOne2JSONExport.entries.map(entry => {
    return new Promise(async (resolve, reject) => {
      try {
        const zip = buildTextBundleZip(entry)
        const data = await zip.generateAsync({"type": 'nodebuffer'})
        const path = `${outputPath}/${filenamify(entry.title)}.${entry.uuid}.textpack`
        fs.writeFileSync(path, data)
        
        const createdAt = new Date(entry.createdAt).getTime() || undefined
        const modifiedAt = new Date(entry.modifiedAt).getTime() || undefined
        const accessedAt = undefined
        Utimes.utimes(path, createdAt, modifiedAt, accessedAt, (error) => {
          if (error) {
            console.log(error)
            reject(error)
          } else {
            resolve()
          }
        })
      } catch (e) {
        console.log(e)
      }
    })
  }))
  .then(tasks => console.log(`DONE ${tasks.length}`))
  .catch(e => console.log(`Failed ${e}`))
}
