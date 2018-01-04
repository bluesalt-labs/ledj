// todo: make this function more generic somehow ( getHtmlByDataType() ) so I can move them to the template files.
Ledj.getCellContent = function(colConfig, colName, itemData) {
    var cell = '';

    itemData[colName] = (!!itemData[colName] ? itemData[colName] : '');

    switch(colConfig.type.toLowerCase()) {
        case "url":
            cell += Ledj.templates.data.url({ 'text': itemData[colName], 'href': itemData[colConfig.href] });
            break;
        case "image":
            cell += Ledj.templates.data.image({ 'src': itemData[colConfig.src], 'alt': itemData[colConfig.alt] });
            break;
        case "date":
            var dateFormat = (colConfig.hasOwnProperty('dateFormat') ? colConfig.dateFormat : null);
            cell += Ledj.templates.data.date({ 'date': itemData[colName], 'dateFormat': dateFormat });
            break;
        case "phone":
            cell += Ledj.templates.data.phone({ 'phone_num': itemData[colName] });
            break;
        case "code":
            cell += Ledj.templates.data.code({ 'text': itemData[colName] });
            break;
        case "tag-array":
        case "tagarray":
            Ledj.cache.tagTemplateUsed = true; // we're using the tag template, so attach click event listeners
            cell += Ledj.templates.data.tagArray({ 'tags': itemData[colName] });
            break;
        case "string":
        default:
            cell += Ledj.templates.data.string({ 'text': itemData[colName] });
            break;
    }
    return cell;
};

Ledj.addTemplate('table', function(data) {
return `<table class="ledj-table">
    <thead>
        <tr>
        ${Object.keys(Ledj.cache.jsonConfig[data.cacheID].headers).map(headerName => `
            <th>${Ledj.cache.jsonConfig[data.cacheID].headers[headerName].name}</th>
        `).join('\n')}
        </tr>
    </thead>
    <tbody>
    ${(data.objectKey ? Ledj.cache.jsonData[data.cacheID][data.objectKey] : Ledj.cache.jsonData[data.cacheID]).map(dataItem => `
        <tr>
        ${Object.keys(Ledj.cache.jsonConfig[data.cacheID].headers).map(colName => `
            <td>${Ledj.getCellContent(Ledj.cache.jsonConfig[data.cacheID].headers[colName], colName, dataItem)}</td>
        `).join('\n')}
        </tr>
    `).join('\n')}
    </tbody>
</table>`;
});
