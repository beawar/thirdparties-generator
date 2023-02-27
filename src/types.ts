import { Arguments } from 'yargs';

export interface CliArguments extends Arguments {
    projectDir: string;
    outFile: string;
}

export type Package = {
    name: string;
    copyright: string;
};

export type License = {
    id: string;
    name: string;
    text: string;
    packages: Package[];
};

export type SPDXLicense = {
    detailsUrl: string;
    isDeprecatedLicenseId: boolean;
    isOsiApproved: boolean;
    licenseId: string;
    name: string;
    reference: string;
    referenceNumber: number;
    seeAlso: string[];
};

export type SPDXLicenses = {
    licenseListVersion: string;
    licenses: SPDXLicense[];
    releaseDate: string;
};

export type SPDXLicenseCrossReference = {
    isLive: boolean;
    isValid: boolean;
    isWayBackLink: boolean;
    match: string;
    order: number;
    timestamp: string;
    url: string;
};

export type SPDXLicenseDetails = {
    crossRef: SPDXLicenseCrossReference[];
    isDeprecatedLicenseId: boolean;
    isFsfLibre: boolean;
    isOsiApproved: boolean;
    licenseId: string;
    licenseText: string;
    licenseTextHtml: string;
    name: string;
    seeAlso: string[];
    standardLicenseTemplate: string;
};
