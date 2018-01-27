const MarkdowndBlogWebpackPlugin = require('./index');

module.exports = {
  entry: './entry.js',
  output: {
    filename: 'bundle.js'
  },
  plugins: [
    new MarkdowndBlogWebpackPlugin({
      statsModule: 'build/blogstats.js',
      postsPattern: 'example/posts/**/*.md',
      aggs: ['tags']
    })
  ]
};
