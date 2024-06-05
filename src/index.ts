#!/usr/bin/env node
import licenseChecker from 'license-checker-rseidelsohn';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { writeThirdPartiesFile } from './write.js';
import { createMapOfLicenses } from './read.js';
import { Logger } from './log.js';
import url from 'url';

const args = yargs(hideBin(process.argv))
    .option({
        projectDir: {
            alias: 'p',
            type: 'string',
            default: '.',
            description: 'Project folder where the package.json is placed',
        },
    })
    .option({
        outFile: { alias: 'o', type: 'string', default: 'THIRDPARTIES', description: 'Name of the file generated' },
    })
    .option({
        debug: { type: 'boolean', default: false, description: 'Debug mode, print debug logs' },
    })
    .option({
        verbose: { type: 'boolean', default: false, description: 'Verbose mode, print logs' },
    })
    .parseSync();

Logger.init({ debug: args.debug, verbose: args.verbose });
Logger.log('Init licenseChecker');

licenseChecker.init(
    {
        start: args.projectDir,
        direct: 0,
        customPath: url.fileURLToPath(new URL('../config/fields.json', import.meta.url)),
    },
    (error, packages) => {
        if (error) {
            console.error(error);
            process.exit(1);
        } else {
            Logger.log('Start processing packages');
            createMapOfLicenses(packages)
                .then((licenseList) => {
                    Logger.log('Writing out data');
                    Logger.debug('Found', licenseList.length, 'different licenses');
                    const fullPathOutFile = `${args.projectDir}/${args.outFile}`.replaceAll('//', '/');
                    writeThirdPartiesFile(licenseList, fullPathOutFile);
                    Logger.log('Output file generated successfully');
                    process.exit(0);
                })
                .catch((error) => {
                    console.error(error);
                    process.exit(1);
                });
        }
    },
);
