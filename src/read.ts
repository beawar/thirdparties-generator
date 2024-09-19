import type { ModuleInfo, ModuleInfos } from 'license-checker-rseidelsohn';
import type { License, SPDXLicense, SPDXLicenseDetails, SPDXLicenses } from './types.js';
import { LICENSES_URL } from './constants.js';
import { Logger } from './log.js';

async function fetchData<T>(url: Parameters<typeof fetch>[0]): Promise<T> {
    Logger.debug('fetch', url);
    const response = await fetch(url);
    return response.json() as Promise<T>;
}

async function getLicenseDetails(license: SPDXLicense): Promise<SPDXLicenseDetails> {
    const baseLicense: SPDXLicenseDetails = {
        licenseId: license.licenseId,
        name: '',
        licenseText: '',
        isDeprecatedLicenseId: false,
        licenseTextHtml: '',
        crossRef: [],
        isFsfLibre: false,
        isOsiApproved: false,
        seeAlso: [],
        standardLicenseTemplate: '',
    };
    if (!license.detailsUrl) {
        return Promise.resolve(baseLicense);
    }
    try {
        return await fetchData<SPDXLicenseDetails>(license.detailsUrl);
    } catch (error) {
        console.error('Unable to fetch details for ', license.licenseId, license.detailsUrl, error);
        return baseLicense;
    }
}

async function putPackageInLicenseMap(
    licenseMap: { [license: string]: License },
    packageObject: ModuleInfo,
    license: string,
    spdxLicenseMap: Record<string, SPDXLicense>,
) {
    if (!licenseMap[license]) {
        Logger.debug('Processing license', license, 'for', packageObject.name);
        const spdxLicence = spdxLicenseMap[license];
        if (spdxLicence) {
            const licenseDetails = await getLicenseDetails(spdxLicence);
            licenseMap[license] = {
                id: licenseDetails.licenseId,
                name: licenseDetails.name,
                text: licenseDetails.licenseText,
                packages: [],
            };
        } else {
            licenseMap[license] = {
                id: license,
                name: license,
                text: packageObject.licenseText || '',
                packages: [],
            };
        }
    }
    if (packageObject.name) {
        licenseMap[license].packages.push({
            name: packageObject.name,
            copyright: packageObject.copyright || '',
        });
        if (!packageObject.copyright) {
            console.error('Cannot find copyright for', packageObject.name);
        }
    }
}

export async function createMapOfLicenses(packages: ModuleInfos): Promise<License[]> {
    Logger.log('Creating map of packages');
    const licensesData = await fetchData<SPDXLicenses>(LICENSES_URL);
    Logger.log('Retrieving licenses information');
    const spdxLicenseMap = licensesData.licenses.reduce<{ [id: string]: SPDXLicense }>((accumulator, license) => {
        accumulator[license.licenseId] = license;
        return accumulator;
    }, {});
    const licenseMap: { [license: string]: License } = {};
    const packageList = Object.values(packages);
    Logger.debug('Number of packages to process', packageList.length);
    for (const packageObject of packageList) {
        const licenses = packageObject.licenses;
        Logger.debug('Processing', packageObject.name);
        if (licenses) {
            if (Array.isArray(licenses)) {
                for (const license of licenses) {
                    await putPackageInLicenseMap(licenseMap, packageObject, license, spdxLicenseMap);
                }
            } else {
                await putPackageInLicenseMap(licenseMap, packageObject, licenses, spdxLicenseMap);
            }
        }
    }
    return Object.values(licenseMap);
}
