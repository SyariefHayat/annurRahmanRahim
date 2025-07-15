export const getRoleLevel = (role) => {
    switch(role) {
        case 'developer': return 4;
        case 'product manager': return 3;
        case 'product curator': return 2;
        case 'fundraiser': return 2;
        default: return 1;
    }
};