/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/api/': {
      target: 'http://localhost:8889',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  test: {
    '/api/': {
      target: 'http://10.15.119.63:8889',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  uat: {
    '/api/': {
      target: 'https://my-uat.vnpost.vn/myvnp',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  prod: {
    '/api/': {
      target: 'https://api-my.vnpost.vn',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
