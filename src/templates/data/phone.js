Ledj.addDataTemplate('phone', function(data) {
    return `<span class="phone"><a href="tel:${data.phone_num}">${data.phone_num}</a></span>`;
});
