const JSZip = require('JSZip');
const fs = require('fs');

module.exports = (entry) => {
  const zip = JSZip();
  zip.file('info.json', JSON.stringify({
    "version":              2,
    "type":                 "net.daringfireball.markdown",
    "transient":            true,
    "creatorIdentifier":    "org.dayoneexport.vendor",
    "sourceURL":            "dayone2://view?entryId=65A6F350C04E496DB775971441E41FBA"
  }, null, 2));
  let text = entry.text
  if (entry.attachments) {
    const assets = zip.folder('assets')
    entry.attachments.forEach(attachment => {
      // store the attachment
      assets.file(attachment.filename, fs.readFileSync(attachment.path), {"binary": true})

      // update the references to the attachment
      text = text.replace(new RegExp(`!\\[(.*?)\\]\\(attachment:${attachment.uuid}\\)`, 'g'), `![$1](assets/${attachment.filename})`)
    })
  }
  zip.file('text.md', text, {
    "date": new Date(entry.modifiedAt || entry.createdAt)
  });
  return zip
}