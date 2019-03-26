const fs = require('fs')
const path = require('path')
const parseDayOne2JSONExportEntry = require('./parseDayOne2JSONExportEntry')

module.exports = (pathToDayOne2ExportJSON) => {
  const rawJSON = fs.readFileSync(pathToDayOne2ExportJSON, 'utf8')
  if (!rawJSON) throw new Error('Failed to read ' + pathToDayOne2ExportJSON)
  const data = JSON.parse(rawJSON)
  const attachmentsPath = path.join(path.dirname(pathToDayOne2ExportJSON), 'photos')
  return {
    "entries": data.entries.map(rawEntry => {
      const entry = parseDayOne2JSONExportEntry(rawEntry)
      if (entry.attachments) {
        entry.attachments.forEach(attachment => {
          attachment.path = path.join(attachmentsPath, attachment.filename)
        })
      }
      return entry
    })
  }
}