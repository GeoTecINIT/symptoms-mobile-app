import { environment as prodEnv } from '~/environments/environment.prod';
import { environment as testEnv } from '~/environments/environment.tst';

export type Environment = 'production' | 'development';

let environment = global.ENV_NAME as Environment;

export function getConfig() {
    switch (environment) {
        case 'production':
            return prodEnv;
        case 'development':
            return testEnv;
    }
}

export function setEnvironment(env: Environment) {
    environment = env;
}
