Ledj.addTemplate('linkGrid', function(data) {
return `<div class="ledj-link-grid">
${(data.objectKey ? Ledj.cache.jsonData[data.cacheID][data.objectKey] : Ledj.cache.jsonData[data.cacheID]).map(dataItem => 
    `<a class="link-grid-item" href="${dataItem[data.itemHrefKey]}"${data.newTab ? ' target="_blank"' : ''}>
        <img src="${Ledj.getImageUrl(dataItem[data.itemImageKey], data.cacheID, data.objectKey)}" title="${dataItem[data.itemTitleKey]}" />
        <span>${dataItem[data.itemTitleKey]}</span>
    </a>`
).join('')}
</div>`;
});