

module.exports = {
  entryFiles: ['app.ts', 'app.wxss', 'app.json'],
  cache: false,
  alias: {
    "jgb-store": "../src"
  },
  presets: ['weapp'],
  plugins: [['less', {
    extensions: ['.wxss'],
    outExt: '.wxss'
  }], 'typescript']
}
