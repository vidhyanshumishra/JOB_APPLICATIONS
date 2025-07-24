const parser = require('fast-xml-parser');

module.exports = (xml) => {
  return parser.parse(xml, {
    ignoreAttributes: false,
    attributeNamePrefix: ''
  });
};
