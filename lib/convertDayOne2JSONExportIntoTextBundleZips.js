const parseDayOne2JSONExport = require('./parseDayOne2JSONExport')
const buildTextBundleZip = require('./buildTextBundleZip')
const fs = require('fs')
const filenamify = require('filenamify');
const Utimes = require('@ronomon/utimes');

// note: createdAt can't be set on linux, only on macOS/win
const setUtimes = (path, createdAt, modifiedAt, accessedAt) => {
  return new Promise((resolve, reject) => {
    Utimes.utimes(path, createdAt, modifiedAt, accessedAt, (error) => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
}

module.exports = async (inputPath, outputPath) => {
  const logs = {"parser": {},
"converter": {numberOfTextBundlesWritten: 0, filesErrors: []}}
  const dayOne2JSONExport = parseDayOne2JSONExport(inputPath)
  logs.parser.numberOfEntries = dayOne2JSONExport.entries.length
  logs.parser.numberOfEntriesWithErrors = dayOne2JSONExport.entriesWithErrors.length
  logs.parser.entriesErrors = dayOne2JSONExport.entriesWithErrors.map(entryWithError => {
    return `${entryWithError.error} ${entryWithError.rawEntry.uuid} ${(entryWithError.rawEntry.attachments || []).length}`
  })
  for (const entry of dayOne2JSONExport.entries) {
    const outputFilePath = `${outputPath}/${filenamify(entry.title)}.${entry.uuid}.textpack`
    try {
      const zip = buildTextBundleZip(entry)
      const data = await zip.generateAsync({"type": 'nodebuffer'})
      fs.writeFileSync(outputFilePath, data)
      logs.converter.numberOfTextBundlesWritten++
      try {
        const createdAt = new Date(entry.createdAt).getTime() || undefined
        const modifiedAt = new Date(entry.modifiedAt).getTime() || undefined
        const accessedAt = undefined
        await setUtimes(outputFilePath, createdAt, modifiedAt, accessedAt)
      } catch (error) {
        logs.converter.filesErrors.push(new Error(`Failed to set utimes on ${outputFilePath} ${error}`))
      }  
    } catch (error) {
      logs.converter.filesErrors.push(new Error(`Failed to write TextBundle ${outputFilePath} ${error}`))
    }
  }
  return logs
}