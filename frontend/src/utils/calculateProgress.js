export const calculateProgress = (collected, target) => {
    return Math.min((collected / target) * 100, 100);
};