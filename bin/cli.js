#!/usr/bin/env node

/* eslint-disable */

const convertDayOne2JSONExportIntoTextBundleZips = require('../lib/convertDayOne2JSONExportIntoTextBundleZips')

const inputPath = process.argv[2]
const outputPath = process.argv[3]

if (!inputPath || !outputPath) {
  console.log(`${process.argv0} <dayone2-export-json-file> <target-dir>`)
} else {
  convertDayOne2JSONExportIntoTextBundleZips(inputPath, outputPath)
}
