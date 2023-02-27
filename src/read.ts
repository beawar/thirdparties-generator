import { ModuleInfo, ModuleInfos } from 'license-checker-rseidelsohn';
import keyBy from 'lodash/keyBy';
import type { License, SPDXLicense, SPDXLicenseDetails, SPDXLicenses } from './types';
import { LICENSES_URL } from './constants';

function fetchData<T>(url: Parameters<typeof fetch>[0]): Promise<T> {
    return fetch(url).then((response) => response.json());
}

function getLicenseDetails(license: SPDXLicense): Promise<SPDXLicenseDetails> {
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
    return fetchData<SPDXLicenseDetails>(license.detailsUrl).catch((error) => {
        console.error('Unable to fetch details for ', license.licenseId, license.detailsUrl, error);
        return baseLicense;
    });
}

async function putPackageInLicenseMap(
    licenseMap: { [license: string]: License },
    packageObject: ModuleInfo,
    license: string,
    spdxLicenseMap: Record<string, SPDXLicense>,
) {
    if (!licenseMap[license]) {
        if (spdxLicenseMap[license]) {
            const licenseDetails = await getLicenseDetails(spdxLicenseMap[license]);
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

export function createMapOfLicenses(packages: ModuleInfos): Promise<License[]> {
    return fetchData<SPDXLicenses>(LICENSES_URL).then(async (licensesData) => {
        const spdxLicenseMap = keyBy(licensesData.licenses, (license) => license.licenseId);
        const licenseMap: { [license: string]: License } = {};
        const packageList = Object.values(packages);
        for (let i = 0; i < packageList.length; i += 1) {
            const packageObject = packageList[i];
            const licenses = packageObject.licenses;
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
    });
}
