import mix from './helpers/setup';
import assert from '../helpers/assertions';
import { fakeApp } from '../helpers/paths';
import webpack from '../helpers/webpack';

test('mix.react()', t => {
    mix.react().js('resources/assets/js/app.js', 'public/js');

    t.deepEqual(
        [
            {
                entry: [new File('resources/assets/js/app.js')],
                output: new File('public/js')
            }
        ],
        Mix.components.get('js').toCompile
    );
});

test('it compiles React and a preprocessor properly', async t => {
    mix.react()
        .js(`${fakeApp}/resources/assets/js/app.js`, 'js')
        .sass(`${fakeApp}/resources/assets/sass/app.scss`, 'css');

    await webpack.compile();

    assert.manifestEquals(
        {
            '/css/app.css': '/css/app.css',
            '/js/app.js': '/js/app.js'
        },
        t
    );

    t.true(File.exists(`${fakeApp}/public/js/app.js`));
});

test('it sets the webpack entry correctly', t => {
    mix.react().js('resources/assets/js/app.js', 'js');

    t.deepEqual(
        {
            '/js/app': [path.resolve('resources/assets/js/app.js')]
        },
        webpack.buildConfig().entry
    );
});

test('it sets the babel config correctly', t => {
    mix.react().js('resources/assets/js/app.js', 'js');

    webpack.buildConfig();

    t.true(
        Config.babel().presets.find(p =>
            p.includes(path.normalize('@babel/preset-react'))
        ) !== undefined
    );
});
