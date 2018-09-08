Ledj.addTemplate('imageGrid', function(data) {
    return `<div class="ledj-image-grid">
${(data.objectKey ? Ledj.cache.jsonData[data.cacheID][data.objectKey] : Ledj.cache.jsonData[data.cacheID]).map(dataItem =>
    `<div class="image-grid-item">
        <img src="${Ledj.getImageUrl(dataItem[data.itemImageKey], data.cacheID, data.objectKey)}" title="${dataItem[data.itemTitleKey]}" />
    </div>`
    ).join('')}
</div>`;
});

