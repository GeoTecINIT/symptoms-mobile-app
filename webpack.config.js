const webpack = require("@nativescript/webpack");

module.exports = (env) => {
  webpack.init(env);

  // Learn how to customize:
  // https://docs.nativescript.org/webpack

  webpack.chainWebpack((config) => {
    config.plugin("DefinePlugin").tap((args) => {
      const mode = env.production ? "production" : "development";
      Object.assign(args[0], {
        "global.ENV_NAME": JSON.stringify(mode || "development"),
        "global.ENV_THERAPIST_PHONE": JSON.stringify(env.therapistPhone || ""),
      });

      return args;
    });
  });

  return webpack.resolveConfig();
};
