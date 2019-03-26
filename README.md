# DayOne2 TextBundle Conversion Utilities

This project was created to export and import multiple [DayOne2](https://dayoneapp.com/) journals to other note-taking applications that support the [TextBundle](http://textbundle.org/) format such as [Ulysses](https://ulysses.app) and [Bear](https://bear.app/).

As of 2019 a lot of note-taking applications support the [TextBundle](http://textbundle.org/) format for data exchange. TextBundle is just a thin wrapper around [Markdown](https://daringfireball.net/projects/markdown/syntax) with support for attachments (e.g. embedded images).

Sadly DayOne2 does not support TextBundle out of the box, this project solves this.

## Features

- Reads [DayOne2](https://dayoneapp.com/) journal in JSON format
- Converts into [TextBundle](http://textbundle.org/) `.textpack` ZIP files

## Installation

This project uses and was tested with [Node.js](https://nodejs.org/) v10.

    npm install dayone2-textbundle

## How To

### 1. Export a DayOne2 journal in JSON format

[See here](https://help.dayoneapp.com/tips-and-tutorials/exporting-entries)

### 2. Convert JSON to TextBundle

Run the CLI to transform the DayOne2 JSON into a bunch of TextBundle ZIP files (actually called `.textpack`) like so:

    dayone2-textbundle <dayone2-export-json-file> <target-dir>

### 3. Import

Open the TextBundle files (single or all-at-once) directly in any app listed [here](http://textbundle.org/)

## Contribute

Make it pass `npm test` and `npm lint`, then send your pull-request ;-)

## LICENSE

See [LICENSE](LICENSE).
