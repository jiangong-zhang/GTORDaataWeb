export const saveDataToCSV = (name: string, data: number[]) => {
    // create file content
    const csvString = data.join(',\n');
  
    // write content to blob
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  
    // create blob url
    const url = URL.createObjectURL(blob);
  
    // init virtual dom link
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name}.csv`;
  
    // append then remove virtual dom click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};