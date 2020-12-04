export const downloadFile = (data, name) => {
    let blob = new Blob([data], {type: 'application/vnd.ms-excel'});
    let link = document.createElement('a');
    link.download = `${name}.xlsx`;
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
};

export const loadImageWithPromise = (url, failUrl) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => reject(failUrl);
        img.src = url;
    });
};

export function templateLink(filename) {
    return `${process.env.PUBLIC_URL}/templates/${filename}`;
}
