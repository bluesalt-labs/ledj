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
