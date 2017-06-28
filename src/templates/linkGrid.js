Ledj.templates.linkGrid = html`
<div class="ledj-link-grid">
${(objectKey ? Ledj.cache.jsonData[cacheID][objectKey] : Ledj.cache.jsonData[cacheID]).map(dataItem => html`
    <a class="link-grid-item" href="${dataItem[itemHrefKey]}"${newTab ? ` target="_blank"` : ``}
        <img src="${Ledj.getImageUrl(dataItem[itemImageKey], cacheID, objectKey)}" title="${dataItem[itemTitleKey]}" />
        <span>${dataItem[itemTitleKey]}</span>
    </a>
`)}
</div>
`;