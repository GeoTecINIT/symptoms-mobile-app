import { getLogger } from '~/app/core/utils/logger';
import { DevLogger } from '~/app/core/utils/logger/dev';
import { ProdLogger } from '~/app/core/utils/logger/prod';
import { setEnvironment } from '~/app/core/config';

describe('Get logger', () => {
    it('returns a development logger while not in production', () => {
        const logger = getLogger('SomeTag');
        expect(logger instanceof DevLogger).toBeTruthy();
    });

    it('returns a production logger while in production', () => {
        setEnvironment('production');
        const logger = getLogger('SomeTag');
        expect(logger instanceof ProdLogger).toBeTruthy();
    });

    afterEach(() => {
        setEnvironment('development');
    });
});
