const babel = require('@babel/core');
const merge = require('babel-merge');

class BabelConfig {
    /**
     * Generate the appropriate Babel configuration for the build.
     *
     * @param {Object} mixBabelConfig
     */
    static generate(mixBabelConfig) {
        return BabelConfig.mergeAll([
            BabelConfig.default(),
            BabelConfig.getUserConfig(mixBabelConfig)
        ]);
    }

    /**
     * Fetch the user's .babelrc config file, if any.
     *
     * @param {Object} customOptions
     */
    static getUserConfig(customOptions) {
        const { options } = babel.loadPartialConfig({
            filename: '.babelrc',
            ...customOptions
        });

        return options;
    }

    static mergeAll(configs) {
        return configs.reduce((prev, current) => {
            const presets = BabelConfig.filterConfigItems(
                [...(prev.presets || []), ...(current.presets || [])].map(preset =>
                    babel.createConfigItem(preset, { type: 'preset' })
                )
            );

            const plugins = BabelConfig.filterConfigItems(
                [...(prev.plugins || []), ...(current.plugins || [])].map(plugin =>
                    babel.createConfigItem(plugin, { type: 'plugin' })
                )
            );

            return Object.assign(prev, current, { presets, plugins });
        });
    }

    static filterConfigItems(configItems) {
        return configItems
            .reduce((unique, configItem) => {
                if (configItem.file != null) {
                    delete unique[
                        unique.findIndex(
                            element =>
                                element.file &&
                                element.file.resolved === configItem.file.resolved
                        )
                    ];
                }

                return [...unique, configItem];
            }, [])
            .filter(Boolean);
    }

    /**
     * Fetch the default Babel configuration.
     */
    static default() {
        return {
            cacheDirectory: true,
            presets: ['@babel/preset-env'],
            plugins: [
                '@babel/plugin-syntax-dynamic-import',
                '@babel/plugin-proposal-object-rest-spread',
                [
                    '@babel/plugin-transform-runtime',
                    {
                        helpers: false
                    }
                ]
            ]
        };
    }
}

module.exports = BabelConfig;
