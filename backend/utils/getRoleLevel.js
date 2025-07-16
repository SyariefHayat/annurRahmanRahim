export const getRoleLevel = (role) => {
    switch (role) {
        case 'developer': return 4;
        case 'project manager': return 3;
        case 'coordinator': return 2;
        default: return 1;
    }
};