import fs from 'fs';
import type { License } from './types';

function getOutputIntro(license: License): string {
    return `${license.name} (${license.id}) applies to:`;
}

function getOutputPackages(license: License): string {
    return license.packages
        .map((packageObj) => {
            return `${packageObj.name}, ${packageObj.copyright}`;
        })
        .join('\n');
}

function getOutputLicenseBlock(license: License): string {
    return [getOutputIntro(license), getOutputPackages(license), license.text].join('\n\n');
}

function formatOutput(licenseList: License[]) {
    return licenseList
        .map((license): string => {
            return getOutputLicenseBlock(license);
        })
        .join('\n\n\n\n');
}

function writeFile(destinationFile: string, content: string) {
    fs.writeFileSync(destinationFile, content);
}

export function writeThirdPartiesFile(licenseList: License[], outputFile: string) {
    const formattedOutput = formatOutput(licenseList);
    writeFile(outputFile, formattedOutput);
}
