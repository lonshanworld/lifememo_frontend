

function getImageType(array) {
    const header = array.slice(0, 4);
    const view = new DataView(header.buffer);
    const magic = view.getUint32(0);
    switch (magic) {
      case 0x89504e47:
        return 'image/png';
      case 0xffd8ffe0:
      case 0xffd8ffe1:
      case 0xffd8ffe2:
        return 'image/jpeg';
      case 0x47494638:
        return 'image/gif';
      default:
        return null;
    }
}


function getImageUrl(imageData){
  const array = new Uint8Array(imageData);
  const typetext = getImageType(array);
  const blob = new Blob([array], { type: typetext.toString()});
  const url = URL.createObjectURL(blob);
  return url;
  // var canvas = document.createElement("canvas");
  // var img = document.createElement('img');
  // img.src = url;
  // var context = canvas.getContext("2d");
  // context.drawImage(img, 0, 0);
  // return canvas.toDataURL();
}




export default getImageUrl;
