#!/usr/bin/env node

/* eslint-disable */

const convertDayOne2JSONExportIntoTextBundleZips = require('../lib/convertDayOne2JSONExportIntoTextBundleZips')

const inputPath = process.argv[2]
const outputPath = process.argv[3]

if (!inputPath || !outputPath) {
  console.log(`${process.argv0} <dayone2-export-json-file> <target-dir>`)
} else {
  convertDayOne2JSONExportIntoTextBundleZips(inputPath, outputPath)
    .then(logs => {
      logs.parser.entriesErrors.forEach(e => {
        console.log(`[PARSER] Skipping entry: ${e}`)
      })
      console.log(`[PARSER] Finished. Entries succeeded=${logs.parser.numberOfEntires} skipped=${logs.parser.numberOfEntriesWithErrors}`)
      if (logs.converter.error) {
        console.log(`[CONVERTER] Failed! ${logs.converter.error}`)
        console.log('=== FAILED ===')
        process.exit(1)
      } else {
        console.log(`[CONVERTER] Finished. Bundles written=${logs.converter.numberOfTextBundlesWritten}`)
        console.log('=== DONE ===')
        process.exit(0)
      }
    })
}
