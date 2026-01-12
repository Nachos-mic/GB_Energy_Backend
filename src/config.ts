export const config = {
    port: parseInt(process.env.PORT || '3100', 10),
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
};
