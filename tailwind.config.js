module.exports = {
    mode: 'jit',
    purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        fontFamily: {
            sans: ['Roboto', 'sans-serif'],
        },
        screens: {
            'screen1200': { 'max': '1200px' },
            'screen1024': { 'max': '1024px' },
            'screen991': { 'max': '991px' },
            'screen800': { 'max': '800px' },
            'screen500': { 'max': '500px' }
        },
        extend: {
            boxShadow: {
                'cs-1': '0px 3px 8px rgba(0, 0, 0, 0.06), 0px 3px 7px rgba(0, 0, 0, 0.04)',
                'cs-2': '0px 4px 12px rgba(0, 0, 0, 0.12)',
                'cs-3': '0px 0.885714px 2.65714px rgba(0, 0, 0, 0.1), 0px 0.885714px 1.77143px rgba(0, 0, 0, 0.06)',
                'cs-4': '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
                'cs-5': '0px 4.64831px 7.30449px rgba(0, 0, 0, 0.02)',
            },
            colors: {
                'cc-black': '#0E2E35',
                'cc-blue': '#2D9CDB'
            },
            backgroundColor:{
                'cbc-1': '#FCFCFC',
                'cbc-pattern': '#B5ECFF',
                'cbc-grey': '#E0E0E0',
                'cbc-grey-sec':  '#F2F2F2',
                'cbc-check': '#F1F1F1',
                'cbc-check-hover': '#DBDBDB',
                'cbc-transparent': 'rgba(0, 0, 0, 0.0758)',
                'cbc-auth': '#FBFBFB'
            }
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
