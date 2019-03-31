const parseDayOne2JSONExport = require('./parseDayOne2JSONExport')
const buildTextBundleZip = require('./buildTextBundleZip')
const fs = require('fs')
const filenamify = require('filenamify');
const Utimes = require('@ronomon/utimes');

module.exports = (inputPath, outputPath) => {
  const logs = {"parser": {},
"converter": {}}
  const dayOne2JSONExport = parseDayOne2JSONExport(inputPath)
  logs.parser.numberOfEntires = dayOne2JSONExport.entries.length
  logs.parser.numberOfEntriesWithErrors = dayOne2JSONExport.entriesWithErrors.length
  logs.parser.entriesErrors = dayOne2JSONExport.entriesWithErrors.map(entryWithError => {
    return `${entryWithError.error} ${entryWithError.rawEntry.uuid} ${(entryWithError.rawEntry.attachments || []).length}`
  })
  return Promise.all(dayOne2JSONExport.entries.map(entry => {
    return new Promise((resolve, reject) => {
      try {
        const path = `${outputPath}/${filenamify(entry.title)}.${entry.uuid}.textpack`
        const zip = buildTextBundleZip(entry)
        zip.generateAsync({"type": 'nodebuffer'}).
          then(data => {
            fs.writeFileSync(path, data)
            const createdAt = new Date(entry.createdAt).getTime() || undefined
            const modifiedAt = new Date(entry.modifiedAt).getTime() || undefined
            const accessedAt = undefined
            Utimes.utimes(path, createdAt, modifiedAt, accessedAt, (error) => {
              if (error) {
                reject(new Error(`Failed to set utimes on ${path} ${error}`))
              } else {
                resolve(path)
              }
            })
          }).
          catch(error => {
            reject(new Error(`Failed to generate zip ${path} ${error}`))
          })
      } catch (error) {
        reject(new Error(`Failed to generate text bundle ${entry.uuid} ${error}`))
      }
    })
  })).
  then(tasks => {
    logs.converter.numberOfTextBundlesWritten = tasks.length
    return logs
  }).
  catch(e => {
    logs.converter.numberOfTextBundlesWritten = 0
    logs.converter.error = `Failed to run batch conversion ${e}`
    return logs
  })
}