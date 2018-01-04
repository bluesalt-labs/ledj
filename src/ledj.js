(function(window){
    'use strict';
    function define_ledj() {
        var Ledj = {};

        // set Ledj defaults
        Ledj.defaults = {
            //sortBy: { prop: 'title', type: 'string' },
            sortDir: 'asc',
            selectMultipleTags: true
        };

        // Initiate cache variables and set to default values
        Ledj.cache = {
            curCacheID: -1,
            jsonConfig: [],
            jsonData:   [],
            jsonUrl:    [],
            elementID:  [],
            sortDir:            Ledj.defaults.sortDir,
            selectMultipleTags: Ledj.defaults.selectMultipleTags,
            tagTemplateUsed:    false
        };

        Ledj.dataObjectTypes = {};

        // todo: If I stored all the class and ID names in a config object,
        // todo: I could add functionality to change those class/ID names.

        Ledj.templates = {
            data: {}
        };

        /*
        Checks if a specified URL gives a status of 200
         */
        Ledj.urlExists = function(url, callbackSuccess, callbackFail, callbackArg) {
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
        };

        Ledj.reset = function(cacheID) {
            resetElement(Ledj.cache.elementID[cacheID]);
        };

        Ledj.getJSONConfig = function(url, callback) {
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
        };

        Ledj.getHostName = function() {
            return window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
        };

        Ledj.capitalize = function(string) {
            if(typeof string === 'string') {
                return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
            } else {
                return string;
            }
        };

        Ledj.nameToID = function(name) {
            return name.replace(/\\s/g, "-").toLowerCase();
        };

        // Click Event Listener for tag elements (see Ledj.templates.data.tagArray template)
        Ledj.toggleActiveTagsByClassName = function(e) {
            var tagClass = e.target.className.replace('tag', '').replace('active', '').trim();

            if(Ledj.defaults.selectMultipleTags) {
                for(let el of document.getElementsByClassName(tagClass)) {
                    if(el.className.includes('active')) { el.className = 'tag ' + tagClass; }
                    else { el.className = 'tag active ' + tagClass; }
                }
            } else {
                for(let el of document.getElementsByClassName('tag')) {
                    var classNames = el.className.split(' ');
                    if(classNames.includes(tagClass) && !classNames.includes('active')) { el.className = 'tag active ' + tagClass; }
                    else { el.className = el.className.replace('active', '').trim(); }
                }
            }
        };
        // Adds click event listener for tag elements (see Ledj.templates.data.tagArray template)
        // todo: attach this to the tags' parent div and modify the click event
        Ledj.addTagClickListeners = function() {
            for(let el of document.getElementsByClassName('tag')) {
                el.addEventListener("click", Ledj.toggleActiveTagsByClassName);
            }
        };
        // Removes click event listener for tag elements (see Ledj.templates.data.tagArray template)
        // todo: attach this to the tags' parent div and modify the click event
        Ledj.removeTagClickListeners = function() {
            for(let el of document.getElementsByClassName('tag')) {
                el.removeEventListener("click", Ledj.toggleActiveTagsByClassName);
            }
        };

        Ledj.getImageUrl = function(imageTitle, cacheID, objectKey) {
            var srcDir = '/';
            var ext = (Ledj.cache.jsonConfig[cacheID].hasOwnProperty('imgExt') ? Ledj.cache.jsonConfig[cacheID]['imgExt']: '');

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
        };

        Ledj.getAssetUrl = function(assetExt, assetTitle, cacheID, objectKey) {
            var srcDir = '/';
            var ext = (Ledj.cache.jsonConfig[cacheID].hasOwnProperty(assetExt) ? Ledj.cache.jsonConfig[cacheID][assetExt]: '');

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

            return srcDir + assetTitle + ext;
        };


        /** Private Helper Functions **/

        function loadConfigFromObj(data, callback) {
            if (data.hasOwnProperty('config') && data.hasOwnProperty('data')) {
                Ledj.cache.curCacheID = Ledj.cache.jsonConfig.push(data.config) - 1;
                Ledj.cache.jsonData[Ledj.cache.curCacheID] = data.data;
                if(data.hasOwnProperty('url')) { Ledj.cache.jsonUrl[Ledj.cache.curCacheID] = data.url; }

                callback(Ledj.cache.curCacheID);
            } else {
                console.warn('Loaded data must have `config` and `data` properties.');
            }
        }

        function loadConfigFromUrl(url, callback) {
            Ledj.getJSONConfig(url, function(err, data) {
               if(err !== null) {
                   console.warn('Config file "' + url + '" could not be retrieved. ' + err);
                   return false;
               }

               data.url = url;
                loadConfigFromObj(data, callback);
            });
        }

        function convertDataType(data, type) {
            if(Ledj.dataObjectTypes.hasOwnProperty(type)) {
                return Ledj.dataObjectTypes[type](data);
            }

            return data;
        }

        function dataSortCompareHelper(a, b) {
            try {
                if (!!a[Ledj.cache.sortBy.prop] && !!b[Ledj.cache.sortBy.prop]) {
                    if(Ledj.cache.sortBy.prop && Ledj.cache.sortBy.type) {
                        a[Ledj.cache.sortBy.prop] = convertDataType(a[Ledj.cache.sortBy.prop], Ledj.cache.sortBy.type);
                        b[Ledj.cache.sortBy.prop] = convertDataType(b[Ledj.cache.sortBy.prop], Ledj.cache.sortBy.type);
                    }
                    // If the value we're sorting by is a string, ignore case
                    var propA = ( typeof a[Ledj.cache.sortBy.prop] === 'string' ? a[Ledj.cache.sortBy.prop].toLowerCase() : a[Ledj.cache.sortBy.prop] );
                    var propB = ( typeof b[Ledj.cache.sortBy.prop] === 'string' ? b[Ledj.cache.sortBy.prop].toLowerCase() : b[Ledj.cache.sortBy.prop] );

                    if(a[Ledj.cache.sortBy.prop] !== b[Ledj.cache.sortBy.prop]) {
                        if(Ledj.cache.sortDir === 'desc') {
                            return (propA > propB ? -1 : 1);
                        } else {
                            return (propA < propB ? -1 : 1);
                        }
                    }
                }
            } catch(e) {}

            return 0;
        }

        /*
        Sets the sort by property to value from config or default.
         */
        function setSortBy(cacheID) {
            // Figure out what we're sorting the data by, if at all.
            // Reset sortBy before starting
            Ledj.cache.sortBy = null;

            // Try the preferred format first.
            try {
                Ledj.cache.jsonConfig[cacheID].sortBy = {
                    prop: Ledj.cache.jsonConfig[cacheID].sortBy.prop,
                    type: Ledj.cache.jsonConfig[cacheID].sortBy.type.toLowerCase()
                };
            } catch(e) {
                try {
                    if(typeof Ledj.cache.jsonConfig[cacheID].sortBy === 'string') {
                        Ledj.cache.jsonConfig[cacheID].sortBy = {
                            prop: Ledj.cache.jsonConfig[cacheID].sortBy,
                            type: null // 'string'?
                        };
                    }
                    else if( Array.isArray(Ledj.cache.jsonData[cacheID].sortBy) && Ledj.cache.jsonData[cacheID].sortBy.length > 1 ) {
                        // assume that this is in the format [ '{prop}', '{type}' ].
                        // values after index 0 and 1 will be ignored.
                        Ledj.cache.jsonConfig[cacheID].sortBy = {
                            prop: Ledj.cache.jsonConfig[cacheID].sortBy[0],
                            type: Ledj.cache.jsonConfig[cacheID].sortBy[1].toLowerCase()
                        };
                    }
                    else if(typeof Ledj.cache.jsonConfig[cacheID].sortBy === 'object'){
                        // assume this is in the format { [prop]: '[type]' }.
                        // values after the first key:value pair will be ignored.
                        Ledj.cache.jsonData[cacheID].sortBy = {
                            prop: Object.keys(Ledj.cache.jsonData[cacheID].sortBy)[0],
                            type: Ledj.cache.jsonData[cacheID].sortBy[0].toLowerCase()
                        };
                    }
                } catch(e) {
                    // This function couldn't figure out what to sort by, so sorting will not take place.
                    Ledj.cache.jsonConfig[cacheID].sortBy = null;
                }
            } finally {
                // Set the temporary cache.sortBy and cache.sortDir variables for the compare function
                Ledj.cache.sortBy = Ledj.cache.jsonConfig[cacheID].sortBy;
            }
        }

        /*
        Sets the sort direction to value from config or default.
         */
        function setSortDir(cacheID) {
            // Figure out what direction we're sorting the data by
            if(Ledj.cache.jsonConfig[cacheID].hasOwnProperty('sortDir')) {
                // Set the temporary cache.sortDir variables for the compare function
                Ledj.cache.sortDir = Ledj.cache.jsonConfig[cacheID].sortDir;

                if( Ledj.cache.jsonConfig[cacheID].sortDir.toLowerCase() === 'asc' ||
                    Ledj.cache.jsonConfig[cacheID].sortDir === 0 ) { Ledj.cache.sortDir = 'asc'; }
                else if (Ledj.cache.jsonConfig[cacheID].sortDir.toLowerCase() === 'desc' ||
                    Ledj.cache.jsonConfig[cacheID].sortDir === 1 ) { Ledj.cache.sortDir = 'desc'; }
                else {
                    console.warn('Invalid sort direction "' + Ledj.cache.jsonConfig[cacheID].sortDir + '". Defaulting to "asc (0)".');
                    Ledj.cache.jsonConfig[cacheID].sortDir = Ledj.defaults.sortDir;
                }
            } else {
                Ledj.cache.jsonConfig[cacheID].sortDir = Ledj.defaults.sortDir;
            }
        }

        /*
        Sorts the data before template parsing.
         */
        function sortData(cacheID) {
            if(Ledj.cache.jsonData[cacheID]) {
                setSortBy(cacheID);

                // Sort the data if a sortBy value has been specified.
                if(Ledj.cache.sortBy !== null) {
                    setSortDir(cacheID);

                    if( Array.isArray(Ledj.cache.jsonData[cacheID]) ) {
                        Ledj.cache.jsonData[cacheID] = Ledj.cache.jsonData[cacheID].sort(dataSortCompareHelper);
                    }
                    else if(typeof Ledj.cache.jsonData[cacheID] === 'object') {
                        for(var item in Ledj.cache.jsonData[cacheID]) {
                            Ledj.cache.jsonData[cacheID][item].sort(dataSortCompareHelper);
                        }
                    }
                    else {
                        console.warn('Could not sort cache.jsonData[' + cacheID + ']');
                    }
                } // else, don't sort the data.
            } else {
                console.warn('from Ledj.sortJsonDataBy(): `cache.jsonData[' + cacheID + ']` does not exist.');
            }
        }

        function getLinkGridFromData(cacheID, objectKey, childID = null) {
            var templateData = {
                'cacheID': cacheID,
                'objectKey': objectKey,
                'itemHrefKey': 'href',      // todo set this in json config
                'newTab': true,             // todo set this in json config
                'itemImageKey': 'filename', // todo set this in json config
                'itemTitleKey': 'title'     // todo set this in json config

            };

            return wrapHtmlInParent(Ledj.templates.linkGrid(templateData), cacheID, objectKey, childID);
        }

        function getTableFromData(cacheID, objectKey, childID = null) {
            var templateData = {
                'cacheID': cacheID,
                'objectKey': objectKey
            };

            return wrapHtmlInParent(Ledj.templates.table(templateData), cacheID, objectKey, childID);
        }

        function getGifGridFromData(cacheID, objectKey, childID = null) {
            var templateData = {
                'cacheID': cacheID,
                'objectKey': objectKey
            };

            return wrapHtmlInParent(Ledj.templates.gifGrid(templateData), cacheID, objectKey, childID);
        }

        function wrapHtmlInParent(processedHTML, cacheID, objectKey = null, childID = null) {
            return Ledj.templates.parent({
                title: ( objectKey ? getElementTitle(cacheID, objectKey) : null ),
                elementID: 'ledj-container-' + cacheID + (childID !== null ? ('-'+childID) : ''),
                childHTML: processedHTML
            });
        }

        function addElementsTo(cacheID, elementID) {
            var element = document.getElementById(elementID);

            // Make sure the DOM element exists
            if(!!element) {
                // Store the valid elementID
                Ledj.cache.elementID[cacheID] = elementID;

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
                        var childToAppend = '';

                        if(Ledj.cache.jsonData[cacheID] > 1) {
                            var i = 0;
                            for(var item in Ledj.cache.jsonData[cacheID]) {
                                childToAppend += functionToUse(cacheID, item, i);
                                i++;
                            }

                            toAppend = wrapHtmlInParent(childToAppend, cacheID);
                        } else {
                            toAppend = functionToUse(cacheID, Object.keys(Ledj.cache.jsonData[cacheID])[0]);
                        }
                    }

                     else { // todo
                        console.warn('Couldn\'t find a template to use - Ledj shouldn\'t get here');
                    }

                    if(toAppend !== '') {
                        element.innerHTML += toAppend;

                        // Add tag click event listener if tags were attached to the page
                        if(Ledj.cache.tagTemplateUsed) {
                            Ledj.removeTagClickListeners(); // prevents duplicate event listeners
                            Ledj.addTagClickListeners();
                        }
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
                var titleTag = 'h1';

                if( Ledj.cache.jsonConfig[configID].hasOwnProperty('titleElementLevel') &&
                    typeof parseInt(Ledj.cache.jsonConfig[configID].titleElementLevel) === 'number') {
                    titleTag = 'h' + Ledj.cache.jsonConfig[configID].titleElementLevel;
                }

                return '<' + titleTag + ' class="ledj-title">' + objectKey + '</' + titleTag + '>';
            } // else

            return null;
        }

        function resetElement(elementID) {
            try {
                document.getElementById(elementID).innerHTML = '';
            } catch(e) {
                console.warn(e); // debug?
            }
        }

        /*
        Callback for Ledj.loadAndAttachTo and Ledj.loadFromObjAndAttachTo.
        Sorts, parses, and attaches data to the DOM.
         */
        function sortAndAttachCallback(cacheID, elementID) {
            // reset this flag if a previous data set used the tag template.
            Ledj.cache.tagTemplateUsed = false;
            sortData(cacheID);
            addElementsTo(cacheID, elementID);
        }

        /* End Private Helper Functions */

        /*
        Adds a new template for use
         */
        Ledj.addTemplate = function(templateName, template) {
            Ledj.templates[templateName] = template;
        };

        /*
        Adds a new data type template for use
         */
        Ledj.addDataTemplate = function(dataType, template) {
            Ledj.templates.data[dataType] = template;
        };

        /*
        Adds a new data type with a function for converting it from its json value
         */
        Ledj.setDataConvertType = function(typeName, objectType) {
            Ledj.dataObjectTypes[typeName] = objectType;
        };

        /*
        Adds a new config variable to the config defaults
         */
        Ledj.addCacheConfigVar = function(varName, varDefault) {
            Ledj.defaults[varName] = varDefault;
        };

        /*
        Creates new HTML elements from specified JSON data URL
        and attaches them to the specified DOM element.
        This is the primary method for loading data and attaching elements.
         */
        Ledj.loadAndAttachTo = function(jsonUrl, elementID) {
            loadConfigFromUrl(jsonUrl, function(cacheID) {
                sortAndAttachCallback(cacheID, elementID);
            });
        };

        /*
         Creates new HTML elements from specified JSON data object
         and attaches them to the specified DOM element.
         */
        Ledj.loadFromObjAndAttachTo = function(jsonData, elementID) {
            loadConfigFromObj(jsonData, function(cacheID) {
                sortAndAttachCallback(cacheID, elementID);
            });
        };

        /*
         If the specified cache ID exists, the associated element is cleared,
         the data retrieved again, and the HTML elements re-added to that container.
         */
        Ledj.reloadFromUrlByID = function(cacheID) {
            var numCacheID = parseInt(cacheID);

            if(typeof numCacheID === 'number' && !!this.cache.jsonUrl[numCacheID] && !!this.cache.elementID[numCacheID]) {
                this.reset(numCacheID); // todo: make sure this works.
                this.loadAndAttachTo(this.cache.jsonUrl[numCacheID], this.cache.elementID[numCacheID]);
            } else {
                console.log('Could not reload: cacheID ' + cacheID + ' is invalid.');
            }
        };

        /*
         If the specified cache ID exists, the associated element is cleared,
         the cached data is replaced with the specified data, and the HTML elements re-added to that container.
         */
        Ledj.reloadFromObjByID = function(jsonData, cacheID) {
            var numCacheID = parseInt(cacheID);

            if(typeof numCacheID === 'number' && !!this.cache.elementID[numCacheID]) {
                this.reset(numCacheID);
                this.loadFromObjAndAttachTo(jsonData, this.cache.elementID[numCacheID]);
            } else {
                console.log('Could not reload: cacheID ' + cacheID + ' is invalid.');
            }
        };

        // Alias for Ledj.loadAndAttachTo
        Ledj.attach = Ledj.loadAndAttachTo;
        // Alias for Ledj.loadFromObjAndAttachTo
        Ledj.attachWith = Ledj.loadFromObjAndAttachTo;
        // Alias for Ledj.reloadFromUrlByID
        Ledj.reload =  Ledj.reloadFromUrlByID;
        // Alias for Ledj.reloadFromObjByID
        Ledj.reloadwith = Ledj.reloadFromObjByID;

        // Final Statement
        return Ledj;
    }

    if(typeof(Ledj) === 'undefined') {
        //export default 'Ledj';
        window.Ledj = define_ledj();
    } else {
        console.log("Ledj is already defined.");
    }
})(window);