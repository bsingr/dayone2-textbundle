module.exports = (rawEntry) => {
  if (!rawEntry.text) throw new Error("Missing #text property")
  const entry = {}
  if (rawEntry.text) {
    entry.text = rawEntry.text.replace(/!\[(.*?)\]\(dayone-moment:\/\/(.+?)\)/g, '![$1](attachment:$2)')
    try {
      entry.title = entry.text.match(/\s*(?<title>[^\n]+)\n*/).groups.title.replace(/^[#\s]*/, '').trim()
    } catch (e) {
      throw new Error(`Cannot parse title for content >>>>>>>>>${rawEntry.text}<<<<<<<<<`)
    }
  }
  if (rawEntry.uuid) entry.uuid = rawEntry.uuid
  if (rawEntry.tags) entry.tags = rawEntry.tags
  if (rawEntry.creationDate) entry.createdAt = rawEntry.creationDate
  if (rawEntry.modifiedDate) entry.modifiedAt = rawEntry.modifiedDate
  if (rawEntry.photos) {
    entry.attachments = rawEntry.photos.map(rawEntryPhoto => {
      return {
        "uuid": rawEntryPhoto.identifier,
        "filename": `${rawEntryPhoto.md5}.${rawEntryPhoto.type}`
      }
    })
  }
  return entry
}