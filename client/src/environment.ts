export const environment = process.env.NODE_ENV === 'production'
    ? {
        production: true,
        base_url: process.env.BASE_URL || 'https://ricycle.azurewebsites.net/',
    }
    : {
        production: false,
        base_url: 'https://localhost:7189/api/',
    }