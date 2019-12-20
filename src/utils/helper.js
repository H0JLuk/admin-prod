export const downloadFile = (data, name) => {
    let blob = new Blob([data], {type: 'application/vnd.ms-excel'});
    let link = document.createElement('a');
    link.download = `${name}.xlsx`;
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
};