# Thirdparties generator

Generate a thirdparties file with all direct dependencies listed under the proper license.

## Installation

Install globally with npm

```bash
npm install -g thirdparties-generator
```
Or run directly with npx
```bash
npx thirdparties-generator
```
## Usage

| Arg          | Alias | Description                                                                                 |
|--------------|-------|---------------------------------------------------------------------------------------------|
| --projectDir | -p    | Project directory in which the dependencies are searched for and the output file is created |
| --outFile    | -o    | Name of the file which is generated by the script                                           |


Generate a file THIRDPARTIES in the current folder project
```bash
npx thirdparties-generator
```

Generate a file THIRDPARTIES in the specified project folder
```bash
npx thirdparties-generator -p path/to/project
```

Generate a file with the given name in the specified project folder
```bash
npx thirdparties-generator -p path/to/project -o something
```
## License

[MIT](LICENSE)
