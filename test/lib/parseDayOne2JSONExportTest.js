const assert = require('assert')
const path = require('path')
const parseDayOne2JSONExport = require('../../lib/parseDayOne2JSONExport')

describe('parseDayOne2JSONExport', () => {
  describe('normal', () => {
    it('returns', () => {
      const data = parseDayOne2JSONExport(__dirname + '/../assets/DayOne2JSONExport/demo.json');
      assert.deepEqual(data, {
        "entries": [{
          "text": '# Initial entry\n\nsome text\n\n![](attachment:D3456FD591A34C098719F1A0E6C46829)',
          "title": "Initial entry",
          "createdAt": "2019-03-18T13:04:56Z",
          "modifiedAt": "2019-03-26T21:48:44Z",
          "uuid": "F4CF0509F3EA47D1B56F95D37F165F5E",
          "attachments": [{
            "uuid": 'D3456FD591A34C098719F1A0E6C46829',
            "filename": 'cf80411fda6ba991b6110b2365fb8286.jpeg',
            "path": path.normalize(__dirname + '/../assets/DayOne2JSONExport/photos/') + 'cf80411fda6ba991b6110b2365fb8286.jpeg',
          }]
        }, {
          "title": "Second entry",
          "createdAt": "2010-02-26T21:44:20Z",
          "modifiedAt": "2010-03-26T21:48:55Z",
          "text": "# Second entry\n\nsome text",
          "uuid": "6BD0AE9E21C447A6BC504A63899BA543"
        }, {
          "createdAt": "2010-02-27T21:14:20Z",
          "modifiedAt": "2010-03-27T21:58:55Z",
          "text": "# Third entry with double escapes\n\ndouble escape a/b dot. single escape slash/",
          "title": "Third entry with double escapes",
          "uuid": "6BD0AE9E21C447A6BC504A63899BC544"
        }],
        "entriesWithErrors": [{
          "error": "Missing #text property",
          "rawEntry": {
            "creationDate": "2011-03-26T21:44:20Z",
            "creationDevice": "bsingr-2018",
            "creationDeviceModel": "MacBookPro15,1",
            "creationDeviceType": "MacBook Pro",
            "creationOSName": "macOS",
            "creationOSVersion": "10.14.3",
            "duration": 0,
            "modifiedDate": "2011-03-26T21:48:55Z",
            "starred": false,
            "timeZone": "Europe/Berlin",
            "uuid": "6BD0AE9E21C447A6BC504A63899BA544"
          }
        }]
      })
    })
  })
})