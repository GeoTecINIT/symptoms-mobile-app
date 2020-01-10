import { getConfig, setEnvironment } from '~/app/core/config';

describe('Config', () => {
    it('returns production environment by default', () => {
        setEnvironment('prod');
        const conf = getConfig();
        expect(conf.production).toBe(true);
    });

    it('changes environment when required', () => {
        setEnvironment('test');
        const conf = getConfig();
        expect(conf.production).toBe(false);
    });
});
