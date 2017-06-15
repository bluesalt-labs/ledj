if (typeof _ === 'undefined') {
    throw new Error('Lej requires Lodash. Lodash must be included before Lej\'s JavaScript.')
}

(function(window){
    'use strict';
    function define_lej() {
        var Lej = {};

        Lej.cache = {
            jsonConfig: [],
            jsonData: []
        };

        var templates = {
            parent: _.template( // todo: add the ability to modify the parent template (class? title could be an issue).
                '<div class="lej-container">' +
                    '<% if(title) { print(title); } %>' + //"<h2 class=\'lej-title\'>" + title + "</h2>"
                    '<%= childHTML %>' +
                '</div>'
            ),
            linkGrid: _.template(
                '<div class="lej-link-grid">' +
                '<% _.forEach(linkItems, function(linkItem) { %>' +
                    '<a class="link-grid-item" href="<%= linkItem[itemHrefKey] %>"<% if(newTab) { %> target="_blank" <% } %>>' +
                        '<img src="<%= linkItem[itemImageKey] %>" title="<%= linkItem[itemTitleKey] %>" />' +
                        '<hr />' +
                        '<span><%= linkItem[itemTitleKey] %></span>' +
                    '</a>' +
                '<% }); %>' +
                '</div>'
            ),
            table: _.template(
                //'<table class="lej-table">' +
                '<span>todo</span>' // +
                //'</table>' +
            ),
            gifGrid: _.template(
                //'<div class="lej-gif-grid">' +
                '<span>todo</span>' // +
                //'</div>'
            )
        };

        /* Private Helper Functions */

        function getHostName() {
            return window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
        }

        function capitalize(string) {
            return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
        }

        /*
        Checks if a specified URL gives a status of 200
         */
        function urlExists(url, callbackSuccess, callbackFail, callbackArg) {
            var http = new XMLHttpRequest();
            http.open('HEAD', url);
            http.onreadystatechange = function() {
                if (this.readyState === this.DONE) {
                    if (this.status === 200) {
                        if(callbackSuccess !== null) { callbackSuccess(callbackArg); }
                        else { return 0; }
                    }
                    else {
                        if(callbackFail !== null) { callbackFail(callbackArg); }
                        else { return -1; }
                    }
                }
            };
            http.send();
        }

        function getJSONConfig(url, callback) {
            if(typeof url === 'string'){

                // Add date param to force clearing the browser cache
                url += '?dt=' + Date.now();

                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, true);
                xhr.responseType = 'json';
                xhr.onload = function() {
                    var status = xhr.status;
                    if (status === 200) { callback(null, xhr.response); }
                    else { callback(status); }
                };
                xhr.send();
            } else {
                callback('[url] must be a string.');
            }
        }

        function loadConfig(url, callback) {
            getJSONConfig(url, function(err, data) {
               if(err === null) {
                   if (data.hasOwnProperty('config') && data.hasOwnProperty('data')) {
                       var configIndex = Lej.cache.jsonConfig.push(data.config) - 1;
                       Lej.cache.jsonData[configIndex] = data.data; // todo make sure this works.

                       callback(configIndex);
                   } else {
                       err = 'JSON data must have `config` and `data` properties.';
                   }
               }

               if(err !== null) {
                   console.warn('Config file "' + url + '" could not be retrieved. ' + err);
               }
            });
        }

        function sortJsonDataBy(cacheID, propName) {
            if(Lej.cache.jsonData[cacheID]) {
                if( Array.isArray(Lej.cache.jsonData[cacheID]) ) {
                    Lej.cache.jsonData[cacheID] = _.sortBy(Lej.cache.jsonData[cacheID], propName);
                }

                else if(typeof Lej.cache.jsonData[cacheID] === 'object') {
                    for(var item in Lej.cache.jsonData[cacheID]) {
                        Lej.cache.jsonData[cacheID][item] = _.sortBy(Lej.cache.jsonData[cacheID][item], propName);
                    }
                }

                else {
                    console.warn('Could not sort cache.jsonData[' + cacheID + ']');
                }
            } else {
                console.warn('from Lej.sortJsonDataBy(): `cache.jsonData[' + cacheID + ']` does not exist.');
            }
        }

        function sortData(cacheID) {
            // todo: search the config for how to sort data. if not specified, try to figure it out?
            sortJsonDataBy(cacheID, 'title'); // debug
        }

        function getLinkItemsData(cacheID, objectKey) {
            if(objectKey) {
                return Lej.cache.jsonData[cacheID][objectKey];
            } else {
                return Lej.cache.jsonData[cacheID];
            }
        }

        function getLinkGridFromData(cacheID, objectKey) {
            var templateData = {
                'linkItems': getLinkItemsData(cacheID, objectKey),
                'itemHrefKey': 'href',      // todo set this in json config
                'newTab': true,             // todo set this in json config
                'itemImageKey': 'filename', // todo set this in json config
                'itemTitleKey': 'title'     // todo set this in json config

            };

            return wrapHtmlInParent(templates.linkGrid(templateData), cacheID, objectKey);
        }

        function getTableFromData(cacheID, objectKey) {
            var templateData = {
                'linkItems': getLinkItemsData(cacheID, objectKey)
            };

            return wrapHtmlInParent(templates.table(templateData), cacheID, objectKey);
        }

        function getGifGridFromData(cacheID, objectKey) {
            var templateData = {
                'linkItems': getLinkItemsData(cacheID, objectKey)
            };

            return wrapHtmlInParent(templates.gifGrid(templateData), cacheID, objectKey);
        }

        function getElementTitle(configID, objectKey) {
            if(!!objectKey && objectKey !== '') {
                var titleTag = 'h2';

                if( Lej.cache.jsonConfig[configID].hasOwnProperty('titleElementLevel') &&
                    typeof parseInt(Lej.cache.jsonConfig[configID].titleElementLevel) === 'number') {
                    titleTag = 'h' + Lej.cache.jsonConfig[configID].titleElementLevel;
                }

                return '<' + titleTag + 'class="lej-title">' + objectKey + '</' + titleTag + '>';
            } // else

            return null;
        }

        function wrapHtmlInParent(processedHTML, cacheID, objectKey) {
            return templates.parent({
                'title': getElementTitle(cacheID, objectKey),
                'childHTML': processedHTML
            });
        }

        function addElementsTo(cacheID, elementID) {
            var element = document.getElementById(elementID);

            // Make sure the DOM element exists
            if(!!element) {
                var functionToUse = null;

                switch(Lej.cache.jsonConfig[cacheID].type.toLowerCase()) {
                    case 'link-grid':
                    case 'linkgrid':
                        functionToUse = getLinkGridFromData;
                        break;
                    case 'table':
                        functionToUse = getTableFromData;
                        break;
                    case 'gif-grid':
                    case 'gifgrid':
                        functionToUse = getGifGridFromData;
                        break;
                    default:
                        console.log('A fallback template is not yet implemented.');
                }

                if(!!functionToUse) {
                    var toAppend = '';

                    if( Array.isArray(Lej.cache.jsonData[cacheID]) ) {
                        toAppend = functionToUse(cacheID);
                    }

                    else if(typeof Lej.cache.jsonData[cacheID] === 'object') {
                        for(var item in Lej.cache.jsonData[cacheID]) {
                            toAppend += functionToUse(cacheID, item);
                        }
                    }

                     else { // todo
                        console.warn('shouldn\'t get here');
                    }

                    if(toAppend !== '') {
                        element.innerHTML += toAppend;
                    }
                } else {
                    console.warn('A template could not be identified.');
                }
            } else {
                console.warn('Element ' + (!!elementID ? '#' + elementID : '[undefined]') + ' does not exist.');
            }
        }

        /* End Private Helper Functions */

        /*
        Creates new HTML elements from specified JSON data
        and attaches them to the specified DOM element
         */
        Lej.loadAndAttachTo = function(jsonUrl, elementID) {
            loadConfig(jsonUrl, function(cacheID){
                sortData(cacheID);
                addElementsTo(cacheID, elementID);
            }.bind(this));
        };

        // Alias
        Lej.attach = Lej.loadAndAttachTo;

        // Final Statement
        return Lej;
    }

    if(typeof(Lej) === 'undefined') {
        window.Lej = define_lej();
        //window.Lej = define_Lej();
    } else {
        console.log("Lej is already defined.");
    }
})(window);