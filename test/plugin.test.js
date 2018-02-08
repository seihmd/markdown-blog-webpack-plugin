import test from 'ava';
import webpack from 'webpack';
import MemoryFileSystem from 'memory-fs';

const MarkdownBlogWebpackPlugin = require('../index');
const path = require('path');

const OUTPUT = path.join(__dirname, 'dist');

function getConfig(option) {
  return {
    entry: path.resolve(__dirname, 'fixtures/entry.js'),
    output: {
      path: OUTPUT,
      filename: 'bundle.js'
    },
    resolve: {
      modules: [__dirname]
    },
    plugins: [new MarkdownBlogWebpackPlugin(option)]
  };
}

test.cb('output stats', t => {
  const pluginOption = {
    statsModule: path.resolve(__dirname, 'blogstats.js'),
    postRoot: path.resolve(__dirname, 'posts'),
    aggs: ['tags', 'category']
  };
  const webpackConf = getConfig(pluginOption);
  const compiler = webpack(webpackConf, (err, stats) => {
    if (err) {
      t.end(err);
    } else if (stats.hasErrors()) {
      t.end(stats.toString());
    }
    const html = stats.compilation.assets['bundle.js'].source();
    t.truthy(
      html.includes(
        '{"list":[{"title":"this is a test with js-front-matter","tags":["common-tag","js-tag"],"category":["common-cate","js-cate"],"date":"2018-01-03","path":"js_post.md"},{"title":"this is a test with json-front-matter","tags":["common-tag","json-tag"],"category":["common-cate","json-cate"],"date":"2018-01-03","path":"json_post.md"},{"title":"this is a test under subdir","tags":["common-tag","subdir-tag"],"category":["common-cate"],"date":"2018-01-04","path":"subdir/test.md"},{"title":"this is a test with yaml-front-matter","tags":["common-tag","yaml-tag"],"category":["common-cate","yaml-cate"],"date":"2018-01-01","path":"yaml_post.md"}],"aggs":{"tags":[{"attr":"common-tag","count":4},{"attr":"js-tag","count":1},{"attr":"json-tag","count":1},{"attr":"subdir-tag","count":1},{"attr":"yaml-tag","count":1}],"category":[{"attr":"common-cate","count":4},{"attr":"js-cate","count":1},{"attr":"json-cate","count":1},{"attr":"yaml-cate","count":1}]}}'
      )
    );
    t.end();
  });
  compiler.outputFileSystem = new MemoryFileSystem();
});
