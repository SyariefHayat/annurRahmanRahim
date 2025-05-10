const mapProvider = (providerId) => {
    switch (providerId) {
        case 'google.com': return 'google';
        case 'facebook.com': return 'facebook';
        case 'password': return 'email';
        default: return 'email';
    }
};

export default mapProvider;
