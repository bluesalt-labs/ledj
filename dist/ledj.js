if (typeof _ === 'undefined') {
    throw new Error('Ledj requires Lodash. Lodash must be included before Ledj\'s JavaScript.')
}

(function(window){
    'use strict';
    function define_ledj() {
        var Ledj = {};

        Ledj.cache = {
            jsonConfig: [],
            jsonData: []
        };

        var templates = {
            parent: _.template( // todo: add the ability to modify the parent template (class? title could be an issue).
                '<div class="ledj-container">' +
                    '<% if(title) { print(title); } %>' +
                    '<%= childHTML %>' +
                '</div>'
            ),
            linkGrid: _.template(
                '<div class="ledj-link-grid">' +
                '<% _.forEach(linkItems, function(linkItem) { %>' +
                    '<a class="link-grid-item" href="<%= linkItem[itemHrefKey] %>"<% if(newTab) { %> target="_blank" <% } %>>' +
                        '<img src="<%= getImageUrl(linkItem[itemImageKey], cacheID, objectKey) %>" title="<%= linkItem[itemTitleKey] %>" />' +
                        '<span><%= linkItem[itemTitleKey] %></span>' +
                    '</a>' +
                '<% }); %>' +
                '</div>'
            ),
            table: _.template(
                //'<table class="ledj-table">' +
                '<span>todo</span>' // +
                //'</table>' +
            ),
            gifGrid: _.template(
                //'<div class="ledj-gif-grid">' +
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
                       var configIndex = Ledj.cache.jsonConfig.push(data.config) - 1;
                       Ledj.cache.jsonData[configIndex] = data.data; // todo make sure this works.

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
            if(Ledj.cache.jsonData[cacheID]) {
                if( Array.isArray(Ledj.cache.jsonData[cacheID]) ) {
                    Ledj.cache.jsonData[cacheID] = _.sortBy(Ledj.cache.jsonData[cacheID], propName);
                }

                else if(typeof Ledj.cache.jsonData[cacheID] === 'object') {
                    for(var item in Ledj.cache.jsonData[cacheID]) {
                        Ledj.cache.jsonData[cacheID][item] = _.sortBy(Ledj.cache.jsonData[cacheID][item], propName);
                    }
                }

                else {
                    console.warn('Could not sort cache.jsonData[' + cacheID + ']');
                }
            } else {
                console.warn('from Ledj.sortJsonDataBy(): `cache.jsonData[' + cacheID + ']` does not exist.');
            }
        }

        function sortData(cacheID) {
            // todo: search the config for how to sort data. if not specified, try to figure it out?
            sortJsonDataBy(cacheID, 'title'); // debug
        }

        function getLinkItemsData(cacheID, objectKey) {
            if(objectKey) {
                return Ledj.cache.jsonData[cacheID][objectKey];
            } else {
                return Ledj.cache.jsonData[cacheID];
            }
        }

        function getLinkGridFromData(cacheID, objectKey) {
            var templateData = {
                'linkItems': getLinkItemsData(cacheID, objectKey),
                'cacheID': cacheID,
                'objectKey': objectKey,
                'getImageUrl': getImageUrl, // really?
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

                switch(Ledj.cache.jsonConfig[cacheID].type.toLowerCase()) {
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

                    if( Array.isArray(Ledj.cache.jsonData[cacheID]) ) {
                        toAppend = functionToUse(cacheID);
                    }

                    else if(typeof Ledj.cache.jsonData[cacheID] === 'object') {
                        for(var item in Ledj.cache.jsonData[cacheID]) {
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

        function getElementTitle(configID, objectKey) {
            if(!!objectKey && objectKey !== '') {
                var titleTag = 'h2';

                if( Ledj.cache.jsonConfig[configID].hasOwnProperty('titleElementLevel') &&
                    typeof parseInt(Ledj.cache.jsonConfig[configID].titleElementLevel) === 'number') {
                    titleTag = 'h' + Ledj.cache.jsonConfig[configID].titleElementLevel;
                }

                return '<' + titleTag + ' class="ledj-title">' + objectKey + '</' + titleTag + '>';
            } // else

            return null;
        }

        function getImageUrl(imageTitle, cacheID, objectKey) {
            var srcDir = '/';
            var ext = (Ledj.cache.jsonConfig[cacheID].hasOwnProperty('imgExt') ? Ledj.cache.jsonConfig[cacheID].imgExt : '');

            if(Ledj.cache.jsonConfig[cacheID].hasOwnProperty('srcDir')) {
                srcDir = Ledj.cache.jsonConfig[cacheID].srcDir;
            }

            else if(Ledj.cache.jsonConfig[cacheID].hasOwnProperty('srcDirs')) {
                if(!!objectKey && Ledj.cache.jsonConfig[cacheID].srcDirs.hasOwnProperty(objectKey)) {
                    srcDir = Ledj.cache.jsonConfig[cacheID].srcDirs[objectKey];
                }
                else if(Ledj.cache.jsonConfig[cacheID].srcDirs.hasOwnProperty('Default')) {
                    srcDir = Ledj.cache.jsonConfig[cacheID].srcDirs['Default'];
                }
                else if(Ledj.cache.jsonConfig[cacheID].srcDirs.hasOwnProperty('default')) {
                    srcDir = Ledj.cache.jsonConfig[cacheID].srcDirs['default'];
                }
            }

            return srcDir + imageTitle + ext;
        }

        /* End Private Helper Functions */

        /*
        Creates new HTML elements from specified JSON data
        and attaches them to the specified DOM element
         */
        Ledj.loadAndAttachTo = function(jsonUrl, elementID) {
            loadConfig(jsonUrl, function(cacheID){
                sortData(cacheID);
                addElementsTo(cacheID, elementID);
            }.bind(this));
        };

        // Alias
        Ledj.attach = Ledj.loadAndAttachTo;

        // Final Statement
        return Ledj;
    }

    if(typeof(Ledj) === 'undefined') {
        window.Ledj = define_ledj();
        //window.Ledj = define_Ledj();
    } else {
        console.log("Ledj is already defined.");
    }
})(window);