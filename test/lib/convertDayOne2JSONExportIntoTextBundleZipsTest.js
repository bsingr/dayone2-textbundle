const assert = require('assert')
const convertDayOne2JSONExportIntoTextBundleZips = require('../../lib/convertDayOne2JSONExportIntoTextBundleZips')
const rimraf = require('rimraf')
const fs = require('fs')
const JSZip = require('jszip');

describe('convertDayOne2JSONExportIntoTextBundleZips', () => {
  describe('normal', () => {
    it('creates files with proper names, timestamps and contents', async () => {
      // convert
      const targetDir = './test/tmp/convertDayOne2JSONExportIntoTextBundleZips'
      rimraf.sync(targetDir)
      fs.mkdirSync(targetDir)
      const logs = await convertDayOne2JSONExportIntoTextBundleZips(__dirname + '/../assets/DayOne2JSONExport/demo.json', targetDir)

      // check logs
      assert.deepEqual(logs, {
        "converter": {
          "numberOfTextBundlesWritten": 2,
          "filesErrors": []
        },
        "parser": {
          "entriesErrors": [
            'Missing #text property 6BD0AE9E21C447A6BC504A63899BA544 0'
          ],
          "numberOfEntries": 2,
          "numberOfEntriesWithErrors": 1
        }
      })

      // files are created with proper filenames
      assert.deepEqual(fs.readdirSync(targetDir), [
        'Initial entry.F4CF0509F3EA47D1B56F95D37F165F5E.textpack',
        "Second entry.6BD0AE9E21C447A6BC504A63899BA543.textpack"
      ])

      /*
       * file timestamps are correctly set
       * note: this can only be fully tested on macOS, where birthtime is fully supported
       */
      const statSubset = ({birthtime, mtime}) => {
        if (process.platform === 'darwin') {
          return {birthtime,
mtime}
        } 
          return {mtime}
        
      }
      
      assert.deepEqual(statSubset(fs.statSync(`${targetDir}/Initial entry.F4CF0509F3EA47D1B56F95D37F165F5E.textpack`)), {
        "birthtime": new Date('2019-03-18T13:04:56.000Z'),
        "mtime": new Date('2019-03-26T21:48:44.000Z')
      })
      assert.deepEqual(statSubset(fs.statSync(`${targetDir}/Second entry.6BD0AE9E21C447A6BC504A63899BA543.textpack`)), {
        "birthtime": new Date('2010-02-26T21:44:20.000Z'),
        "mtime": new Date('2010-03-26T21:48:55.000Z')
      })

      // file1 content is correct
      const zip1 = await JSZip.loadAsync(fs.readFileSync(`${targetDir}/Initial entry.F4CF0509F3EA47D1B56F95D37F165F5E.textpack`))
      assert.deepEqual(await zip1.file("info.json").async("string"), `{
  "version": 2,
  "type": "net.daringfireball.markdown",
  "transient": true,
  "creatorIdentifier": "org.dayoneexport.vendor",
  "sourceURL": "dayone2://view?entryId=F4CF0509F3EA47D1B56F95D37F165F5E"
}`)
      assert.deepEqual(await zip1.file("text.md").async("string"), `# Initial entry

some text

![](assets/cf80411fda6ba991b6110b2365fb8286.jpeg)`)
      assert.equal(await zip1.file('assets/cf80411fda6ba991b6110b2365fb8286.jpeg').name, 'assets/cf80411fda6ba991b6110b2365fb8286.jpeg')

      // file2 content is correct
      const zip2 = await JSZip.loadAsync(fs.readFileSync(`${targetDir}/Second entry.6BD0AE9E21C447A6BC504A63899BA543.textpack`))
      assert.deepEqual(await zip2.file("info.json").async("string"), `{
  "version": 2,
  "type": "net.daringfireball.markdown",
  "transient": true,
  "creatorIdentifier": "org.dayoneexport.vendor",
  "sourceURL": "dayone2://view?entryId=6BD0AE9E21C447A6BC504A63899BA543"
}`)
      assert.deepEqual(await zip2.file("text.md").async("string"), `# Second entry

some text`)
    })
  })
})