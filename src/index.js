const glob = require('glob');
const fs = require('fs');
const matter = require('gray-matter');
const VirtualModulePlugin = require('virtual-module-webpack-plugin');
const validateOptions = require('schema-utils');
const path = require('path');
const aggsCount = require('./aggregate');

const defaultOptions = {
  ignoreDraft: true
};

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
    },
    ignoreDraft: {
      type: 'boolean'
    }
  },
  additionalProperties: false
};

function generateStats({ postRoot, aggs, ignoreDraft }) {
  const stats = { list: [], aggs: {} };
  const postPattern = path.join(postRoot, '**/*.md');
  const posts = glob.sync(postPattern, { nodir: true });
  const postRootRegex = new RegExp(`^${postRoot}/`);
  posts.forEach(postPath => {
    const content = fs.readFileSync(postPath, 'utf-8');
    const { data } = matter(content);

    if (data.draft && ignoreDraft) {
      return;
    }

    data.path = postPath.replace(postRootRegex, '');
    stats.list.push(data);
  });
  stats.aggs = aggsCount(stats.list, aggs);

  return `export default ${JSON.stringify(stats)}`;
}

class MarkdownBlogWebpackPlugin extends VirtualModulePlugin {
  constructor(options) {
    const tempOptions = Object.assign(defaultOptions, options);
    validateOptions(optionsSchema, tempOptions, 'MarkdownBlogPlugin');

    const virtualModuleWebpackPluginOptions = {};
    virtualModuleWebpackPluginOptions.moduleName = tempOptions.statsModule;
    virtualModuleWebpackPluginOptions.contents = generateStats(tempOptions);
    super(virtualModuleWebpackPluginOptions);
  }
}

module.exports = MarkdownBlogWebpackPlugin;
