export const getInitial = (name = "") => {
    const words = name.trim().split(" ");

    if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
    }

    return name.slice(0, 2).toUpperCase();
};