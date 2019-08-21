const fs = require('fs');
const browserify = require('browserify');
const pug = require('pug');
const ncp = require('ncp').ncp;

const TEMPLATE_VERSION = process.env.version || process.VERSION || process.env.v || 1;
const TEMPLATE_BASE_PATH = `./templates/${TEMPLATE_VERSION}`
const TEMPLATE_CONFIG = require(`${TEMPLATE_BASE_PATH}/config/config.json`);
const TEMPLATE_INDEX = `${TEMPLATE_BASE_PATH}/index.pug`;

const DIST_PATH = `./dist`

if (!fs.existsSync(DIST_PATH)) {
    fs.mkdirSync(DIST_PATH);
}

// compile pug templates into dist/index.html
const renderIndexHtml = () => {
    const pugRender = pug.renderFile(TEMPLATE_INDEX, TEMPLATE_CONFIG)
    const dest = `${DIST_PATH}/index.html`
    fs.writeFile(`${dest}`, pugRender, err => {
        if (err) {
            return console.log(err)
        }
        console.log(`${dest} written`);
    })
}

// compile and bundle template's es6 javascript into dist/js/index.js
const bundleJavascript = () => {
    const dest = `${DIST_PATH}/js/index.js`
    var b = browserify();
    b.add(`./${TEMPLATE_BASE_PATH}/js/index.js`);
    b.bundle((err, buff) => {
        if (err) {
            return console.error(err);
        }
        const jsDir = `${DIST_PATH}/js`;
        if (!fs.existsSync(jsDir)) {
            fs.mkdirSync(jsDir);
        }
        fs.writeFile(`${dest}`, String(buff), err => {
            if (err) {
              return console.log(err)
            }
            console.log(`${dest} written`)
        });
    });
}

// copy all template's css into dist/css/
const copyCss = () => {
    const dest = `${DIST_PATH}/css`;
    ncp(`./${TEMPLATE_BASE_PATH}/css`, dest, err => {
        if (err) {
            return console.error(err);
        }
        console.log(`${dest}/* written`);
    });
}

const buildSteps = [
    renderIndexHtml,
    bundleJavascript,
    copyCss
]

buildSteps.forEach(fn => {
    fn.call();
});
