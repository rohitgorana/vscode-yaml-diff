// yamlUtils.ts

import * as fs from 'fs';
import * as yaml from 'js-yaml';

export function readAndSortYaml(filePath: string): any {
    try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const data = yaml.load(fileContents);
        return sortKeys(data);
    } catch (e) {
        console.error(`Error reading or parsing ${filePath}:`, e);
        return null;
    }
}


export function sortKeys(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(sortKeys);
    }

    const sortedObj: any = {};
    Object.keys(obj)
        .sort()
        .forEach((key) => {
            sortedObj[key] = sortKeys(obj[key]);
        });

    return sortedObj;
}
