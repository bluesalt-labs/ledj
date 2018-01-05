Ledj.addCacheConfigVar('dateFormat', 'MM/DD/YYYY');

Ledj.formatDateObj = function(d, dateFormat) {
    // if the moment library is available, use that to format the string.
    if(!!window.moment) {
        return d.format( (dateFormat ? dateFormat : Ledj.defaults.dateFormat) );
    } else {
        return (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();
    }
};

Ledj.setDataConvertType('date', function(val) {
    var date = null;
    if(!!window.moment) { date = moment(val); }
    else {
        date = new Date(val);
        date.setTime( date.getTime() + date.getTimezoneOffset()*60*1000 );
    }
    return date;
});

Ledj.addDataTemplate('date',function(data) {
    return `<span class="date">${Ledj.formatDateObj(data.date, data.dateFormat)}</span>`;
    /* todo: don't put the date format in here. figure out a way to make this more generic */
});