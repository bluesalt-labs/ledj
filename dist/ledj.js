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


var _ledj = __webpack_require__(1);

var _ledj2 = _interopRequireDefault(_ledj);

var _parent = __webpack_require__(2);

var _parent2 = _interopRequireDefault(_parent);

var _linkGrid = __webpack_require__(3);

var _linkGrid2 = _interopRequireDefault(_linkGrid);

var _table = __webpack_require__(4);

var _table2 = _interopRequireDefault(_table);

var _gifGrid = __webpack_require__(5);

var _gifGrid2 = _interopRequireDefault(_gifGrid);

var _todoList = __webpack_require__(6);

var _todoList2 = _interopRequireDefault(_todoList);

var _string = __webpack_require__(7);

var _string2 = _interopRequireDefault(_string);

var _url = __webpack_require__(8);

var _url2 = _interopRequireDefault(_url);

var _image = __webpack_require__(9);

var _image2 = _interopRequireDefault(_image);

var _ledj3 = __webpack_require__(10);

var _ledj4 = _interopRequireDefault(_ledj3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
            curCacheID: -1,
            tagTemplateUsed: false
        };

        // todo: I could set each Ledj.defaults.foo to Ledj.foo and have functions that
        // todo: set the default on init. Then either the loaded config or just Ledj.foo = bar changes the setting.
        Ledj.defaults = {
            sortDataBy: 'title',
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
            return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
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
                return d.getMonth() + '/' + d.getDate() + '/' + d.getFullYear();
            }
        };

        // Click Event Listener for tag elements (see Ledj.templates.data.tagArray template)
        Ledj.toggleActiveTagsByClassName = function (e) {
            var tagClass = e.target.className.replace('tag', '').replace('active', '').trim();

            if (Ledj.defaults.selectMultipleTags) {
                _.map(document.getElementsByClassName(tagClass), function (el) {
                    if (el.className.includes('active')) {
                        el.className = 'tag ' + tagClass;
                    } else {
                        el.className = 'tag active ' + tagClass;
                    }
                });
            } else {
                _.map(document.getElementsByClassName('tag'), function (el) {
                    var classNames = el.className.split(' ');
                    if (classNames.includes(tagClass) && !classNames.includes('active')) {
                        el.className = 'tag active ' + tagClass;
                    } else {
                        el.className = el.className.replace('active', '').trim();
                    }
                });
            }
        };
        // Adds click event listener for tag elements (see Ledj.templates.data.tagArray template)
        // todo: attach this to the tags' parent div and modify the click event
        Ledj.addTagClickListeners = function () {
            _.map(document.getElementsByClassName('tag'), function (el) {
                el.addEventListener("click", Ledj.toggleActiveTagsByClassName);
            });
        };
        // Removes click event listener for tag elements (see Ledj.templates.data.tagArray template)
        // todo: attach this to the tags' parent div and modify the click event
        Ledj.removeTagClickListeners = function () {
            _.map(document.getElementsByClassName('tag'), function (el) {
                el.removeEventListener("click", Ledj.toggleActiveTagsByClassName);
            });
        };

        // todo: make this function more generic somehow ( getHtmlByDataType() )
        Ledj.getCellContent = function (colConfig, colName, itemData) {
            var cell = '';

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
            var ext = Ledj.cache.jsonConfig[cacheID].hasOwnProperty('imgExt') ? Ledj.cache.jsonConfig[cacheID].imgExt : '';

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

        function sortJsonDataBy(cacheID, propName) {
            if (Ledj.cache.jsonData[cacheID]) {
                if (Array.isArray(Ledj.cache.jsonData[cacheID])) {
                    Ledj.cache.jsonData[cacheID] = _.sortBy(Ledj.cache.jsonData[cacheID], typeof propName === 'string' ? propName.toLowerCase() : propName);
                } else if (_typeof(Ledj.cache.jsonData[cacheID]) === 'object') {
                    for (var item in Ledj.cache.jsonData[cacheID]) {
                        Ledj.cache.jsonData[cacheID][item] = _.sortBy(Ledj.cache.jsonData[cacheID][item], typeof propName === 'string' ? propName.toLowerCase() : propName);
                    }
                } else {
                    console.warn('Could not sort cache.jsonData[' + cacheID + ']');
                }
            } else {
                console.warn('from Ledj.sortJsonDataBy(): `cache.jsonData[' + cacheID + ']` does not exist.');
            }
        }

        function sortData(cacheID) {
            sortJsonDataBy(cacheID, Ledj.defaults.sortDataBy);
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


var _templateObject = _taggedTemplateLiteral(["\n<div class=\"ledj-container\" id=\"ledj-container-", "\">\n    ", "\n    ", "\n</div>\n"], ["\n<div class=\"ledj-container\" id=\"ledj-container-", "\">\n    ", "\n    ", "\n</div>\n"]);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

Ledj.templates.parent = html(_templateObject, cacheID, title ? title : "", childHTML);

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _templateObject = _taggedTemplateLiteral(["\n<div class=\"ledj-link-grid\">\n", "\n</div>\n"], ["\n<div class=\"ledj-link-grid\">\n", "\n</div>\n"]),
    _templateObject2 = _taggedTemplateLiteral(["\n    <a class=\"link-grid-item\" href=\"", "\"", "\n        <img src=\"", "\" title=\"", "\" />\n        <span>", "</span>\n    </a>\n"], ["\n    <a class=\"link-grid-item\" href=\"", "\"", "\n        <img src=\"", "\" title=\"", "\" />\n        <span>", "</span>\n    </a>\n"]);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

Ledj.templates.linkGrid = html(_templateObject, (objectKey ? Ledj.cache.jsonData[cacheID][objectKey] : Ledj.cache.jsonData[cacheID]).map(function (dataItem) {
    return html(_templateObject2, dataItem[itemHrefKey], newTab ? " target=\"_blank\"" : "", Ledj.getImageUrl(dataItem[itemImageKey], cacheID, objectKey), dataItem[itemTitleKey], dataItem[itemTitleKey]);
}));

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _templateObject = _taggedTemplateLiteral(["\n<table class=\"ledj-table\">\n    <thead>\n        <tr>\n        ", "\n        </tr>\n    </thead>\n    <tbody>\n    ", "\n    </tbody>\n</table>\n"], ["\n<table class=\"ledj-table\">\n    <thead>\n        <tr>\n        ", "\n        </tr>\n    </thead>\n    <tbody>\n    ", "\n    </tbody>\n</table>\n"]),
    _templateObject2 = _taggedTemplateLiteral(["\n            <th>", "</th>\n        "], ["\n            <th>", "</th>\n        "]),
    _templateObject3 = _taggedTemplateLiteral(["\n        <tr>\n        ", "\n        </tr>\n    "], ["\n        <tr>\n        ", "\n        </tr>\n    "]),
    _templateObject4 = _taggedTemplateLiteral(["\n            <td>", "</td>\n        "], ["\n            <td>", "</td>\n        "]);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

Ledj.templates.table = html(_templateObject, Ledj.cache.jsonConfig[cacheID].headers.map(function (colConfig) {
    return html(_templateObject2, colConfig.name);
}), (objectKey ? Ledj.cache.jsonData[cacheID][objectKey] : Ledj.cache.jsonData[cacheID]).map(function (dataItem) {
    return html(_templateObject3, Ledj.cache.jsonConfig[cacheID].headers.map(function (colConfig, colName) {
        return html(_templateObject4, Ledj.getCellContent(colConfig, colName, dataItem));
    }));
}));

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _templateObject = _taggedTemplateLiteral(["\n<div class=\"ledj-gif-grid\">\n    <code>#todo</code>\n</div>\n"], ["\n<div class=\"ledj-gif-grid\">\n    <code>#todo</code>\n</div>\n"]);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

Ledj.templates.gifGrid = html(_templateObject);

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _templateObject = _taggedTemplateLiteral(["\n<div class=\"ledj-todo-list\">\n    <code>#todo</code>\n</div>\n"], ["\n<div class=\"ledj-todo-list\">\n    <code>#todo</code>\n</div>\n"]);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

Ledj.templates.todoList = html(_templateObject);

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _templateObject = _taggedTemplateLiteral(["\n<span class=\"string\">", "</span>\n"], ["\n<span class=\"string\">", "</span>\n"]);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

Ledj.templates.data.string = html(_templateObject, text);

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _templateObject = _taggedTemplateLiteral(["\n<a href=\"", "\" target=\"_blank\">", "</a>\n"], ["\n<a href=\"", "\" target=\"_blank\">", "</a>\n"]);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

Ledj.templates.data.url = html(_templateObject, href, text);

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _templateObject = _taggedTemplateLiteral(["  \n<img class=\"image\" src=\"", "\"", " />\n"], ["  \n<img class=\"image\" src=\"", "\"", " />\n"]);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

// todo: make this less confusing/weird.
Ledj.templates.data.image = html(_templateObject, Ledj.getImageUrl(src, cacheID, objectKey), alt ? " alt=\"" + alt + "\"" : "");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);
});
//# sourceMappingURL=ledj.js.map