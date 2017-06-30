Ledj.addDataTemplate('tagArray', function(data) {
return `<div class="tag-container">
${data.tags.map(tag => `<span class="tag ${Ledj.nameToID(tag)}">${tag}</span>` ).join('')}
</div>`;
});
