const glob = require('glob');
const fs = require('fs');
const matter = require('gray-matter');
const VirtualModulePlugin = require('virtual-module-webpack-plugin');
const aggsCount = require('./aggregate');

function generateStats({ postsPattern, aggs }) {
  const stats = { list: [], aggs: {} };
  const aggsMap = {};
  aggs.forEach(agg => {
    aggsMap[agg] = [];
  });

  const posts = glob.sync(postsPattern, { nodir: true });
  posts.forEach(postPath => {
    const content = fs.readFileSync(postPath, 'utf-8');
    const { data } = matter(content);
    stats.list.push(data);
  });
  stats.aggs = aggsCount(stats.list, aggs);

  return `export default ${JSON.stringify(stats)}`;
}

class MarkdownBlogWebpackPlugin extends VirtualModulePlugin {
  constructor(options) {
    options.moduleName = options.statsModule;
    options.contents = generateStats(options);
    super(options);
  }
}

module.exports = MarkdownBlogWebpackPlugin;
