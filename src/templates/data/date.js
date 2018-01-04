Ledj.addCacheConfigVar('dateFormat', 'mm/dd/yyyy');

Ledj.formatDateString = function(date, dateFormat) {
    // if the moment library is available, use that to format the string.
    if(!!window.moment) {
        var date = moment(date.toString());
        var dateFormat = (dateFormat ? dateFormat : Ledj.defaults.dateFormat);
        return date.format(dateFormat);
    } else {
        var d = new Date(date);
        return (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();
    }
};

Ledj.setDataConvertType('date', function(val) {
    if(!!window.moment) { return moment(val); }
    else { return new Date(val); }
});

Ledj.addDataTemplate('date',function(data) {
    return `<span class="date">${Ledj.formatDateString(data.date, data.dateFormat)}</span>`;
    /* todo: don't put the date format in here. figure out a way to make this more generic */
});