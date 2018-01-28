const glob = require('glob');
const fs = require('fs');
const matter = require('gray-matter');
const VirtualModulePlugin = require('virtual-module-webpack-plugin');
const validateOptions = require('schema-utils');
const path = require('path');
const aggsCount = require('./aggregate');

const optionsSchema = {
  type: 'object',
  properties: {
    statsModule: {
      type: 'string'
    },
    postRoot: {
      type: 'string'
    },
    aggs: {
      type: 'array'
    }
  },
  additionalProperties: false
};

function generateStats({ postRoot, aggs }) {
  const stats = { list: [], aggs: {} };
  const postPattern = path.join(postRoot, '**/*.md');
  const posts = glob.sync(postPattern, { nodir: true });
  const postRootRegex = new RegExp(`^${postRoot}/`);
  posts.forEach(postPath => {
    const content = fs.readFileSync(postPath, 'utf-8');
    const { data } = matter(content);
    data.path = postPath.replace(postRootRegex, '');
    stats.list.push(data);
  });
  stats.aggs = aggsCount(stats.list, aggs);

  return `export default ${JSON.stringify(stats)}`;
}

class MarkdownBlogWebpackPlugin extends VirtualModulePlugin {
  constructor(options) {
    validateOptions(optionsSchema, options, 'MarkdownBlogPlugin');
    options.moduleName = options.statsModule;
    options.contents = generateStats(options);
    super(options);
  }
}

module.exports = MarkdownBlogWebpackPlugin;
