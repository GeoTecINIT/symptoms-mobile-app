import { getConfig } from '../../config';
import { Logger } from './common';
import { DevLogger } from './dev';
import { ProdLogger } from './prod';

export function getLogger(tag: string): Logger {
    const production = getConfig().production;
    if (production) {
        return new ProdLogger(tag);
    } else {
        return new DevLogger(tag);
    }
}
