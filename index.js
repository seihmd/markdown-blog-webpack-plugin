const glob = require('glob');
const fs = require('fs');
const matter = require('gray-matter');
const VirtualModulePlugin = require('virtual-module-webpack-plugin');

function generateStats({ postsPattern, aggs }) {
  const stats = { list: [] };
  const aggsMap = {};
  aggs.forEach(agg => {
    aggsMap[agg] = {};
  });

  const posts = glob.sync(postsPattern, { nodir: true });

  posts.forEach(postPath => {
    const content = fs.readFileSync(postPath, 'utf-8');
    const { data } = matter(content);
    stats.list.push(data);
  });
  stats.aggs = aggsMap;
  // a.forEach((val) => { if (m[val]) {m[val] += 1} else {m[val] = 1}} )

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
