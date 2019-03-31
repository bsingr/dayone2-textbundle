const parseDayOne2JSONExport = require('./parseDayOne2JSONExport')
const buildTextBundleZip = require('./buildTextBundleZip')
const fs = require('fs')
const filenamify = require('filenamify');
const Utimes = require('@ronomon/utimes');

module.exports = (inputPath, outputPath) => {
  const dayOne2JSONExport = parseDayOne2JSONExport(inputPath)
  console.log(`dayOne2JSONExport.entries ${dayOne2JSONExport.entries.length}`)
  console.log(`dayOne2JSONExport.entriesWithErrors ${dayOne2JSONExport.entriesWithErrors.length}`)
  dayOne2JSONExport.entriesWithErrors.forEach(entryWithError => {
    console.log(`${entryWithError.error} ${entryWithError.rawEntry.uuid} ${(entryWithError.rawEntry.attachments || []).length}`)
  })
  return Promise.all(dayOne2JSONExport.entries.map(entry => {
    return new Promise((resolve, reject) => {
      try {
        const zip = buildTextBundleZip(entry)
        zip.generateAsync({"type": 'nodebuffer'}).
          then(data => {
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
                resolve(path)
              }
            })
          }).
          catch(error => {
            reject(error)
          })
      } catch (e) {
        console.log(e)
        reject(e)
      }
    })
  })).
  then(tasks => {
    console.log(`DONE ${tasks.length}`)
    return tasks
  }).
  catch(e => {
    console.log(`Failed ${e}`)
    return e
  })
}