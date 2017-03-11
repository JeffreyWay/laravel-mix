let Preprocessor = require('./Preprocessor');

class Sass extends Preprocessor {
    /**
     * Fetch the Webpack loaders for Sass.
     */
    loaders(sourceMaps) {
        let loaders = [
            { loader: 'sass-loader' + (sourceMaps ? '?sourceMap' : ''), options: this.sassPluginOptions() }
        ];

        if (this.mixOptions.processCssUrls) {
            loaders.unshift(
                { loader: 'resolve-url-loader' }
            );
        }

        return loaders;
    }


    /**
     * Fetch the Node-Sass-specififc plugin options.
     */
    sassPluginOptions() {
        return Object.assign({
            precision: 8,
            outputStyle: 'expanded'
        }, this.pluginOptions, { sourceMap: true })
    }
}

module.exports = Sass;
