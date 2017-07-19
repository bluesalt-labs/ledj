Ledj.addTemplate('gifGrid', function(data) {
return `<div class="ledj-gif-grid">
${(data.objectKey ? Ledj.cache.jsonData[data.cacheID][data.objectKey] : Ledj.cache.jsonData[data.cacheID]).map((dataItem, id) =>
    `<div class="ledj-gif-item" id="ledj-gif-item-${id}">
        <div class="ledj-gif-loading-overlay" id="ledj-gif-loading-overlay-${id}"></div>
        <div class="ledj-gif-content" id="ledj-gif-content-${id}">
            <a class="ledj-gif-title-link" href="${Ledj.getImageUrl(dataItem.filename, data.cacheID, data.objectKey)}" target="_blank">${dataItem.title}</a>
            <hr />
            ${ Ledj.cache.jsonData.hasOwnProperty('source') ? `<!-- Source: ${Ledj.cache.jsonData.source} -->` : '' }
            <div class="ledj-gif-container">
                <video id="ledj-video-${id}" autoplay="true" loop="true">
                    <source src="${Ledj.getAssetUrl('vidExt', dataItem.filename, data.cacheID, data.objectKey)}" type="video/mp4" />
                    <img src="${Ledj.getImageUrl(dataItem.filename, data.cacheID, data.objectKey)}" title="Your browser does not support the <video> tag." />
                </video>
            </div>
        </div>
    </div>`
).join('')}
</div>`;
});

// todo: split the video element out as a data type.