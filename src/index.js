const glob = require('glob');
const fs = require('fs');
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
    postRoot2: {
      type: 'string'
    },
    aggs: {
      type: 'array'
    }
  },
  additionalProperties: false
};

const defaultOptions = {
  aggs: []
};

function getPostPattern(postRoot) {
  return path.join(postRoot, '**/*.md');
}

function generateStats({ postRoot, postRoot2, aggs }) {
  const postPattern = getPostPattern(postRoot);
  const posts = glob.sync(postPattern, { nodir: true });
  const postRootRegex = new RegExp(`^${postRoot}/`);
  posts.forEach(postPath => {
    const content = fs.readFileSync(postPath, 'utf-8');
    const { data } = matter(content);
    data.path = postPath.replace(postRootRegex, '');
    stats.list.push(data);
  });
  stats.aggs = aggsCount(stats.list, aggs);

  // let dataRequires = 'const data = {}; data.list = [];';
  // posts.forEach(postPath => {
  //   const path2 = postPath.replace(postRootRegex, '');
  //   const relPath = path.join(postRoot2, path2);
  //   dataRequires += `data.list.push(require('${relPath}'));`;
  // });

  //   return `
  // const aggsCount = ${aggsCount.toString()};
  // ${dataRequires};
  // data.stats = aggsCount(data.list, ['tags']);
  // export default JSON.stringify(data);
  // `;
}

class MarkdownBlogWebpackPlugin extends VirtualModulePlugin {
  constructor(confOptions) {
    const options = Object.assign(defaultOptions, confOptions);
    validateOptions(optionsSchema, options, 'MarkdownBlogPlugin');
    options.moduleName = options.statsModule;
    options.contents = generateStats(options);
    super(options);
    this.options = options;
  }

  // apply(compiler) {
  //   super.apply(compiler);
  //   const posts = glob.sync(getPostPattern(this.options.postRoot), {
  //     nodir: true
  //   });
  //   compiler.plugin('emit', (compilation, callback) => {
  //     compilation.fileDependencies = compilation.fileDependencies.concat(posts);
  //     callback();
  //   });
  // }
}

module.exports = MarkdownBlogWebpackPlugin;
