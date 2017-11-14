(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("ledj", [], factory);
	else if(typeof exports === 'object')
		exports["ledj"] = factory();
	else
		root["ledj"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Ledj core
__webpack_require__(1);

// Ledj templates
__webpack_require__(2);
__webpack_require__(3);
__webpack_require__(4);
__webpack_require__(5);
__webpack_require__(6);

// Ledj data templates
__webpack_require__(7);
__webpack_require__(8);
__webpack_require__(9);
__webpack_require__(10);
__webpack_require__(11);
__webpack_require__(12);
__webpack_require__(13);

// Ledj stylesheets
__webpack_require__(14);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (window) {
    'use strict';

    function define_ledj() {
        var Ledj = {};

        Ledj.cache = {
            jsonConfig: [],
            jsonData: [],
            jsonUrl: [],
            elementID: [],
            sortDataBy: '',
            sortDataDir: '',
            curCacheID: -1,
            tagTemplateUsed: false
        };

        // todo: I could set each Ledj.defaults.foo to Ledj.foo and have functions that
        // todo: set the default on init. Then either the loaded config or just Ledj.foo = bar changes the setting.
        Ledj.defaults = {
            sortDataBy: 'title',
            sortDataDir: 'asc',
            dateFormat: 'mm/dd/yyyy',
            selectMultipleTags: true
        };

        // todo: If I stored all the class and ID names in a config object,
        // todo: I could add functionality to change those class/ID names.

        Ledj.templates = {
            data: {}
        };

        /*
        Checks if a specified URL gives a status of 200
         */
        Ledj.urlExists = function (url, callbackSuccess, callbackFail, callbackArg) {
            var http = new XMLHttpRequest();
            http.open('HEAD', url);
            http.onreadystatechange = function () {
                if (this.readyState === this.DONE) {
                    if (this.status === 200) {
                        if (callbackSuccess !== null) {
                            callbackSuccess(callbackArg);
                        } else {
                            return 0;
                        }
                    } else {
                        if (callbackFail !== null) {
                            callbackFail(callbackArg);
                        } else {
                            return -1;
                        }
                    }
                }
            };
            http.send();
        };

        Ledj.reset = function (cacheID) {
            resetElement(Ledj.cache.elementID[cacheID]);
        };

        Ledj.getJSONConfig = function (url, callback) {
            if (typeof url === 'string') {

                // Add date param to force clearing the browser cache
                url += '?dt=' + Date.now();

                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, true);
                xhr.responseType = 'json';
                xhr.onload = function () {
                    var status = xhr.status;
                    if (status === 200) {
                        callback(null, xhr.response);
                    } else {
                        callback(status);
                    }
                };
                xhr.send();
            } else {
                callback('[url] must be a string.');
            }
        };

        Ledj.getHostName = function () {
            return window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
        };

        Ledj.capitalize = function (string) {
            if (typeof string === 'string') {
                return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
            } else {
                return string;
            }
        };

        Ledj.nameToID = function (name) {
            return name.replace(/\\s/g, "-").toLowerCase();
        };

        Ledj.formatDateString = function (dateString, dateFormat) {
            // if the moment library is available, use that to format the string.
            if (!!window.moment) {
                var date = moment(dateString);
                var dateFormat = dateFormat ? dateFormat : Ledj.defaults.dateFormat;
                return date.format(dateFormat);
            } else {
                var d = new Date(dateString);
                return d.getMonth() + 1 + '/' + d.getDate() + '/' + d.getFullYear();
            }
        };

        // Click Event Listener for tag elements (see Ledj.templates.data.tagArray template)
        Ledj.toggleActiveTagsByClassName = function (e) {
            var tagClass = e.target.className.replace('tag', '').replace('active', '').trim();

            if (Ledj.defaults.selectMultipleTags) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = document.getElementsByClassName(tagClass)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var el = _step.value;

                        if (el.className.includes('active')) {
                            el.className = 'tag ' + tagClass;
                        } else {
                            el.className = 'tag active ' + tagClass;
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            } else {
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = document.getElementsByClassName('tag')[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var _el = _step2.value;

                        var classNames = _el.className.split(' ');
                        if (classNames.includes(tagClass) && !classNames.includes('active')) {
                            _el.className = 'tag active ' + tagClass;
                        } else {
                            _el.className = _el.className.replace('active', '').trim();
                        }
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }
            }
        };
        // Adds click event listener for tag elements (see Ledj.templates.data.tagArray template)
        // todo: attach this to the tags' parent div and modify the click event
        Ledj.addTagClickListeners = function () {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = document.getElementsByClassName('tag')[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var el = _step3.value;

                    el.addEventListener("click", Ledj.toggleActiveTagsByClassName);
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }
        };
        // Removes click event listener for tag elements (see Ledj.templates.data.tagArray template)
        // todo: attach this to the tags' parent div and modify the click event
        Ledj.removeTagClickListeners = function () {
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = document.getElementsByClassName('tag')[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var el = _step4.value;

                    el.removeEventListener("click", Ledj.toggleActiveTagsByClassName);
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }
        };

        // todo: make this function more generic somehow ( getHtmlByDataType() )
        Ledj.getCellContent = function (colConfig, colName, itemData) {
            var cell = '';

            itemData[colName] = !!itemData[colName] ? itemData[colName] : '';

            switch (colConfig.type.toLowerCase()) {
                case "url":
                    cell += Ledj.templates.data.url({ 'text': itemData[colName], 'href': itemData[colConfig.href] });
                    break;
                case "image":
                    cell += Ledj.templates.data.image({ 'src': itemData[colConfig.src], 'alt': itemData[colConfig.alt] });
                    break;
                case "date":
                    var dateFormat = colConfig.hasOwnProperty('dateFormat') ? colConfig.dateFormat : null;
                    cell += Ledj.templates.data.date({ 'date': itemData[colName], 'dateFormat': dateFormat });
                    break;
                case "phone":
                    cell += Ledj.templates.data.phone({ 'phone_num': itemData[colName] });
                    break;
                case "code":
                    cell += Ledj.templates.data.code({ 'text': itemData[colName] });
                    break;
                case "tag-array":
                case "tagarray":
                    Ledj.cache.tagTemplateUsed = true; // we're using the tag template, so attach click event listeners
                    cell += Ledj.templates.data.tagArray({ 'tags': itemData[colName] });
                    break;
                case "string":
                default:
                    cell += Ledj.templates.data.string({ 'text': itemData[colName] });
                    break;
            }
            return cell;
        };

        Ledj.getImageUrl = function (imageTitle, cacheID, objectKey) {
            var srcDir = '/';
            var ext = Ledj.cache.jsonConfig[cacheID].hasOwnProperty('imgExt') ? Ledj.cache.jsonConfig[cacheID]['imgExt'] : '';

            if (Ledj.cache.jsonConfig[cacheID].hasOwnProperty('srcDir')) {
                srcDir = Ledj.cache.jsonConfig[cacheID].srcDir;
            } else if (Ledj.cache.jsonConfig[cacheID].hasOwnProperty('srcDirs')) {
                if (!!objectKey && Ledj.cache.jsonConfig[cacheID].srcDirs.hasOwnProperty(objectKey)) {
                    srcDir = Ledj.cache.jsonConfig[cacheID].srcDirs[objectKey];
                } else if (Ledj.cache.jsonConfig[cacheID].srcDirs.hasOwnProperty('Default')) {
                    srcDir = Ledj.cache.jsonConfig[cacheID].srcDirs['Default'];
                } else if (Ledj.cache.jsonConfig[cacheID].srcDirs.hasOwnProperty('default')) {
                    srcDir = Ledj.cache.jsonConfig[cacheID].srcDirs['default'];
                }
            }

            return srcDir + imageTitle + ext;
        };

        Ledj.getAssetUrl = function (assetExt, assetTitle, cacheID, objectKey) {
            var srcDir = '/';
            var ext = Ledj.cache.jsonConfig[cacheID].hasOwnProperty(assetExt) ? Ledj.cache.jsonConfig[cacheID][assetExt] : '';

            if (Ledj.cache.jsonConfig[cacheID].hasOwnProperty('srcDir')) {
                srcDir = Ledj.cache.jsonConfig[cacheID].srcDir;
            } else if (Ledj.cache.jsonConfig[cacheID].hasOwnProperty('srcDirs')) {
                if (!!objectKey && Ledj.cache.jsonConfig[cacheID].srcDirs.hasOwnProperty(objectKey)) {
                    srcDir = Ledj.cache.jsonConfig[cacheID].srcDirs[objectKey];
                } else if (Ledj.cache.jsonConfig[cacheID].srcDirs.hasOwnProperty('Default')) {
                    srcDir = Ledj.cache.jsonConfig[cacheID].srcDirs['Default'];
                } else if (Ledj.cache.jsonConfig[cacheID].srcDirs.hasOwnProperty('default')) {
                    srcDir = Ledj.cache.jsonConfig[cacheID].srcDirs['default'];
                }
            }

            return srcDir + assetTitle + ext;
        };

        /* Private Helper Functions */

        function loadConfigFromUrl(url, callback) {
            Ledj.getJSONConfig(url, function (err, data) {
                if (err === null) {
                    if (data.hasOwnProperty('config') && data.hasOwnProperty('data')) {
                        Ledj.cache.curCacheID = Ledj.cache.jsonConfig.push(data.config) - 1;
                        Ledj.cache.jsonData[Ledj.cache.curCacheID] = data.data;
                        Ledj.cache.jsonUrl[Ledj.cache.curCacheID] = url;

                        callback(Ledj.cache.curCacheID);
                    } else {
                        err = 'JSON data must have `config` and `data` properties.';
                    }
                }

                if (err !== null) {
                    console.warn('Config file "' + url + '" could not be retrieved. ' + err);
                }
            });
        }

        function loadConfigFromObj(data, callback) {
            if (data.hasOwnProperty('config') && data.hasOwnProperty('data')) {
                Ledj.cache.curCacheID = Ledj.cache.jsonConfig.push(data.config) - 1;
                Ledj.cache.jsonData[Ledj.cache.curCacheID] = data.data;

                callback(Ledj.cache.curCacheID);
            } else {
                console.warn('Config object must have `config` and `data` properties.');
            }
        }

        function dataSortCompareHelper(a, b) {
            var propName = Ledj.cache.sortDataBy === '' ? Ledj.defaults.sortDataBy : Ledj.cache.sortDataBy;
            var sortDir = Ledj.cache.sortDataDir === '' ? Ledj.defaults.sortDataDir : Ledj.cache.sortDataDir;

            if (!!a[propName] && !!b[propName] && a[propName] !== b[propName]) {
                // If the value we're sorting by is a string, ignore case
                var propA = typeof a[propName] === 'string' ? a[propName].toLowerCase() : a[propName];
                var propB = typeof b[propName] === 'string' ? b[propName].toLowerCase() : b[propName];

                if (sortDir === 'desc') {
                    return propA > propB ? -1 : 1;
                } else {
                    return propA < propB ? -1 : 1;
                }
            } else {
                return 0;
            }
        }

        function sortData(cacheID) {
            // Figure out what we're sorting the data by
            Ledj.cache.sortDataBy = Ledj.defaults.sortDataBy;
            if (Ledj.cache.jsonConfig[cacheID].hasOwnProperty('sortBy') && typeof Ledj.cache.jsonConfig[cacheID].sortBy === 'string') {
                // If the sortBy property exists and is a string, we'll assume that it's a valid property name.
                // If it's not, the data just won't sort properly ( and shouldn't throw an error, see Ledj.dataSortCompareHelper() ).
                Ledj.cache.sortDataBy = Ledj.cache.jsonConfig[cacheID].sortBy;
            }

            // Figure out what direction we're sorting the data by
            Ledj.cache.sortDataDir = Ledj.defaults.sortDataDir;
            if (Ledj.cache.jsonConfig[cacheID].hasOwnProperty('sortDir')) {
                if (Ledj.cache.jsonConfig[cacheID].sortDir.toLowerCase() === 'asc' || Ledj.cache.jsonConfig[cacheID].sortDir === 0) {
                    Ledj.cache.sortDataDir = 'asc';
                } else if (Ledj.cache.jsonConfig[cacheID].sortDir.toLowerCase() === 'desc' || Ledj.cache.jsonConfig[cacheID].sortDir === 1) {
                    Ledj.cache.sortDataDir = 'desc';
                } else {
                    console.warn('Invalid sort direction "' + Ledj.cache.jsonConfig[cacheID].sortDir + '". Defaulting to "asc (0)".');
                }
            }

            // Sort the data
            if (Ledj.cache.jsonData[cacheID]) {
                if (Array.isArray(Ledj.cache.jsonData[cacheID])) {
                    Ledj.cache.jsonData[cacheID] = Ledj.cache.jsonData[cacheID].sort(dataSortCompareHelper);
                } else if (_typeof(Ledj.cache.jsonData[cacheID]) === 'object') {
                    for (var item in Ledj.cache.jsonData[cacheID]) {
                        Ledj.cache.jsonData[cacheID][item].sort(dataSortCompareHelper);
                    }
                } else {
                    console.warn('Could not sort cache.jsonData[' + cacheID + ']');
                }
            } else {
                console.warn('from Ledj.sortJsonDataBy(): `cache.jsonData[' + cacheID + ']` does not exist.');
            }
        }

        function getLinkGridFromData(cacheID, objectKey) {
            var templateData = {
                'cacheID': cacheID,
                'objectKey': objectKey,
                'itemHrefKey': 'href', // todo set this in json config
                'newTab': true, // todo set this in json config
                'itemImageKey': 'filename', // todo set this in json config
                'itemTitleKey': 'title' // todo set this in json config

            };

            return wrapHtmlInParent(Ledj.templates.linkGrid(templateData), cacheID, objectKey);
        }

        function getTableFromData(cacheID, objectKey) {
            var templateData = {
                'cacheID': cacheID,
                'objectKey': objectKey
            };

            return wrapHtmlInParent(Ledj.templates.table(templateData), cacheID, objectKey);
        }

        function getGifGridFromData(cacheID, objectKey) {
            var templateData = {
                'cacheID': cacheID,
                'objectKey': objectKey
            };

            return wrapHtmlInParent(Ledj.templates.gifGrid(templateData), cacheID, objectKey);
        }

        function wrapHtmlInParent(processedHTML, cacheID, objectKey) {
            return Ledj.templates.parent({
                title: getElementTitle(cacheID, objectKey),
                cacheID: cacheID,
                childHTML: processedHTML
            });
        }

        function addElementsTo(cacheID, elementID) {
            var element = document.getElementById(elementID);

            // Make sure the DOM element exists
            if (!!element) {
                // Store the valid elementID
                Ledj.cache.elementID[cacheID] = elementID;

                var functionToUse = null;

                switch (Ledj.cache.jsonConfig[cacheID].type.toLowerCase()) {
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

                if (!!functionToUse) {
                    var toAppend = '';

                    if (Array.isArray(Ledj.cache.jsonData[cacheID])) {
                        toAppend = functionToUse(cacheID);
                    } else if (_typeof(Ledj.cache.jsonData[cacheID]) === 'object') {
                        for (var item in Ledj.cache.jsonData[cacheID]) {
                            toAppend += functionToUse(cacheID, item);
                        }
                    } else {
                        // todo
                        console.warn('Couldn\'t find a template to use - Ledj shouldn\'t get here');
                    }

                    if (toAppend !== '') {
                        element.innerHTML += toAppend;

                        // Add tag click event listener if tags were attached to the page
                        if (Ledj.cache.tagTemplateUsed) {
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
            if (!!objectKey && objectKey !== '') {
                var titleTag = 'h2';

                if (Ledj.cache.jsonConfig[configID].hasOwnProperty('titleElementLevel') && typeof parseInt(Ledj.cache.jsonConfig[configID].titleElementLevel) === 'number') {
                    titleTag = 'h' + Ledj.cache.jsonConfig[configID].titleElementLevel;
                }

                return '<' + titleTag + ' class="ledj-title">' + objectKey + '</' + titleTag + '>';
            } // else

            return null;
        }

        function resetElement(elementID) {
            try {
                document.getElementById(elementID).innerHTML = '';
            } catch (e) {
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
        Ledj.addTemplate = function (templateName, template) {
            Ledj.templates[templateName] = template;
        };

        /*
        Adds a new data type template for use
         */
        Ledj.addDataTemplate = function (dataType, template) {
            Ledj.templates.data[dataType] = template;
        };

        /*
        Creates new HTML elements from specified JSON data URL
        and attaches them to the specified DOM element.
        This is the primary method for loading data and attaching elements.
         */
        Ledj.loadAndAttachTo = function (jsonUrl, elementID) {
            loadConfigFromUrl(jsonUrl, function (cacheID) {
                sortAndAttachCallback(cacheID, elementID);
            });
        };

        /*
         Creates new HTML elements from specified JSON data object
         and attaches them to the specified DOM element.
         */
        Ledj.loadFromObjAndAttachTo = function (jsonData, elementID) {
            loadConfigFromObj(jsonData, function (cacheID) {
                sortData(cacheID);
                addElementsTo(cacheID, elementID);
            });
        };

        /*
         If the specified cache ID exists, the associated element is cleared,
         the data retrieved again, and the HTML elements re-added to that container.
         */
        Ledj.reloadFromUrlByID = function (cacheID) {
            var numCacheID = parseInt(cacheID);

            if (typeof numCacheID === 'number' && !!this.cache.jsonUrl[numCacheID] && !!this.cache.elementID[numCacheID]) {
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
        Ledj.reloadFromObjByID = function (jsonData, cacheID) {
            var numCacheID = parseInt(cacheID);

            if (typeof numCacheID === 'number' && !!this.cache.elementID[numCacheID]) {
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
        Ledj.reload = Ledj.reloadFromUrlByID;
        // Alias for Ledj.reloadFromObjByID
        Ledj.reloadwith = Ledj.reloadFromObjByID;

        // Final Statement
        return Ledj;
    }

    if (typeof Ledj === 'undefined') {
        //export default 'Ledj';
        window.Ledj = define_ledj();
    } else {
        console.log("Ledj is already defined.");
    }
})(window);

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Ledj.addTemplate('gifGrid', function (data) {
    return '<div class="ledj-gif-grid">\n' + (data.objectKey ? Ledj.cache.jsonData[data.cacheID][data.objectKey] : Ledj.cache.jsonData[data.cacheID]).map(function (dataItem, id) {
        return '<div class="ledj-gif-item" id="ledj-gif-item-' + id + '">\n        <div class="ledj-gif-loading-overlay" id="ledj-gif-loading-overlay-' + id + '"></div>\n        <div class="ledj-gif-content" id="ledj-gif-content-' + id + '">\n            <a class="ledj-gif-title-link" href="' + Ledj.getImageUrl(dataItem.filename, data.cacheID, data.objectKey) + '" target="_blank">' + dataItem.title + '</a>\n            <hr />\n            ' + (Ledj.cache.jsonData.hasOwnProperty('source') ? '<!-- Source: ' + Ledj.cache.jsonData.source + ' -->' : '') + '\n            <div class="ledj-gif-container">\n                <video id="ledj-video-' + id + '" autoplay="true" loop="true">\n                    <source src="' + Ledj.getAssetUrl('vidExt', dataItem.filename, data.cacheID, data.objectKey) + '" type="video/mp4" />\n                    <img src="' + Ledj.getImageUrl(dataItem.filename, data.cacheID, data.objectKey) + '" title="Your browser does not support the <video> tag." />\n                </video>\n            </div>\n        </div>\n    </div>';
    }).join('') + '\n</div>';
});

// todo: split the video element out as a data type.

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Ledj.addTemplate('linkGrid', function (data) {
    return '<div class="ledj-link-grid">\n' + (data.objectKey ? Ledj.cache.jsonData[data.cacheID][data.objectKey] : Ledj.cache.jsonData[data.cacheID]).map(function (dataItem) {
        return '<a class="link-grid-item" href="' + dataItem[data.itemHrefKey] + '"' + (data.newTab ? ' target="_blank"' : '') + '>\n        <img src="' + Ledj.getImageUrl(dataItem[data.itemImageKey], data.cacheID, data.objectKey) + '" title="' + dataItem[data.itemTitleKey] + '" />\n        <span>' + dataItem[data.itemTitleKey] + '</span>\n    </a>';
    }).join('') + '\n</div>';
});

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Ledj.addTemplate('parent', function (data) {
    return '<div class="ledj-container" id="ledj-container-' + data.cacheID + '">\n    ' + (data.title ? data.title : '') + '\n    ' + data.childHTML + '\n</div>';
});

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Ledj.addTemplate('table', function (data) {
    return '<table class="ledj-table">\n    <thead>\n        <tr>\n        ' + Object.keys(Ledj.cache.jsonConfig[data.cacheID].headers).map(function (headerName) {
        return '\n            <th>' + Ledj.cache.jsonConfig[data.cacheID].headers[headerName].name + '</th>\n        ';
    }).join('\n') + '\n        </tr>\n    </thead>\n    <tbody>\n    ' + (data.objectKey ? Ledj.cache.jsonData[data.cacheID][data.objectKey] : Ledj.cache.jsonData[data.cacheID]).map(function (dataItem) {
        return '\n        <tr>\n        ' + Object.keys(Ledj.cache.jsonConfig[data.cacheID].headers).map(function (colName) {
            return '\n            <td>' + Ledj.getCellContent(Ledj.cache.jsonConfig[data.cacheID].headers[colName], colName, dataItem) + '</td>\n        ';
        }).join('\n') + '\n        </tr>\n    ';
    }).join('\n') + '\n    </tbody>\n</table>';
});

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Ledj.addTemplate('todoList', function (data) {
    return '<div class="ledj-todo-list">\n    <code>#todo</code>\n</div>';
});

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Ledj.addDataTemplate('code', function (data) {
    return '<span class="string code"><code>' + data.text + '</code></span>';
});

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Ledj.addDataTemplate('date', function (data) {
  return '<span class="date">' + Ledj.formatDateString(data.date, data.dateFormat) + '</span>';
});

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Ledj.addDataTemplate('image', function (data) {
  return '<img class="image" src="' + Ledj.getImageUrl(data.src, data.cacheID, data.objectKey) + '"' + (data.alt ? ' alt="' + data.alt + '" ' : '') + '/>';
});

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Ledj.addDataTemplate('phone', function (data) {
    return '<span class="phone"><a href="tel:' + data.phone_num + '">' + data.phone_num + '</a></span>';
});

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Ledj.addDataTemplate('string', function (data) {
  return '<span class="string">' + data.text + '</span>';
});

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Ledj.addDataTemplate('tagArray', function (data) {
  return '<div class="tag-container">\n' + data.tags.map(function (tag) {
    return '<span class="tag ' + Ledj.nameToID(tag) + '">' + tag + '</span>';
  }).join('') + '\n</div>';
});

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Ledj.addDataTemplate('url', function (data) {
  return '<a href="' + data.href + '" target="_blank">' + data.text + '</a>';
});

/***/ }),
/* 14 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);
});
//# sourceMappingURL=ledj.js.map