window.Ledj.templates.data.tagArray = `
<div class="tag-container">
${tags.map(tag => html`
    <span class="tag ${Ledj.nameToID(tag)}">${tag}</span>
`)}
</div>
`;