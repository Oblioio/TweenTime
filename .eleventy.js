const htmlmin = require("html-minifier");

module.exports = function(eleventyConfig) {
    console.log('TESTING THE ENV', eleventyConfig);

    eleventyConfig.addFilter("webp", function(value) {
      return value.replace(/\.(jpe?g|png)/gi, '.webp');
    });

    eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
      // Eleventy 1.0+: use this.inputPath and this.outputPath instead
      if( outputPath.endsWith(".html") ) {
        let minified = htmlmin.minify(content, {
          useShortDoctype: true,
          removeComments: true,
          collapseWhitespace: true
        });
        return minified;
      }
  
      return content;
    });

    return {
      templateFormats: [
        "njk",
        "liquid"
      ],
  
      // If your site lives in a different subdirectory, change this.
      // Leading or trailing slashes are all normalized away, so don’t worry about those.
  
      // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
      // This is only used for link URLs (it does not affect your file structure)
      // Best paired with the `url` filter: https://www.11ty.dev/docs/filters/url/
  
      // You can also pass this in on the command line using `--pathprefix`
      pathPrefix: "/",
  
      markdownTemplateEngine: "liquid",
      htmlTemplateEngine: "njk",
      dataTemplateEngine: "njk",
  
      // These are all optional, defaults are shown:
      dir: {
        input: ".",
        includes: "_includes",
        data: "_data",
        output: "_site"
      }
    };
  };