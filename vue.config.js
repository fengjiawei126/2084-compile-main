module.exports = {
    devServer: {
        proxy: {
            '/api_NFA': {
                target: 'http://13.70.38.82:8082/',
                changeOrigin: true,
                pathRewrite: {
                    '^/api_NFA': ''
                }
            },
            '/api_DFA': {
                target: 'http://13.70.38.82:8883/',
                changeOrigin: true,
                pathRewrite: {
                    '^/api_DFA': ''
                }
            },
            '/api_Predict': {
                target: 'http://13.70.38.82:8883/',
                changeOrigin: true,
                pathRewrite: {
                    '^/api_Predict': ''
                }
            },
            '/api_RDA': {
                target: 'http://13.70.38.82:5000/',
                changeOrigin: true,
                pathRewrite: {
                    '^/api_RDA': ''
                }
            },
            '/api_LR0': {
                target: 'http://52.184.36.174:8883/',
                changeOrigin: true,
                pathRewrite: {
                    '^/api_LR0': ''
                }
            },
        }
    },

    transpileDependencies: [
        'vuetify'
    ],

    pwa: {
        workboxOptions: {
            skipWaiting: true,
            clientsClaim: true,
            importWorkboxFrom: 'local',
            importsDirectory: 'js',
            navigateFallback: '/',
            navigateFallbackBlacklist: [/\/api\//]
        }
    },
    publicPath: './'
}