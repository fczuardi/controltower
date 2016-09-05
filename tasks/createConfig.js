import { cp, test, sed, echo } from 'shelljs';

const configFilename = 'config.js';
const configSampleFilename = 'config-sample.js';
const envVars = [
    'FACEBOOK_APP_ID'
];

if (!test('-f', configFilename) || process.argv[2] === 'replace') {
    cp(configSampleFilename, configFilename);
    envVars.forEach(varName => {
        sed('-i', varName, process.env[varName], configFilename);
    });
} else {
    echo('Config file already exists, aborted. (use "-- replace" to force a rewrite)');
}
