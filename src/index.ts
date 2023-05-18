#!/usr/bin/env node
import licenseChecker from 'license-checker-rseidelsohn';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { writeThirdPartiesFile } from './write';
import { createMapOfLicenses } from './read';
import { trimEnd } from 'lodash';
import { Logger } from './log';
import path from 'path';

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
        // FIXME: remove cast
        direct: 0 as unknown as boolean,
        customPath: path.resolve(__dirname, '../config/fields.json'),
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
                    const fullPathOutFile = `${trimEnd(args.projectDir, '/')}/${args.outFile}`;
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
