import licenseChecker, { ModuleInfos } from 'license-checker-rseidelsohn';
import { writeThirdPartiesFile } from './write';
import { createMapOfLicenses } from './read';

const PROJECT_DIR = '';
const OUTPUT_FILE = '';

function parsePackages(error: Error, packages: ModuleInfos) {
    if (error) {
        console.error(error);
    } else {
        createMapOfLicenses(packages)
            .then((licenseList) => {
                writeThirdPartiesFile(licenseList, OUTPUT_FILE);
                process.exit(0);
            })
            .catch((error) => {
                console.error(error);
                process.exit(1);
            });
    }
}

licenseChecker.init(
    {
        start: PROJECT_DIR,
        direct: true,
        customPath: './config/fields.json',
    },
    parsePackages,
);
