const placeholderRegex = /{{(\w+(?:\.\w+)*)}}/g;

export function embedModel(template: string, model: any): string {
    let output = template;
    let match = placeholderRegex.exec(template);
    while (match) {
        const subStrMatch = match[0] as string;
        const propertyPath = match[1] as string;
        const propertyValue = getValueByPath(model, propertyPath);
        if (propertyValue !== undefined) {
            output = output.replace(subStrMatch, `${propertyValue}`);
        }
        match = placeholderRegex.exec(template);
    }

    return output;
}

function getValueByPath(obj: any, propertyPath: string): any {
    const pathParts = propertyPath.split(".");
    let value = obj;
    for (const property of pathParts) {
        if (value === undefined) {
            return undefined;
        }
        value = value[property];
    }

    return value;
}
