// todo: make this less confusing/weird.
Ledj.templates.data.image = html`  
<img class="image" src="${Ledj.getImageUrl(src, cacheID, objectKey)}"${alt ? ` alt="${alt}"` : `` } />
`;