import { getConfig } from '../../config';
import { DevLogger } from './dev';
import { ProdLogger } from './prod';

export function getLogger(tag: string) {
    const production = getConfig().production;
    if (production) {
        return new ProdLogger(tag);
    } else {
        return new DevLogger(tag);
    }
}
