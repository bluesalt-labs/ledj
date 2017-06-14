(function(window){
    'use strict';
    function define_lej() {
        var Lej = {};
        // todo: see <http://checkman.io/blog/creating-a-javascript-library/>
        return Lej;
    }

    if(typeof(Lej) === 'undefined') {
        window.Lej = define_lej();
        //window.Lej = define_Lej();
    } else {
        console.log("Lej is already defined.");
    }
})(window);