const JSZip = require('jszip');
const fs = require('fs');

module.exports = (entry) => {
  const zip = JSZip();
  zip.file('info.json', JSON.stringify({
    "version":              2,
    "type":                 "net.daringfireball.markdown",
    "transient":            true,
    "creatorIdentifier":    "org.dayoneexport.vendor",
    "sourceURL":            `dayone2://view?entryId=${entry.uuid}`
  }, null, 2));
  let text = entry.text
  if (entry.attachments) {
    const assets = zip.folder('assets')
    entry.attachments.forEach(attachment => {
      try {
        const data = fs.readFileSync(attachment.path)

        // store the attachment
        assets.file(attachment.filename, data, {"binary": true})
      } catch (e) {
        console.log(`Missing attachment entry=${entry.uuid} attachment=${attachment.path}`)
      }
      // update the references to the attachment
      text = text.replace(new RegExp(`!\\[(.*?)\\]\\(attachment:${attachment.uuid}\\)`, 'g'), `![$1](assets/${attachment.filename})`)
    })
  }
  zip.file('text.md', text, {
    "date": new Date(entry.createdAt || entry.modifiedAt)
  });
  return zip
}