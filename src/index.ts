#!/usr/bin/env node
import licenseChecker from 'license-checker-rseidelsohn';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { writeThirdPartiesFile } from './write';
import { createMapOfLicenses } from './read';
import { trimEnd } from 'lodash';
import { LogDebug } from './log';

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
        debug: { type: 'boolean', default: false, description: 'Print debug logs' },
    })
    .parseSync();

LogDebug.init(args.debug);
LogDebug.log('Init licenseChecker');
licenseChecker.init(
    {
        start: args.projectDir,
        direct: true,
        customPath: './config/fields.json',
    },
    (error, packages) => {
        if (error) {
            console.error(error);
            process.exit(1);
        } else {
            LogDebug.log('Start processing packages');
            createMapOfLicenses(packages)
                .then((licenseList) => {
                    LogDebug.log('Writing out data');
                    const fullPathOutFile = `${trimEnd(args.projectDir, '/')}/${args.outFile}`;
                    writeThirdPartiesFile(licenseList, fullPathOutFile);
                    LogDebug.log('Output file generated successfully');
                    process.exit(0);
                })
                .catch((error) => {
                    console.error(error);
                    process.exit(1);
                });
        }
    },
);
