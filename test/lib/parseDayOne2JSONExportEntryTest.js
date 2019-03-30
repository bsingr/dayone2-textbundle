const assert = require('assert')
const parseDayOne2JSONExportEntry = require('../../lib/parseDayOne2JSONExportEntry')

describe('parseDayOne2JSONExportEntry', () => {
  describe('normal', () => {
    it('returns', () => {
      assert.deepEqual(parseDayOne2JSONExportEntry(examplEntries.normal), {
        "uuid": "65A6F350C04E496DB775971441E41FBA",
        "createdAt": "2018-12-06T21:04:39Z",
        "modifiedAt":  "2018-12-06T21:05:56Z",
        "text": "# Foo\nBar\n",
        "title": 'Foo',
        "tags": ["foo", "bar"]
      })
    })
  })

  describe('special title', () => {
    it('returns', () => {
      assert.deepEqual(parseDayOne2JSONExportEntry({
        "text": " \n \n \t # Foo \nBar"
      }).title, 'Foo')

      assert.deepEqual(parseDayOne2JSONExportEntry({
        "text": " \n \n \t ## Foo \nBar"
      }).title, 'Foo')

      assert.deepEqual(parseDayOne2JSONExportEntry({
        "text": "Foo \nBar"
      }).title, 'Foo')

      assert.deepEqual(parseDayOne2JSONExportEntry({
        "text": "Foo \n"
      }).title, 'Foo')

      assert.deepEqual(parseDayOne2JSONExportEntry({
        "text": "Foo"
      }).title, 'Foo')

      assert.deepEqual(parseDayOne2JSONExportEntry({
        "text": "![](dayone-moment:\/\/2D886F84A1BF4A34B2F0396AF109F86F)\n\n# Foo \n Bar"
      }).title, 'Foo')

      assert.deepEqual(parseDayOne2JSONExportEntry({
        "text": "![](dayone-moment:\/\/2D886F84A1BF4A34B2F0396AF109F86F)\n\n Foo \nBar"
      }).title, 'Foo')

      assert.deepEqual(parseDayOne2JSONExportEntry({
        "text": "![ Foo Lala  ](dayone-moment:\/\/2D886F84A1BF4A34B2F0396AF109F86F)\n\n Foo \nBar"
      }).title, 'Foo Lala')

      assert.deepEqual(parseDayOne2JSONExportEntry({
        "text": "[](dayone-moment:\/\/2D886F84A1BF4A34B2F0396AF109F86F)\n\n# Foo \n Bar"
      }).title, 'Foo')

      assert.deepEqual(parseDayOne2JSONExportEntry({
        "text": "[](dayone-moment:\/\/2D886F84A1BF4A34B2F0396AF109F86F)\n\n Foo \nBar"
      }).title, 'Foo')

      assert.deepEqual(parseDayOne2JSONExportEntry({
        "text": "[ Foo Lala ](dayone-moment:\/\/2D886F84A1BF4A34B2F0396AF109F86F)\n\n Foo \nBar"
      }).title, 'Foo Lala')

      assert.deepEqual(parseDayOne2JSONExportEntry({
        "text": "[](dayone-moment:\/\/2D886F84A1BF4A34B2F0396AF109F86F)\n"
      }).title, 'Untitled Link')

      assert.deepEqual(parseDayOne2JSONExportEntry({
        "text": "[ ](dayone-moment:\/\/2D886F84A1BF4A34B2F0396AF109F86F)\n"
      }).title, 'Untitled Link')

      assert.deepEqual(parseDayOne2JSONExportEntry({
        "text": "![](dayone-moment:\/\/2D886F84A1BF4A34B2F0396AF109F86F)\n"
      }).title, 'Untitled Photo')

      assert.deepEqual(parseDayOne2JSONExportEntry({
        "text": "![ ](dayone-moment:\/\/2D886F84A1BF4A34B2F0396AF109F86F)\n"
      }).title, 'Untitled Photo')

      assert.deepEqual(parseDayOne2JSONExportEntry({
        "text": "![](dayone-moment:\/\/2D886F84A1BF4A34B2F0396AF109F86F)\n",
        "location" : {
          "localityName" : "Erlenbach"
        }
      }).title, 'Photo Erlenbach')

      assert.deepEqual(parseDayOne2JSONExportEntry({
        "text": "![ ](dayone-moment:\/\/2D886F84A1BF4A34B2F0396AF109F86F)\n",
        "location" : {
          "placeName" : "Seestrasse"
        }
      }).title, 'Photo Seestrasse')
    })
  })

  describe('title as text', () => {
    it('returns', () => {
      assert.deepEqual(parseDayOne2JSONExportEntry({
        "text": "[](dayone-moment:\/\/2D886F84A1BF4A34B2F0396AF109F86F)\n"
      }).text, 'Untitled Link')

      assert.deepEqual(parseDayOne2JSONExportEntry({
        "text": "[ ](dayone-moment:\/\/2D886F84A1BF4A34B2F0396AF109F86F)\n"
      }).text, 'Untitled Link')

      assert.deepEqual(parseDayOne2JSONExportEntry({
        "text": "![](dayone-moment:\/\/2D886F84A1BF4A34B2F0396AF109F86F)\n"
      }).text, 'Untitled Photo')

      assert.deepEqual(parseDayOne2JSONExportEntry({
        "text": "![ ](dayone-moment:\/\/2D886F84A1BF4A34B2F0396AF109F86F)\n"
      }).text, 'Untitled Photo')

      assert.deepEqual(parseDayOne2JSONExportEntry({
        "text": "![](dayone-moment:\/\/2D886F84A1BF4A34B2F0396AF109F86F)\n",
        "location" : {
          "localityName" : "Erlenbach"
        }
      }).text, 'Photo Erlenbach')

      assert.deepEqual(parseDayOne2JSONExportEntry({
        "text": "![ ](dayone-moment:\/\/2D886F84A1BF4A34B2F0396AF109F86F)\n",
        "location" : {
          "placeName" : "Seestrasse"
        }
      }).text, 'Photo Seestrasse')
    })
  })

  describe('attachmentImages', () => {
    it('returns', () => {
      assert.deepEqual(parseDayOne2JSONExportEntry(examplEntries.attachmentImages), {
        "uuid": "6D9C3106A32C4E829BB880E719150907",
        "text": '# Image example\n![](attachment:D102C64516364C2195B19636EAC9FE9F)\n## Second Image\n![bar](attachment:D102C64516364C2195B19636EAC9FE99)',
        "title": 'Image example',
        "attachments": [
          {
            "uuid": 'D102C64516364C2195B19636EAC9FE9F',
            "filename": 'dc6cb29b2f32ce896ebf417608885889.png'
          },
          {
            "uuid": 'D102C64516364C2195B19636EAC9FE99',
            "filename": 'dc6cb29b2f32ce896ebf417608885899.jpeg'
          }
        ]
      })
    })
  })

  describe('externalImages', () => {
    it('returns', () => {
      assert.deepEqual(parseDayOne2JSONExportEntry(examplEntries.externalImages), {
        "uuid": "65A6F350C04E496DB775971441E41FBA",
        "title": 'Foo',
        "text": "# Foo\n![](http://example.org/foo.png)\n![bar](http://example.org/bar.png)\n"
      })
    })
  })

  describe('missing mandatory properties', () => {
    it('throws', () => {
      assert.throws(() => parseDayOne2JSONExportEntry({}))
    })
  })
})

const examplEntries = {
  "normal": {
    "creationOSName" : "iOS",
    "richText" : "{\"contents\":[{\"text\":\"Foo\\n\",\"attributes\":{\"line\":{\"header\":1}}},{\"text\":\"\\n\"},{\"text\":\"Bar\\n\\n\"}],\"meta\":{\"version\":1}}",
    "creationDeviceModel" : "iPhone11,8",
    "starred" : false,
    "weather" : {
      "moonPhaseCode" : "new",
      "sunsetDate" : "2018-12-06T15:30:41Z",
      "weatherServiceName" : "HAMweather",
      "weatherCode" : "mostly-cloudy-night",
      "temperatureCelsius" : 9,
      "windBearing" : 0,
      "sunriseDate" : "2018-12-06T06:55:33Z",
      "conditionsDescription" : "Mostly Cloudy",
      "pressureMB" : 1024,
      "moonPhase" : 0.9819,
      "visibilityKM" : 48.280319213867188,
      "relativeHumidity" : 94,
      "windSpeedKPH" : 0,
      "windChillCelsius" : 9
    },
    "creationDate" : "2018-12-06T21:04:39Z",
    "creationOSVersion" : "12.1",
    "creationDevice" : "bsingr",
    "creationDeviceType" : "iPhone",
    "timeZone" : "Europe/Zurich",
    "location" : {
      "region" : {
        "center" : {
          "longitude" : 8.5916093,
          "latitude" : 47.300171
        },
        "radius" : 75
      },
      "localityName" : "Erlenbach",
      "country" : "Deutschland",
      "longitude" : 8.5916093,
      "administrativeArea" : "Baden-Württemberg",
      "placeName" : "Seestrasse",
      "latitude" : 47.300171
    },
    "tags": ["foo", "bar"],
    "text" : "# Foo\nBar\n",
    "modifiedDate" : "2018-12-06T21:05:56Z",
    "uuid" : "65A6F350C04E496DB775971441E41FBA",
    "duration" : 0
  },
  "attachmentImages": {
    "photos" : [
      {
        "fnumber" : "(null)",
        "orderInEntry" : 1,
        "width" : 1870,
        "type" : "png",
        "identifier" : "D102C64516364C2195B19636EAC9FE9F",
        "isSketch" : false,
        "height" : 1416,
        "md5" : "dc6cb29b2f32ce896ebf417608885889",
        "focalLength" : "(null)"
      },
      {
        "fnumber" : "(null)",
        "orderInEntry" : 1,
        "width" : 1870,
        "type" : "jpeg",
        "identifier" : "D102C64516364C2195B19636EAC9FE99",
        "isSketch" : false,
        "height" : 1416,
        "md5" : "dc6cb29b2f32ce896ebf417608885899",
        "focalLength" : "(null)"
      }
    ],
    "text" : "# Image example\n![](dayone-moment://D102C64516364C2195B19636EAC9FE9F)\n## Second Image\n![bar](dayone-moment://D102C64516364C2195B19636EAC9FE99)",
    "uuid" : "6D9C3106A32C4E829BB880E719150907"
  },
  "externalImages": {
    "text" : "# Foo\n![](http://example.org/foo.png)\n![bar](http://example.org/bar.png)\n",
    "uuid" : "65A6F350C04E496DB775971441E41FBA"
  }
}  