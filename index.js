function MarkdownBlogWebpackPlugin(options) {}

MarkdownBlogWebpackPlugin.prototype.apply = compiler => {
  compiler.plugin('done', () => {});
};

module.exports = MarkdownBlogWebpackPlugin;
