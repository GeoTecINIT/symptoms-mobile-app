import { environment as prodEnv } from '~/environments/environment.prod';
import { environment as testEnv } from '~/environments/environment.tst';

export type Environment = 'prod' | 'test';

let environment: Environment = 'prod';

export function getConfig() {
    switch (environment) {
        case 'prod':
            return prodEnv;
        case 'test':
            return testEnv;
    }
}

export function setEnvironment(env: Environment) {
    environment = env;
}
