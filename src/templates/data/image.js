Ledj.addDataTemplate('image', function(data) {
return `<img class="image" src="${Ledj.getImageUrl(data.src, data.cacheID, data.objectKey)}"${data.alt ? ` alt="${data.alt}" ` : '' }/>`;
});