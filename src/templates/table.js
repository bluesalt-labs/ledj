Ledj.templates.table = html`
<table class="ledj-table">
    <thead>
        <tr>
        ${Ledj.cache.jsonConfig[cacheID].headers.map(colConfig => html`
            <th>${colConfig.name}</th>
        `)}
        </tr>
    </thead>
    <tbody>
    ${(objectKey ? Ledj.cache.jsonData[cacheID][objectKey] : Ledj.cache.jsonData[cacheID]).map(dataItem => html`
        <tr>
        ${Ledj.cache.jsonConfig[cacheID].headers.map((colConfig, colName) => html`
            <td>${Ledj.getCellContent(colConfig, colName, dataItem)}</td>
        `)}
        </tr>
    `)}
    </tbody>
</table>
`;