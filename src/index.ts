#!/usr/bin/env node
import licenseChecker, { ModuleInfos } from 'license-checker-rseidelsohn';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { writeThirdPartiesFile } from './write';
import { createMapOfLicenses } from './read';
import { trimEnd } from 'lodash';

const { projectDir, outFile } = yargs(hideBin(process.argv))
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
    .parseSync();

licenseChecker.init(
    {
        start: projectDir,
        direct: true,
        customPath: './config/fields.json',
    },
    (error, packages) => {
        if (error) {
            console.error(error);
        } else {
            createMapOfLicenses(packages)
                .then((licenseList) => {
                    const fullPathOutFile = `${trimEnd(projectDir, '/')}/${outFile}`;
                    writeThirdPartiesFile(licenseList, fullPathOutFile);
                    process.exit(0);
                })
                .catch((error) => {
                    console.error(error);
                    process.exit(1);
                });
        }
    },
);
