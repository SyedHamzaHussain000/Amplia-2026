export const getFilenameFromUrl = (url: string | any): string => {
    if (typeof url !== "string") return "";
    const parts = url.split("/");
    return parts[parts.length - 1];
};
