// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/lit-html/lib/directive.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDirective = exports.directive = void 0;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const directives = new WeakMap();
/**
 * Brands a function as a directive factory function so that lit-html will call
 * the function during template rendering, rather than passing as a value.
 *
 * A _directive_ is a function that takes a Part as an argument. It has the
 * signature: `(part: Part) => void`.
 *
 * A directive _factory_ is a function that takes arguments for data and
 * configuration and returns a directive. Users of directive usually refer to
 * the directive factory as the directive. For example, "The repeat directive".
 *
 * Usually a template author will invoke a directive factory in their template
 * with relevant arguments, which will then return a directive function.
 *
 * Here's an example of using the `repeat()` directive factory that takes an
 * array and a function to render an item:
 *
 * ```js
 * html`<ul><${repeat(items, (item) => html`<li>${item}</li>`)}</ul>`
 * ```
 *
 * When `repeat` is invoked, it returns a directive function that closes over
 * `items` and the template function. When the outer template is rendered, the
 * return directive function is called with the Part for the expression.
 * `repeat` then performs it's custom logic to render multiple items.
 *
 * @param f The directive factory function. Must be a function that returns a
 * function of the signature `(part: Part) => void`. The returned function will
 * be called with the part object.
 *
 * @example
 *
 * import {directive, html} from 'lit-html';
 *
 * const immutable = directive((v) => (part) => {
 *   if (part.value !== v) {
 *     part.setValue(v)
 *   }
 * });
 */

const directive = f => (...args) => {
  const d = f(...args);
  directives.set(d, true);
  return d;
};

exports.directive = directive;

const isDirective = o => {
  return typeof o === 'function' && directives.has(o);
};

exports.isDirective = isDirective;
},{}],"../node_modules/lit-html/lib/dom.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeNodes = exports.reparentNodes = exports.isCEPolyfill = void 0;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * True if the custom elements polyfill is in use.
 */
const isCEPolyfill = window.customElements !== undefined && window.customElements.polyfillWrapFlushCallback !== undefined;
/**
 * Reparents nodes, starting from `start` (inclusive) to `end` (exclusive),
 * into another container (could be the same container), before `before`. If
 * `before` is null, it appends the nodes to the container.
 */

exports.isCEPolyfill = isCEPolyfill;

const reparentNodes = (container, start, end = null, before = null) => {
  while (start !== end) {
    const n = start.nextSibling;
    container.insertBefore(start, before);
    start = n;
  }
};
/**
 * Removes nodes, starting from `start` (inclusive) to `end` (exclusive), from
 * `container`.
 */


exports.reparentNodes = reparentNodes;

const removeNodes = (container, start, end = null) => {
  while (start !== end) {
    const n = start.nextSibling;
    container.removeChild(start);
    start = n;
  }
};

exports.removeNodes = removeNodes;
},{}],"../node_modules/lit-html/lib/part.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nothing = exports.noChange = void 0;

/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * A sentinel value that signals that a value was handled by a directive and
 * should not be written to the DOM.
 */
const noChange = {};
/**
 * A sentinel value that signals a NodePart to fully clear its content.
 */

exports.noChange = noChange;
const nothing = {};
exports.nothing = nothing;
},{}],"../node_modules/lit-html/lib/template.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lastAttributeNameRegex = exports.createMarker = exports.isTemplatePartActive = exports.Template = exports.boundAttributeSuffix = exports.markerRegex = exports.nodeMarker = exports.marker = void 0;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * An expression marker with embedded unique key to avoid collision with
 * possible text in templates.
 */
const marker = `{{lit-${String(Math.random()).slice(2)}}}`;
/**
 * An expression marker used text-positions, multi-binding attributes, and
 * attributes with markup-like text values.
 */

exports.marker = marker;
const nodeMarker = `<!--${marker}-->`;
exports.nodeMarker = nodeMarker;
const markerRegex = new RegExp(`${marker}|${nodeMarker}`);
/**
 * Suffix appended to all bound attribute names.
 */

exports.markerRegex = markerRegex;
const boundAttributeSuffix = '$lit$';
/**
 * An updateable Template that tracks the location of dynamic parts.
 */

exports.boundAttributeSuffix = boundAttributeSuffix;

class Template {
  constructor(result, element) {
    this.parts = [];
    this.element = element;
    const nodesToRemove = [];
    const stack = []; // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null

    const walker = document.createTreeWalker(element.content, 133
    /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */
    , null, false); // Keeps track of the last index associated with a part. We try to delete
    // unnecessary nodes, but we never want to associate two different parts
    // to the same index. They must have a constant node between.

    let lastPartIndex = 0;
    let index = -1;
    let partIndex = 0;
    const {
      strings,
      values: {
        length
      }
    } = result;

    while (partIndex < length) {
      const node = walker.nextNode();

      if (node === null) {
        // We've exhausted the content inside a nested template element.
        // Because we still have parts (the outer for-loop), we know:
        // - There is a template in the stack
        // - The walker will find a nextNode outside the template
        walker.currentNode = stack.pop();
        continue;
      }

      index++;

      if (node.nodeType === 1
      /* Node.ELEMENT_NODE */
      ) {
          if (node.hasAttributes()) {
            const attributes = node.attributes;
            const {
              length
            } = attributes; // Per
            // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap,
            // attributes are not guaranteed to be returned in document order.
            // In particular, Edge/IE can return them out of order, so we cannot
            // assume a correspondence between part index and attribute index.

            let count = 0;

            for (let i = 0; i < length; i++) {
              if (endsWith(attributes[i].name, boundAttributeSuffix)) {
                count++;
              }
            }

            while (count-- > 0) {
              // Get the template literal section leading up to the first
              // expression in this attribute
              const stringForPart = strings[partIndex]; // Find the attribute name

              const name = lastAttributeNameRegex.exec(stringForPart)[2]; // Find the corresponding attribute
              // All bound attributes have had a suffix added in
              // TemplateResult#getHTML to opt out of special attribute
              // handling. To look up the attribute value we also need to add
              // the suffix.

              const attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
              const attributeValue = node.getAttribute(attributeLookupName);
              node.removeAttribute(attributeLookupName);
              const statics = attributeValue.split(markerRegex);
              this.parts.push({
                type: 'attribute',
                index,
                name,
                strings: statics
              });
              partIndex += statics.length - 1;
            }
          }

          if (node.tagName === 'TEMPLATE') {
            stack.push(node);
            walker.currentNode = node.content;
          }
        } else if (node.nodeType === 3
      /* Node.TEXT_NODE */
      ) {
          const data = node.data;

          if (data.indexOf(marker) >= 0) {
            const parent = node.parentNode;
            const strings = data.split(markerRegex);
            const lastIndex = strings.length - 1; // Generate a new text node for each literal section
            // These nodes are also used as the markers for node parts

            for (let i = 0; i < lastIndex; i++) {
              let insert;
              let s = strings[i];

              if (s === '') {
                insert = createMarker();
              } else {
                const match = lastAttributeNameRegex.exec(s);

                if (match !== null && endsWith(match[2], boundAttributeSuffix)) {
                  s = s.slice(0, match.index) + match[1] + match[2].slice(0, -boundAttributeSuffix.length) + match[3];
                }

                insert = document.createTextNode(s);
              }

              parent.insertBefore(insert, node);
              this.parts.push({
                type: 'node',
                index: ++index
              });
            } // If there's no text, we must insert a comment to mark our place.
            // Else, we can trust it will stick around after cloning.


            if (strings[lastIndex] === '') {
              parent.insertBefore(createMarker(), node);
              nodesToRemove.push(node);
            } else {
              node.data = strings[lastIndex];
            } // We have a part for each match found


            partIndex += lastIndex;
          }
        } else if (node.nodeType === 8
      /* Node.COMMENT_NODE */
      ) {
          if (node.data === marker) {
            const parent = node.parentNode; // Add a new marker node to be the startNode of the Part if any of
            // the following are true:
            //  * We don't have a previousSibling
            //  * The previousSibling is already the start of a previous part

            if (node.previousSibling === null || index === lastPartIndex) {
              index++;
              parent.insertBefore(createMarker(), node);
            }

            lastPartIndex = index;
            this.parts.push({
              type: 'node',
              index
            }); // If we don't have a nextSibling, keep this node so we have an end.
            // Else, we can remove it to save future costs.

            if (node.nextSibling === null) {
              node.data = '';
            } else {
              nodesToRemove.push(node);
              index--;
            }

            partIndex++;
          } else {
            let i = -1;

            while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
              // Comment node has a binding marker inside, make an inactive part
              // The binding won't work, but subsequent bindings will
              // TODO (justinfagnani): consider whether it's even worth it to
              // make bindings in comments work
              this.parts.push({
                type: 'node',
                index: -1
              });
              partIndex++;
            }
          }
        }
    } // Remove text binding nodes after the walk to not disturb the TreeWalker


    for (const n of nodesToRemove) {
      n.parentNode.removeChild(n);
    }
  }

}

exports.Template = Template;

const endsWith = (str, suffix) => {
  const index = str.length - suffix.length;
  return index >= 0 && str.slice(index) === suffix;
};

const isTemplatePartActive = part => part.index !== -1; // Allows `document.createComment('')` to be renamed for a
// small manual size-savings.


exports.isTemplatePartActive = isTemplatePartActive;

const createMarker = () => document.createComment('');
/**
 * This regex extracts the attribute name preceding an attribute-position
 * expression. It does this by matching the syntax allowed for attributes
 * against the string literal directly preceding the expression, assuming that
 * the expression is in an attribute-value position.
 *
 * See attributes in the HTML spec:
 * https://www.w3.org/TR/html5/syntax.html#elements-attributes
 *
 * " \x09\x0a\x0c\x0d" are HTML space characters:
 * https://www.w3.org/TR/html5/infrastructure.html#space-characters
 *
 * "\0-\x1F\x7F-\x9F" are Unicode control characters, which includes every
 * space character except " ".
 *
 * So an attribute is:
 *  * The name: any character except a control character, space character, ('),
 *    ("), ">", "=", or "/"
 *  * Followed by zero or more space characters
 *  * Followed by "="
 *  * Followed by zero or more space characters
 *  * Followed by:
 *    * Any character except space, ('), ("), "<", ">", "=", (`), or
 *    * (") then any non-("), or
 *    * (') then any non-(')
 */


exports.createMarker = createMarker;
const lastAttributeNameRegex = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
exports.lastAttributeNameRegex = lastAttributeNameRegex;
},{}],"../node_modules/lit-html/lib/template-instance.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TemplateInstance = void 0;

var _dom = require("./dom.js");

var _template = require("./template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * @module lit-html
 */

/**
 * An instance of a `Template` that can be attached to the DOM and updated
 * with new values.
 */
class TemplateInstance {
  constructor(template, processor, options) {
    this.__parts = [];
    this.template = template;
    this.processor = processor;
    this.options = options;
  }

  update(values) {
    let i = 0;

    for (const part of this.__parts) {
      if (part !== undefined) {
        part.setValue(values[i]);
      }

      i++;
    }

    for (const part of this.__parts) {
      if (part !== undefined) {
        part.commit();
      }
    }
  }

  _clone() {
    // There are a number of steps in the lifecycle of a template instance's
    // DOM fragment:
    //  1. Clone - create the instance fragment
    //  2. Adopt - adopt into the main document
    //  3. Process - find part markers and create parts
    //  4. Upgrade - upgrade custom elements
    //  5. Update - set node, attribute, property, etc., values
    //  6. Connect - connect to the document. Optional and outside of this
    //     method.
    //
    // We have a few constraints on the ordering of these steps:
    //  * We need to upgrade before updating, so that property values will pass
    //    through any property setters.
    //  * We would like to process before upgrading so that we're sure that the
    //    cloned fragment is inert and not disturbed by self-modifying DOM.
    //  * We want custom elements to upgrade even in disconnected fragments.
    //
    // Given these constraints, with full custom elements support we would
    // prefer the order: Clone, Process, Adopt, Upgrade, Update, Connect
    //
    // But Safari dooes not implement CustomElementRegistry#upgrade, so we
    // can not implement that order and still have upgrade-before-update and
    // upgrade disconnected fragments. So we instead sacrifice the
    // process-before-upgrade constraint, since in Custom Elements v1 elements
    // must not modify their light DOM in the constructor. We still have issues
    // when co-existing with CEv0 elements like Polymer 1, and with polyfills
    // that don't strictly adhere to the no-modification rule because shadow
    // DOM, which may be created in the constructor, is emulated by being placed
    // in the light DOM.
    //
    // The resulting order is on native is: Clone, Adopt, Upgrade, Process,
    // Update, Connect. document.importNode() performs Clone, Adopt, and Upgrade
    // in one step.
    //
    // The Custom Elements v1 polyfill supports upgrade(), so the order when
    // polyfilled is the more ideal: Clone, Process, Adopt, Upgrade, Update,
    // Connect.
    const fragment = _dom.isCEPolyfill ? this.template.element.content.cloneNode(true) : document.importNode(this.template.element.content, true);
    const stack = [];
    const parts = this.template.parts; // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null

    const walker = document.createTreeWalker(fragment, 133
    /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */
    , null, false);
    let partIndex = 0;
    let nodeIndex = 0;
    let part;
    let node = walker.nextNode(); // Loop through all the nodes and parts of a template

    while (partIndex < parts.length) {
      part = parts[partIndex];

      if (!(0, _template.isTemplatePartActive)(part)) {
        this.__parts.push(undefined);

        partIndex++;
        continue;
      } // Progress the tree walker until we find our next part's node.
      // Note that multiple parts may share the same node (attribute parts
      // on a single element), so this loop may not run at all.


      while (nodeIndex < part.index) {
        nodeIndex++;

        if (node.nodeName === 'TEMPLATE') {
          stack.push(node);
          walker.currentNode = node.content;
        }

        if ((node = walker.nextNode()) === null) {
          // We've exhausted the content inside a nested template element.
          // Because we still have parts (the outer for-loop), we know:
          // - There is a template in the stack
          // - The walker will find a nextNode outside the template
          walker.currentNode = stack.pop();
          node = walker.nextNode();
        }
      } // We've arrived at our part's node.


      if (part.type === 'node') {
        const part = this.processor.handleTextExpression(this.options);
        part.insertAfterNode(node.previousSibling);

        this.__parts.push(part);
      } else {
        this.__parts.push(...this.processor.handleAttributeExpressions(node, part.name, part.strings, this.options));
      }

      partIndex++;
    }

    if (_dom.isCEPolyfill) {
      document.adoptNode(fragment);
      customElements.upgrade(fragment);
    }

    return fragment;
  }

}

exports.TemplateInstance = TemplateInstance;
},{"./dom.js":"../node_modules/lit-html/lib/dom.js","./template.js":"../node_modules/lit-html/lib/template.js"}],"../node_modules/lit-html/lib/template-result.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SVGTemplateResult = exports.TemplateResult = void 0;

var _dom = require("./dom.js");

var _template = require("./template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * @module lit-html
 */
const commentMarker = ` ${_template.marker} `;
/**
 * The return type of `html`, which holds a Template and the values from
 * interpolated expressions.
 */

class TemplateResult {
  constructor(strings, values, type, processor) {
    this.strings = strings;
    this.values = values;
    this.type = type;
    this.processor = processor;
  }
  /**
   * Returns a string of HTML used to create a `<template>` element.
   */


  getHTML() {
    const l = this.strings.length - 1;
    let html = '';
    let isCommentBinding = false;

    for (let i = 0; i < l; i++) {
      const s = this.strings[i]; // For each binding we want to determine the kind of marker to insert
      // into the template source before it's parsed by the browser's HTML
      // parser. The marker type is based on whether the expression is in an
      // attribute, text, or comment poisition.
      //   * For node-position bindings we insert a comment with the marker
      //     sentinel as its text content, like <!--{{lit-guid}}-->.
      //   * For attribute bindings we insert just the marker sentinel for the
      //     first binding, so that we support unquoted attribute bindings.
      //     Subsequent bindings can use a comment marker because multi-binding
      //     attributes must be quoted.
      //   * For comment bindings we insert just the marker sentinel so we don't
      //     close the comment.
      //
      // The following code scans the template source, but is *not* an HTML
      // parser. We don't need to track the tree structure of the HTML, only
      // whether a binding is inside a comment, and if not, if it appears to be
      // the first binding in an attribute.

      const commentOpen = s.lastIndexOf('<!--'); // We're in comment position if we have a comment open with no following
      // comment close. Because <-- can appear in an attribute value there can
      // be false positives.

      isCommentBinding = (commentOpen > -1 || isCommentBinding) && s.indexOf('-->', commentOpen + 1) === -1; // Check to see if we have an attribute-like sequence preceeding the
      // expression. This can match "name=value" like structures in text,
      // comments, and attribute values, so there can be false-positives.

      const attributeMatch = _template.lastAttributeNameRegex.exec(s);

      if (attributeMatch === null) {
        // We're only in this branch if we don't have a attribute-like
        // preceeding sequence. For comments, this guards against unusual
        // attribute values like <div foo="<!--${'bar'}">. Cases like
        // <!-- foo=${'bar'}--> are handled correctly in the attribute branch
        // below.
        html += s + (isCommentBinding ? commentMarker : _template.nodeMarker);
      } else {
        // For attributes we use just a marker sentinel, and also append a
        // $lit$ suffix to the name to opt-out of attribute-specific parsing
        // that IE and Edge do for style and certain SVG attributes.
        html += s.substr(0, attributeMatch.index) + attributeMatch[1] + attributeMatch[2] + _template.boundAttributeSuffix + attributeMatch[3] + _template.marker;
      }
    }

    html += this.strings[l];
    return html;
  }

  getTemplateElement() {
    const template = document.createElement('template');
    template.innerHTML = this.getHTML();
    return template;
  }

}
/**
 * A TemplateResult for SVG fragments.
 *
 * This class wraps HTML in an `<svg>` tag in order to parse its contents in the
 * SVG namespace, then modifies the template to remove the `<svg>` tag so that
 * clones only container the original fragment.
 */


exports.TemplateResult = TemplateResult;

class SVGTemplateResult extends TemplateResult {
  getHTML() {
    return `<svg>${super.getHTML()}</svg>`;
  }

  getTemplateElement() {
    const template = super.getTemplateElement();
    const content = template.content;
    const svgElement = content.firstChild;
    content.removeChild(svgElement);
    (0, _dom.reparentNodes)(content, svgElement.firstChild);
    return template;
  }

}

exports.SVGTemplateResult = SVGTemplateResult;
},{"./dom.js":"../node_modules/lit-html/lib/dom.js","./template.js":"../node_modules/lit-html/lib/template.js"}],"../node_modules/lit-html/lib/parts.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventPart = exports.PropertyPart = exports.PropertyCommitter = exports.BooleanAttributePart = exports.NodePart = exports.AttributePart = exports.AttributeCommitter = exports.isIterable = exports.isPrimitive = void 0;

var _directive = require("./directive.js");

var _dom = require("./dom.js");

var _part = require("./part.js");

var _templateInstance = require("./template-instance.js");

var _templateResult = require("./template-result.js");

var _template = require("./template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * @module lit-html
 */
const isPrimitive = value => {
  return value === null || !(typeof value === 'object' || typeof value === 'function');
};

exports.isPrimitive = isPrimitive;

const isIterable = value => {
  return Array.isArray(value) || // tslint:disable-next-line:no-any
  !!(value && value[Symbol.iterator]);
};
/**
 * Writes attribute values to the DOM for a group of AttributeParts bound to a
 * single attibute. The value is only set once even if there are multiple parts
 * for an attribute.
 */


exports.isIterable = isIterable;

class AttributeCommitter {
  constructor(element, name, strings) {
    this.dirty = true;
    this.element = element;
    this.name = name;
    this.strings = strings;
    this.parts = [];

    for (let i = 0; i < strings.length - 1; i++) {
      this.parts[i] = this._createPart();
    }
  }
  /**
   * Creates a single part. Override this to create a differnt type of part.
   */


  _createPart() {
    return new AttributePart(this);
  }

  _getValue() {
    const strings = this.strings;
    const l = strings.length - 1;
    let text = '';

    for (let i = 0; i < l; i++) {
      text += strings[i];
      const part = this.parts[i];

      if (part !== undefined) {
        const v = part.value;

        if (isPrimitive(v) || !isIterable(v)) {
          text += typeof v === 'string' ? v : String(v);
        } else {
          for (const t of v) {
            text += typeof t === 'string' ? t : String(t);
          }
        }
      }
    }

    text += strings[l];
    return text;
  }

  commit() {
    if (this.dirty) {
      this.dirty = false;
      this.element.setAttribute(this.name, this._getValue());
    }
  }

}
/**
 * A Part that controls all or part of an attribute value.
 */


exports.AttributeCommitter = AttributeCommitter;

class AttributePart {
  constructor(committer) {
    this.value = undefined;
    this.committer = committer;
  }

  setValue(value) {
    if (value !== _part.noChange && (!isPrimitive(value) || value !== this.value)) {
      this.value = value; // If the value is a not a directive, dirty the committer so that it'll
      // call setAttribute. If the value is a directive, it'll dirty the
      // committer if it calls setValue().

      if (!(0, _directive.isDirective)(value)) {
        this.committer.dirty = true;
      }
    }
  }

  commit() {
    while ((0, _directive.isDirective)(this.value)) {
      const directive = this.value;
      this.value = _part.noChange;
      directive(this);
    }

    if (this.value === _part.noChange) {
      return;
    }

    this.committer.commit();
  }

}
/**
 * A Part that controls a location within a Node tree. Like a Range, NodePart
 * has start and end locations and can set and update the Nodes between those
 * locations.
 *
 * NodeParts support several value types: primitives, Nodes, TemplateResults,
 * as well as arrays and iterables of those types.
 */


exports.AttributePart = AttributePart;

class NodePart {
  constructor(options) {
    this.value = undefined;
    this.__pendingValue = undefined;
    this.options = options;
  }
  /**
   * Appends this part into a container.
   *
   * This part must be empty, as its contents are not automatically moved.
   */


  appendInto(container) {
    this.startNode = container.appendChild((0, _template.createMarker)());
    this.endNode = container.appendChild((0, _template.createMarker)());
  }
  /**
   * Inserts this part after the `ref` node (between `ref` and `ref`'s next
   * sibling). Both `ref` and its next sibling must be static, unchanging nodes
   * such as those that appear in a literal section of a template.
   *
   * This part must be empty, as its contents are not automatically moved.
   */


  insertAfterNode(ref) {
    this.startNode = ref;
    this.endNode = ref.nextSibling;
  }
  /**
   * Appends this part into a parent part.
   *
   * This part must be empty, as its contents are not automatically moved.
   */


  appendIntoPart(part) {
    part.__insert(this.startNode = (0, _template.createMarker)());

    part.__insert(this.endNode = (0, _template.createMarker)());
  }
  /**
   * Inserts this part after the `ref` part.
   *
   * This part must be empty, as its contents are not automatically moved.
   */


  insertAfterPart(ref) {
    ref.__insert(this.startNode = (0, _template.createMarker)());

    this.endNode = ref.endNode;
    ref.endNode = this.startNode;
  }

  setValue(value) {
    this.__pendingValue = value;
  }

  commit() {
    while ((0, _directive.isDirective)(this.__pendingValue)) {
      const directive = this.__pendingValue;
      this.__pendingValue = _part.noChange;
      directive(this);
    }

    const value = this.__pendingValue;

    if (value === _part.noChange) {
      return;
    }

    if (isPrimitive(value)) {
      if (value !== this.value) {
        this.__commitText(value);
      }
    } else if (value instanceof _templateResult.TemplateResult) {
      this.__commitTemplateResult(value);
    } else if (value instanceof Node) {
      this.__commitNode(value);
    } else if (isIterable(value)) {
      this.__commitIterable(value);
    } else if (value === _part.nothing) {
      this.value = _part.nothing;
      this.clear();
    } else {
      // Fallback, will render the string representation
      this.__commitText(value);
    }
  }

  __insert(node) {
    this.endNode.parentNode.insertBefore(node, this.endNode);
  }

  __commitNode(value) {
    if (this.value === value) {
      return;
    }

    this.clear();

    this.__insert(value);

    this.value = value;
  }

  __commitText(value) {
    const node = this.startNode.nextSibling;
    value = value == null ? '' : value; // If `value` isn't already a string, we explicitly convert it here in case
    // it can't be implicitly converted - i.e. it's a symbol.

    const valueAsString = typeof value === 'string' ? value : String(value);

    if (node === this.endNode.previousSibling && node.nodeType === 3
    /* Node.TEXT_NODE */
    ) {
        // If we only have a single text node between the markers, we can just
        // set its value, rather than replacing it.
        // TODO(justinfagnani): Can we just check if this.value is primitive?
        node.data = valueAsString;
      } else {
      this.__commitNode(document.createTextNode(valueAsString));
    }

    this.value = value;
  }

  __commitTemplateResult(value) {
    const template = this.options.templateFactory(value);

    if (this.value instanceof _templateInstance.TemplateInstance && this.value.template === template) {
      this.value.update(value.values);
    } else {
      // Make sure we propagate the template processor from the TemplateResult
      // so that we use its syntax extension, etc. The template factory comes
      // from the render function options so that it can control template
      // caching and preprocessing.
      const instance = new _templateInstance.TemplateInstance(template, value.processor, this.options);

      const fragment = instance._clone();

      instance.update(value.values);

      this.__commitNode(fragment);

      this.value = instance;
    }
  }

  __commitIterable(value) {
    // For an Iterable, we create a new InstancePart per item, then set its
    // value to the item. This is a little bit of overhead for every item in
    // an Iterable, but it lets us recurse easily and efficiently update Arrays
    // of TemplateResults that will be commonly returned from expressions like:
    // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
    // If _value is an array, then the previous render was of an
    // iterable and _value will contain the NodeParts from the previous
    // render. If _value is not an array, clear this part and make a new
    // array for NodeParts.
    if (!Array.isArray(this.value)) {
      this.value = [];
      this.clear();
    } // Lets us keep track of how many items we stamped so we can clear leftover
    // items from a previous render


    const itemParts = this.value;
    let partIndex = 0;
    let itemPart;

    for (const item of value) {
      // Try to reuse an existing part
      itemPart = itemParts[partIndex]; // If no existing part, create a new one

      if (itemPart === undefined) {
        itemPart = new NodePart(this.options);
        itemParts.push(itemPart);

        if (partIndex === 0) {
          itemPart.appendIntoPart(this);
        } else {
          itemPart.insertAfterPart(itemParts[partIndex - 1]);
        }
      }

      itemPart.setValue(item);
      itemPart.commit();
      partIndex++;
    }

    if (partIndex < itemParts.length) {
      // Truncate the parts array so _value reflects the current state
      itemParts.length = partIndex;
      this.clear(itemPart && itemPart.endNode);
    }
  }

  clear(startNode = this.startNode) {
    (0, _dom.removeNodes)(this.startNode.parentNode, startNode.nextSibling, this.endNode);
  }

}
/**
 * Implements a boolean attribute, roughly as defined in the HTML
 * specification.
 *
 * If the value is truthy, then the attribute is present with a value of
 * ''. If the value is falsey, the attribute is removed.
 */


exports.NodePart = NodePart;

class BooleanAttributePart {
  constructor(element, name, strings) {
    this.value = undefined;
    this.__pendingValue = undefined;

    if (strings.length !== 2 || strings[0] !== '' || strings[1] !== '') {
      throw new Error('Boolean attributes can only contain a single expression');
    }

    this.element = element;
    this.name = name;
    this.strings = strings;
  }

  setValue(value) {
    this.__pendingValue = value;
  }

  commit() {
    while ((0, _directive.isDirective)(this.__pendingValue)) {
      const directive = this.__pendingValue;
      this.__pendingValue = _part.noChange;
      directive(this);
    }

    if (this.__pendingValue === _part.noChange) {
      return;
    }

    const value = !!this.__pendingValue;

    if (this.value !== value) {
      if (value) {
        this.element.setAttribute(this.name, '');
      } else {
        this.element.removeAttribute(this.name);
      }

      this.value = value;
    }

    this.__pendingValue = _part.noChange;
  }

}
/**
 * Sets attribute values for PropertyParts, so that the value is only set once
 * even if there are multiple parts for a property.
 *
 * If an expression controls the whole property value, then the value is simply
 * assigned to the property under control. If there are string literals or
 * multiple expressions, then the strings are expressions are interpolated into
 * a string first.
 */


exports.BooleanAttributePart = BooleanAttributePart;

class PropertyCommitter extends AttributeCommitter {
  constructor(element, name, strings) {
    super(element, name, strings);
    this.single = strings.length === 2 && strings[0] === '' && strings[1] === '';
  }

  _createPart() {
    return new PropertyPart(this);
  }

  _getValue() {
    if (this.single) {
      return this.parts[0].value;
    }

    return super._getValue();
  }

  commit() {
    if (this.dirty) {
      this.dirty = false; // tslint:disable-next-line:no-any

      this.element[this.name] = this._getValue();
    }
  }

}

exports.PropertyCommitter = PropertyCommitter;

class PropertyPart extends AttributePart {} // Detect event listener options support. If the `capture` property is read
// from the options object, then options are supported. If not, then the thrid
// argument to add/removeEventListener is interpreted as the boolean capture
// value so we should only pass the `capture` property.


exports.PropertyPart = PropertyPart;
let eventOptionsSupported = false;

try {
  const options = {
    get capture() {
      eventOptionsSupported = true;
      return false;
    }

  }; // tslint:disable-next-line:no-any

  window.addEventListener('test', options, options); // tslint:disable-next-line:no-any

  window.removeEventListener('test', options, options);
} catch (_e) {}

class EventPart {
  constructor(element, eventName, eventContext) {
    this.value = undefined;
    this.__pendingValue = undefined;
    this.element = element;
    this.eventName = eventName;
    this.eventContext = eventContext;

    this.__boundHandleEvent = e => this.handleEvent(e);
  }

  setValue(value) {
    this.__pendingValue = value;
  }

  commit() {
    while ((0, _directive.isDirective)(this.__pendingValue)) {
      const directive = this.__pendingValue;
      this.__pendingValue = _part.noChange;
      directive(this);
    }

    if (this.__pendingValue === _part.noChange) {
      return;
    }

    const newListener = this.__pendingValue;
    const oldListener = this.value;
    const shouldRemoveListener = newListener == null || oldListener != null && (newListener.capture !== oldListener.capture || newListener.once !== oldListener.once || newListener.passive !== oldListener.passive);
    const shouldAddListener = newListener != null && (oldListener == null || shouldRemoveListener);

    if (shouldRemoveListener) {
      this.element.removeEventListener(this.eventName, this.__boundHandleEvent, this.__options);
    }

    if (shouldAddListener) {
      this.__options = getOptions(newListener);
      this.element.addEventListener(this.eventName, this.__boundHandleEvent, this.__options);
    }

    this.value = newListener;
    this.__pendingValue = _part.noChange;
  }

  handleEvent(event) {
    if (typeof this.value === 'function') {
      this.value.call(this.eventContext || this.element, event);
    } else {
      this.value.handleEvent(event);
    }
  }

} // We copy options because of the inconsistent behavior of browsers when reading
// the third argument of add/removeEventListener. IE11 doesn't support options
// at all. Chrome 41 only reads `capture` if the argument is an object.


exports.EventPart = EventPart;

const getOptions = o => o && (eventOptionsSupported ? {
  capture: o.capture,
  passive: o.passive,
  once: o.once
} : o.capture);
},{"./directive.js":"../node_modules/lit-html/lib/directive.js","./dom.js":"../node_modules/lit-html/lib/dom.js","./part.js":"../node_modules/lit-html/lib/part.js","./template-instance.js":"../node_modules/lit-html/lib/template-instance.js","./template-result.js":"../node_modules/lit-html/lib/template-result.js","./template.js":"../node_modules/lit-html/lib/template.js"}],"../node_modules/lit-html/lib/default-template-processor.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultTemplateProcessor = exports.DefaultTemplateProcessor = void 0;

var _parts = require("./parts.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * Creates Parts when a template is instantiated.
 */
class DefaultTemplateProcessor {
  /**
   * Create parts for an attribute-position binding, given the event, attribute
   * name, and string literals.
   *
   * @param element The element containing the binding
   * @param name  The attribute name
   * @param strings The string literals. There are always at least two strings,
   *   event for fully-controlled bindings with a single expression.
   */
  handleAttributeExpressions(element, name, strings, options) {
    const prefix = name[0];

    if (prefix === '.') {
      const committer = new _parts.PropertyCommitter(element, name.slice(1), strings);
      return committer.parts;
    }

    if (prefix === '@') {
      return [new _parts.EventPart(element, name.slice(1), options.eventContext)];
    }

    if (prefix === '?') {
      return [new _parts.BooleanAttributePart(element, name.slice(1), strings)];
    }

    const committer = new _parts.AttributeCommitter(element, name, strings);
    return committer.parts;
  }
  /**
   * Create parts for a text-position binding.
   * @param templateFactory
   */


  handleTextExpression(options) {
    return new _parts.NodePart(options);
  }

}

exports.DefaultTemplateProcessor = DefaultTemplateProcessor;
const defaultTemplateProcessor = new DefaultTemplateProcessor();
exports.defaultTemplateProcessor = defaultTemplateProcessor;
},{"./parts.js":"../node_modules/lit-html/lib/parts.js"}],"../node_modules/lit-html/lib/template-factory.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templateFactory = templateFactory;
exports.templateCaches = void 0;

var _template = require("./template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * The default TemplateFactory which caches Templates keyed on
 * result.type and result.strings.
 */
function templateFactory(result) {
  let templateCache = templateCaches.get(result.type);

  if (templateCache === undefined) {
    templateCache = {
      stringsArray: new WeakMap(),
      keyString: new Map()
    };
    templateCaches.set(result.type, templateCache);
  }

  let template = templateCache.stringsArray.get(result.strings);

  if (template !== undefined) {
    return template;
  } // If the TemplateStringsArray is new, generate a key from the strings
  // This key is shared between all templates with identical content


  const key = result.strings.join(_template.marker); // Check if we already have a Template for this key

  template = templateCache.keyString.get(key);

  if (template === undefined) {
    // If we have not seen this key before, create a new Template
    template = new _template.Template(result, result.getTemplateElement()); // Cache the Template for this key

    templateCache.keyString.set(key, template);
  } // Cache all future queries for this TemplateStringsArray


  templateCache.stringsArray.set(result.strings, template);
  return template;
}

const templateCaches = new Map();
exports.templateCaches = templateCaches;
},{"./template.js":"../node_modules/lit-html/lib/template.js"}],"../node_modules/lit-html/lib/render.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = exports.parts = void 0;

var _dom = require("./dom.js");

var _parts = require("./parts.js");

var _templateFactory = require("./template-factory.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * @module lit-html
 */
const parts = new WeakMap();
/**
 * Renders a template result or other value to a container.
 *
 * To update a container with new values, reevaluate the template literal and
 * call `render` with the new result.
 *
 * @param result Any value renderable by NodePart - typically a TemplateResult
 *     created by evaluating a template tag like `html` or `svg`.
 * @param container A DOM parent to render to. The entire contents are either
 *     replaced, or efficiently updated if the same result type was previous
 *     rendered there.
 * @param options RenderOptions for the entire render tree rendered to this
 *     container. Render options must *not* change between renders to the same
 *     container, as those changes will not effect previously rendered DOM.
 */

exports.parts = parts;

const render = (result, container, options) => {
  let part = parts.get(container);

  if (part === undefined) {
    (0, _dom.removeNodes)(container, container.firstChild);
    parts.set(container, part = new _parts.NodePart(Object.assign({
      templateFactory: _templateFactory.templateFactory
    }, options)));
    part.appendInto(container);
  }

  part.setValue(result);
  part.commit();
};

exports.render = render;
},{"./dom.js":"../node_modules/lit-html/lib/dom.js","./parts.js":"../node_modules/lit-html/lib/parts.js","./template-factory.js":"../node_modules/lit-html/lib/template-factory.js"}],"../node_modules/lit-html/lit-html.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "DefaultTemplateProcessor", {
  enumerable: true,
  get: function () {
    return _defaultTemplateProcessor.DefaultTemplateProcessor;
  }
});
Object.defineProperty(exports, "defaultTemplateProcessor", {
  enumerable: true,
  get: function () {
    return _defaultTemplateProcessor.defaultTemplateProcessor;
  }
});
Object.defineProperty(exports, "SVGTemplateResult", {
  enumerable: true,
  get: function () {
    return _templateResult.SVGTemplateResult;
  }
});
Object.defineProperty(exports, "TemplateResult", {
  enumerable: true,
  get: function () {
    return _templateResult.TemplateResult;
  }
});
Object.defineProperty(exports, "directive", {
  enumerable: true,
  get: function () {
    return _directive.directive;
  }
});
Object.defineProperty(exports, "isDirective", {
  enumerable: true,
  get: function () {
    return _directive.isDirective;
  }
});
Object.defineProperty(exports, "removeNodes", {
  enumerable: true,
  get: function () {
    return _dom.removeNodes;
  }
});
Object.defineProperty(exports, "reparentNodes", {
  enumerable: true,
  get: function () {
    return _dom.reparentNodes;
  }
});
Object.defineProperty(exports, "noChange", {
  enumerable: true,
  get: function () {
    return _part.noChange;
  }
});
Object.defineProperty(exports, "nothing", {
  enumerable: true,
  get: function () {
    return _part.nothing;
  }
});
Object.defineProperty(exports, "AttributeCommitter", {
  enumerable: true,
  get: function () {
    return _parts.AttributeCommitter;
  }
});
Object.defineProperty(exports, "AttributePart", {
  enumerable: true,
  get: function () {
    return _parts.AttributePart;
  }
});
Object.defineProperty(exports, "BooleanAttributePart", {
  enumerable: true,
  get: function () {
    return _parts.BooleanAttributePart;
  }
});
Object.defineProperty(exports, "EventPart", {
  enumerable: true,
  get: function () {
    return _parts.EventPart;
  }
});
Object.defineProperty(exports, "isIterable", {
  enumerable: true,
  get: function () {
    return _parts.isIterable;
  }
});
Object.defineProperty(exports, "isPrimitive", {
  enumerable: true,
  get: function () {
    return _parts.isPrimitive;
  }
});
Object.defineProperty(exports, "NodePart", {
  enumerable: true,
  get: function () {
    return _parts.NodePart;
  }
});
Object.defineProperty(exports, "PropertyCommitter", {
  enumerable: true,
  get: function () {
    return _parts.PropertyCommitter;
  }
});
Object.defineProperty(exports, "PropertyPart", {
  enumerable: true,
  get: function () {
    return _parts.PropertyPart;
  }
});
Object.defineProperty(exports, "parts", {
  enumerable: true,
  get: function () {
    return _render.parts;
  }
});
Object.defineProperty(exports, "render", {
  enumerable: true,
  get: function () {
    return _render.render;
  }
});
Object.defineProperty(exports, "templateCaches", {
  enumerable: true,
  get: function () {
    return _templateFactory.templateCaches;
  }
});
Object.defineProperty(exports, "templateFactory", {
  enumerable: true,
  get: function () {
    return _templateFactory.templateFactory;
  }
});
Object.defineProperty(exports, "TemplateInstance", {
  enumerable: true,
  get: function () {
    return _templateInstance.TemplateInstance;
  }
});
Object.defineProperty(exports, "createMarker", {
  enumerable: true,
  get: function () {
    return _template.createMarker;
  }
});
Object.defineProperty(exports, "isTemplatePartActive", {
  enumerable: true,
  get: function () {
    return _template.isTemplatePartActive;
  }
});
Object.defineProperty(exports, "Template", {
  enumerable: true,
  get: function () {
    return _template.Template;
  }
});
exports.svg = exports.html = void 0;

var _defaultTemplateProcessor = require("./lib/default-template-processor.js");

var _templateResult = require("./lib/template-result.js");

var _directive = require("./lib/directive.js");

var _dom = require("./lib/dom.js");

var _part = require("./lib/part.js");

var _parts = require("./lib/parts.js");

var _render = require("./lib/render.js");

var _templateFactory = require("./lib/template-factory.js");

var _templateInstance = require("./lib/template-instance.js");

var _template = require("./lib/template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 *
 * Main lit-html module.
 *
 * Main exports:
 *
 * -  [[html]]
 * -  [[svg]]
 * -  [[render]]
 *
 * @module lit-html
 * @preferred
 */

/**
 * Do not remove this comment; it keeps typedoc from misplacing the module
 * docs.
 */
// TODO(justinfagnani): remove line when we get NodePart moving methods
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for lit-html usage.
// TODO(justinfagnani): inject version number at build time
(window['litHtmlVersions'] || (window['litHtmlVersions'] = [])).push('1.1.2');
/**
 * Interprets a template literal as an HTML template that can efficiently
 * render to and update a container.
 */

const html = (strings, ...values) => new _templateResult.TemplateResult(strings, values, 'html', _defaultTemplateProcessor.defaultTemplateProcessor);
/**
 * Interprets a template literal as an SVG template that can efficiently
 * render to and update a container.
 */


exports.html = html;

const svg = (strings, ...values) => new _templateResult.SVGTemplateResult(strings, values, 'svg', _defaultTemplateProcessor.defaultTemplateProcessor);

exports.svg = svg;
},{"./lib/default-template-processor.js":"../node_modules/lit-html/lib/default-template-processor.js","./lib/template-result.js":"../node_modules/lit-html/lib/template-result.js","./lib/directive.js":"../node_modules/lit-html/lib/directive.js","./lib/dom.js":"../node_modules/lit-html/lib/dom.js","./lib/part.js":"../node_modules/lit-html/lib/part.js","./lib/parts.js":"../node_modules/lit-html/lib/parts.js","./lib/render.js":"../node_modules/lit-html/lib/render.js","./lib/template-factory.js":"../node_modules/lit-html/lib/template-factory.js","./lib/template-instance.js":"../node_modules/lit-html/lib/template-instance.js","./lib/template.js":"../node_modules/lit-html/lib/template.js"}],"app/lib/message.ts":[function(require,module,exports) {
"use strict"; // This function receives a message name and a piece of data
// It triggers an event with that name and attaches the data
// This is meant to be used to do any action in the template
// by sending a message inside an HTML event attribute

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.send = function (msg, data) {
  return document.dispatchEvent(new CustomEvent(msg, {
    detail: data || {}
  }));
};
},{}],"app/templates/components/ad-publisher.ts":[function(require,module,exports) {
"use strict";

var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", {
      value: raw
    });
  } else {
    cooked.raw = raw;
  }

  return cooked;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var lit_html_1 = require("lit-html");

var message_1 = require("../../lib/message");

exports.AdPublisher = function (newAd) {
  return lit_html_1.html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    <form>\n      <grid>\n        <column size=\"6\">\n          <p>\n            <label>Select a video:\n              <input type=\"file\" required @change=", ">\n            </label>\n          </p>\n          <p>\n            <label>Banner:\n              <input type=\"file\" required @change=", ">\n            </label>\n          </p>\n          <p>\n            <label>Starts at (seconds):\n              <input type=\"text\" value=", " required @input=", ">\n            </label>\n          </p>\n        </column>\n        <column size=\"6\">\n          <p>\n            <label>Logo:\n              <input type=\"file\" required @change=", ">\n            </label>\n          </p>\n          <p>\n            <label>Minimum Width:\n              <input type=\"text\" value=", " required @input=", ">\n            </label>\n          </p>\n          <p>\n            <label>Minimum Height:\n              <input type=\"text\" value=", " required @input=", ">\n            </label>\n          </p>\n          <p>\n            <label>\n              <input type=\"checkbox\" ?checked=", " @click=", "> <span>Can be skipped</span>\n            </label>\n          </p>\n        </column>\n      </grid>\n      <p>\n        <label>Type of ad:\n          <select @change=", ">\n            <option value=\"multiple\">Multiple options</option>\n            <option value=\"survey\">Survey</option>\n            <option value=\"truefalse\">True/False</option>\n          </select>\n        </label>\n      </p>\n\n      <p>\n        <label>Question:\n          <input type=\"text\" value=", " required @input=", ">\n        </label>\n      </p>\n\n\n      <fieldset style=", ">\n        <p>\n          <label>Option #1\n            <input type=\"text\" value=", " required @input=", ">\n          </label>\n        </p>\n        <p>\n          <label>Option #2\n            <input type=\"text\" value=", " required @input=", ">\n          </label>\n        </p>\n        <p>\n          <label>Option #3\n            <input type=\"text\" value=", " @input=", ">\n          </label>\n        </p>\n        <p>\n          <label>Option #4\n            <input type=\"text\" value=", " @input=", ">\n          </label>\n        </p>\n      </fieldset>\n      <p style=", ">\n        <label><span>Select correct answer:</span>\n          <select @change=", ">\n            <option value=\"1\" ?selected=", ">Option #1</option>\n            <option value=\"2\" ?selected=", ">Option #2</option>\n            <option value=\"3\" ?selected=", ">Option #3</option>\n            <option value=\"4\" ?selected=", ">Option #4</option>\n          </select>\n        </label>\n      </p>\n    </form>\n  "], ["\n    <form>\n      <grid>\n        <column size=\"6\">\n          <p>\n            <label>Select a video:\n              <input type=\"file\" required @change=", ">\n            </label>\n          </p>\n          <p>\n            <label>Banner:\n              <input type=\"file\" required @change=", ">\n            </label>\n          </p>\n          <p>\n            <label>Starts at (seconds):\n              <input type=\"text\" value=", " required @input=", ">\n            </label>\n          </p>\n        </column>\n        <column size=\"6\">\n          <p>\n            <label>Logo:\n              <input type=\"file\" required @change=", ">\n            </label>\n          </p>\n          <p>\n            <label>Minimum Width:\n              <input type=\"text\" value=", " required @input=", ">\n            </label>\n          </p>\n          <p>\n            <label>Minimum Height:\n              <input type=\"text\" value=", " required @input=", ">\n            </label>\n          </p>\n          <p>\n            <label>\n              <input type=\"checkbox\" ?checked=", " @click=", "> <span>Can be skipped</span>\n            </label>\n          </p>\n        </column>\n      </grid>\n      <p>\n        <label>Type of ad:\n          <select @change=", ">\n            <option value=\"multiple\">Multiple options</option>\n            <option value=\"survey\">Survey</option>\n            <option value=\"truefalse\">True/False</option>\n          </select>\n        </label>\n      </p>\n\n      <p>\n        <label>Question:\n          <input type=\"text\" value=", " required @input=", ">\n        </label>\n      </p>\n\n\n      <fieldset style=", ">\n        <p>\n          <label>Option #1\n            <input type=\"text\" value=", " required @input=", ">\n          </label>\n        </p>\n        <p>\n          <label>Option #2\n            <input type=\"text\" value=", " required @input=", ">\n          </label>\n        </p>\n        <p>\n          <label>Option #3\n            <input type=\"text\" value=", " @input=", ">\n          </label>\n        </p>\n        <p>\n          <label>Option #4\n            <input type=\"text\" value=", " @input=", ">\n          </label>\n        </p>\n      </fieldset>\n      <p style=", ">\n        <label><span>Select correct answer:</span>\n          <select @change=", ">\n            <option value=\"1\" ?selected=", ">Option #1</option>\n            <option value=\"2\" ?selected=", ">Option #2</option>\n            <option value=\"3\" ?selected=", ">Option #3</option>\n            <option value=\"4\" ?selected=", ">Option #4</option>\n          </select>\n        </label>\n      </p>\n    </form>\n  "])), function () {
    message_1.send('uploadNewAdFile', {
      name: 'video',
      content: this.files[0]
    });
  }, function () {
    message_1.send('uploadNewAdFile', {
      name: 'banner',
      content: this.files[0]
    });
  }, newAd.startsAt, function () {
    message_1.send('newAdField', {
      field: 'startsAt',
      value: this.value
    });
  }, function () {
    message_1.send('uploadNewAdFile', {
      name: 'logo',
      content: this.files[0]
    });
  }, newAd.minWidth, function () {
    message_1.send('newAdField', {
      field: 'minWidth',
      value: this.value
    });
  }, newAd.minHeight, function () {
    message_1.send('newAdField', {
      field: 'minHeight',
      value: this.value
    });
  }, newAd.canSkip, function () {
    message_1.send('newAdField', {
      field: 'canSkip',
      value: this.checked
    });
  }, function () {
    message_1.send('newAdField', {
      field: 'type',
      value: this.options[this.selectedIndex].value
    });
  }, newAd.question, function () {
    message_1.send('newAdField', {
      field: 'question',
      value: this.value
    });
  }, newAd.type === 'truefalse' ? 'display:none' : 'display:block', newAd.options[1] || '', function () {
    message_1.send('newAdFieldOption', {
      field: 1,
      value: this.value
    });
  }, newAd.options[2] || '', function () {
    message_1.send('newAdFieldOption', {
      field: 2,
      value: this.value
    });
  }, newAd.options[3] || '', function () {
    message_1.send('newAdFieldOption', {
      field: 3,
      value: this.value
    });
  }, newAd.options[4] || '', function () {
    message_1.send('newAdFieldOption', {
      field: 4,
      value: this.value
    });
  }, newAd.type === 'truefalse' || newAd.type === 'survey' ? 'display:none' : 'display:block', function () {
    message_1.send('newAdField', {
      field: 'correctAnswer',
      value: this.options[this.selectedIndex].value
    });
  }, newAd.correctAnswer == 1, newAd.correctAnswer == 2, newAd.correctAnswer == 3, newAd.correctAnswer == 4);
};

var templateObject_1;
},{"lit-html":"../node_modules/lit-html/lit-html.js","../../lib/message":"app/lib/message.ts"}],"app/templates/components/ad-editor.ts":[function(require,module,exports) {
"use strict";

var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", {
      value: raw
    });
  } else {
    cooked.raw = raw;
  }

  return cooked;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var lit_html_1 = require("lit-html");

var message_1 = require("../../lib/message");

exports.AdEditor = function (ad) {
  return lit_html_1.html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    <form>\n      <grid>\n        <column size=\"6\">\n          <p>\n            <label>Select a video:\n              <input type=\"file\" required @change=", ">\n            </label>\n          </p>\n          <p>\n            <label>Banner:\n              <input type=\"file\" required @change=", ">\n            </label>\n          </p>\n          <p>\n            <label>Starts at (seconds):\n              <input type=\"text\" value=", " required @input=", ">\n            </label>\n          </p>\n        </column>\n        <column size=\"6\">\n          <p>\n            <label>Logo:\n              <input type=\"file\" required @change=", ">\n            </label>\n          </p>\n          <p>\n            <label>Minimum Width:\n              <input type=\"text\" value=", " required @input=", ">\n            </label>\n          </p>\n          <p>\n            <label>Minimum Height:\n              <input type=\"text\" value=", " required @input=", ">\n            </label>\n          </p>\n          <p>\n            <label>\n              <input type=\"checkbox\" ?checked=", " @click=", "> <span>Can be skipped</span>\n            </label>\n          </p>\n        </column>\n      </grid>\n      <p>\n        <label>Question:\n          <input type=\"text\" value=", " required @input=", ">\n        </label>\n      </p>\n      <fieldset>\n        <p>\n          <label>Option #1\n            <input type=\"text\" value=", " required @input=", ">\n          </label>\n        </p>\n        <p>\n          <label>Option #2\n            <input type=\"text\" value=", " required @input=", ">\n          </label>\n        </p>\n        <p>\n          <label>Option #3\n            <input type=\"text\" value=", " @input=", ">\n          </label>\n        </p>\n        <p>\n          <label>Option #4\n            <input type=\"text\" value=", " @input=", ">\n          </label>\n        </p>\n      </fieldset>\n      <p>\n        <label><span>Select correct answer:</span>\n          <select @change=", ">\n            <option value=\"1\" ?selected=", ">Option #1</option>\n            <option value=\"2\" ?selected=", ">Option #2</option>\n            <option value=\"3\" ?selected=", ">Option #3</option>\n            <option value=\"4\" ?selected=", ">Option #4</option>\n          </select>\n        </label>\n      </p>\n    </form>\n  "], ["\n    <form>\n      <grid>\n        <column size=\"6\">\n          <p>\n            <label>Select a video:\n              <input type=\"file\" required @change=", ">\n            </label>\n          </p>\n          <p>\n            <label>Banner:\n              <input type=\"file\" required @change=", ">\n            </label>\n          </p>\n          <p>\n            <label>Starts at (seconds):\n              <input type=\"text\" value=", " required @input=", ">\n            </label>\n          </p>\n        </column>\n        <column size=\"6\">\n          <p>\n            <label>Logo:\n              <input type=\"file\" required @change=", ">\n            </label>\n          </p>\n          <p>\n            <label>Minimum Width:\n              <input type=\"text\" value=", " required @input=", ">\n            </label>\n          </p>\n          <p>\n            <label>Minimum Height:\n              <input type=\"text\" value=", " required @input=", ">\n            </label>\n          </p>\n          <p>\n            <label>\n              <input type=\"checkbox\" ?checked=", " @click=", "> <span>Can be skipped</span>\n            </label>\n          </p>\n        </column>\n      </grid>\n      <p>\n        <label>Question:\n          <input type=\"text\" value=", " required @input=", ">\n        </label>\n      </p>\n      <fieldset>\n        <p>\n          <label>Option #1\n            <input type=\"text\" value=", " required @input=", ">\n          </label>\n        </p>\n        <p>\n          <label>Option #2\n            <input type=\"text\" value=", " required @input=", ">\n          </label>\n        </p>\n        <p>\n          <label>Option #3\n            <input type=\"text\" value=", " @input=", ">\n          </label>\n        </p>\n        <p>\n          <label>Option #4\n            <input type=\"text\" value=", " @input=", ">\n          </label>\n        </p>\n      </fieldset>\n      <p>\n        <label><span>Select correct answer:</span>\n          <select @change=", ">\n            <option value=\"1\" ?selected=", ">Option #1</option>\n            <option value=\"2\" ?selected=", ">Option #2</option>\n            <option value=\"3\" ?selected=", ">Option #3</option>\n            <option value=\"4\" ?selected=", ">Option #4</option>\n          </select>\n        </label>\n      </p>\n    </form>\n  "])), function () {
    message_1.send('uploadUpdateAdFile', {
      name: 'video',
      content: this.files[0]
    });
  }, function () {
    message_1.send('uploadUpdateAdFile', {
      name: 'banner',
      content: this.files[0]
    });
  }, ad.startsAt, function () {
    message_1.send('updateAdField', {
      startsAt: this.value
    });
  }, function () {
    message_1.send('uploadUpdateAdFile', {
      name: 'logo',
      content: this.files[0]
    });
  }, ad.minWidth, function () {
    message_1.send('updateAdField', {
      minWidth: this.value
    });
  }, ad.minHeight, function () {
    message_1.send('updateAdField', {
      minHeight: this.value
    });
  }, ad.canSkip, function () {
    message_1.send('updateAdField', {
      canSkip: this.checked
    });
  }, ad.question, function () {
    message_1.send('updateAdField', {
      question: this.value
    });
  }, ad.option1, function () {
    message_1.send('updateAdField', {
      option1: this.value
    });
  }, ad.option2, function () {
    message_1.send('updateAdField', {
      option2: this.value
    });
  }, ad.option3, function () {
    message_1.send('updateAdField', {
      option3: this.value
    });
  }, ad.option4, function () {
    message_1.send('updateAdField', {
      option4: this.value
    });
  }, function () {
    message_1.send('updateAdField', {
      correctAnswer: this.options[this.selectedIndex].value
    });
  }, ad.correctAnswer == 1, ad.correctAnswer == 2, ad.correctAnswer == 3, ad.correctAnswer == 4);
};

var templateObject_1;
},{"lit-html":"../node_modules/lit-html/lit-html.js","../../lib/message":"app/lib/message.ts"}],"app/templates/components/ad-preview.ts":[function(require,module,exports) {
"use strict";

var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", {
      value: raw
    });
  } else {
    cooked.raw = raw;
  }

  return cooked;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var lit_html_1 = require("lit-html");

exports.AdPreview = function (ad) {
  return lit_html_1.html(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  <section class=\"accruly-player demo\" data-skippable=", ">\n\n    ", "\n\n    <div class=\"accruly-logo\">\n      <img class=\"accruly-logo-img\" src=\"", "\">\n    </div>\n\n    <img class=\"accruly-banner-img\" src=\"", "\">\n\n    <section class=\"accruly-qa\">\n      <p class=\"accruly-question\">", "</p>\n\n      ", "\n    </section>\n  </section>\n"], ["\n  <section class=\"accruly-player demo\" data-skippable=", ">\n\n    ", "\n\n    <div class=\"accruly-logo\">\n      <img class=\"accruly-logo-img\" src=\"", "\">\n    </div>\n\n    <img class=\"accruly-banner-img\" src=\"", "\">\n\n    <section class=\"accruly-qa\">\n      <p class=\"accruly-question\">", "</p>\n\n      ", "\n    </section>\n  </section>\n"])), ad.skippable ? 'true' : 'false', ad.video === '' ? '' : lit_html_1.html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      <video class=\"accruly-video\" controls @timeupdate=", ">\n        <source src=\"", "\" type=\"video/mp4\">\n      </video>\n    "], ["\n      <video class=\"accruly-video\" controls @timeupdate=", ">\n        <source src=\"", "\" type=\"video/mp4\">\n      </video>\n    "])), function () {
    var banner = document.querySelector('.accruly-banner-img');
    var insertedQA = document.querySelector('.accruly-qa');

    if (Math.round(this.currentTime) == ad.startsAt) {
      insertedQA.style.display = 'block';
      banner.style.display = 'none';
    }
  }, ad.video), ad.logo, ad.banner, ad.question, AdOptions(ad));
};

var AdOptions = function AdOptions(ad) {
  return lit_html_1.html(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    <div class=\"accruly-options\">\n      <button class=\"accruly-answer\" style=", " data-answerid=\"1\" @click=", ">", "</button>\n\n      <button class=\"accruly-answer\" style=", " data-answerid=\"2\" @click=", ">", "</button>\n\n      <button class=\"accruly-answer\" style=", " data-answerid=\"3\" @click=", ">", "</button>\n\n      <button class=\"accruly-answer\" style=", " data-answerid=\"4\" @click=", ">", "</button>\n    </div>\n  "], ["\n    <div class=\"accruly-options\">\n      <button class=\"accruly-answer\" style=", " data-answerid=\"1\" @click=", ">", "</button>\n\n      <button class=\"accruly-answer\" style=", " data-answerid=\"2\" @click=", ">", "</button>\n\n      <button class=\"accruly-answer\" style=", " data-answerid=\"3\" @click=", ">", "</button>\n\n      <button class=\"accruly-answer\" style=", " data-answerid=\"4\" @click=", ">", "</button>\n    </div>\n  "])), ad.option1 == '' ? 'display:none' : 'display:block', function () {
    var banner = document.querySelector('.accruly-banner-img');
    var insertedQA = document.querySelector('.accruly-qa');
    var thisButton = this;

    if (thisButton.dataset.answerid == ad.correctAnswer) {
      thisButton.style.backgroundColor = '#16c86a';
      thisButton.style.color = 'white';
    } else {
      thisButton.style.backgroundColor = '#d14040';
      thisButton.style.color = 'white';
      setTimeout(function () {
        insertedQA.style.display = 'block';
        banner.style.display = 'none';
      }, 4000);
    } // Hide the Q&A and clear the selected answer after 1 second


    setTimeout(function () {
      insertedQA.style.display = 'none';
      thisButton.style.backgroundColor = 'white';
      thisButton.style.color = 'black';
      banner.style.display = 'block';
    }, 1000);
  }, ad.option1, ad.option2 == '' ? 'display:none' : 'display:block', function () {
    var banner = document.querySelector('.accruly-banner-img');
    var insertedQA = document.querySelector('.accruly-qa');
    var thisButton = this;

    if (thisButton.dataset.answerid == ad.correctAnswer) {
      thisButton.style.backgroundColor = '#16c86a';
      thisButton.style.color = 'white';
    } else {
      thisButton.style.backgroundColor = '#d14040';
      thisButton.style.color = 'white';
      setTimeout(function () {
        insertedQA.style.display = 'block';
        banner.style.display = 'none';
      }, 4000);
    } // Hide the Q&A and clear the selected answer after 1 second


    setTimeout(function () {
      insertedQA.style.display = 'none';
      thisButton.style.backgroundColor = 'white';
      thisButton.style.color = 'black';
      banner.style.display = 'block';
    }, 1000);
  }, ad.option2, ad.option3 == '' ? 'display:none' : 'display:block', function () {
    var banner = document.querySelector('.accruly-banner-img');
    var insertedQA = document.querySelector('.accruly-qa');
    var thisButton = this;

    if (thisButton.dataset.answerid == ad.correctAnswer) {
      thisButton.style.backgroundColor = '#16c86a';
      thisButton.style.color = 'white';
    } else {
      thisButton.style.backgroundColor = '#d14040';
      thisButton.style.color = 'white';
      setTimeout(function () {
        insertedQA.style.display = 'block';
        banner.style.display = 'none';
      }, 4000);
    } // Hide the Q&A and clear the selected answer after 1 second


    setTimeout(function () {
      insertedQA.style.display = 'none';
      thisButton.style.backgroundColor = 'white';
      thisButton.style.color = 'black';
      banner.style.display = 'block';
    }, 1000);
  }, ad.option3, ad.option4 == '' ? 'display:none' : 'display:block', function () {
    var banner = document.querySelector('.accruly-banner-img');
    var insertedQA = document.querySelector('.accruly-qa');
    var thisButton = this;

    if (thisButton.dataset.answerid == ad.correctAnswer) {
      thisButton.style.backgroundColor = '#16c86a';
      thisButton.style.color = 'white';
    } else {
      thisButton.style.backgroundColor = '#d14040';
      thisButton.style.color = 'white';
      setTimeout(function () {
        insertedQA.style.display = 'block';
        banner.style.display = 'none';
      }, 4000);
    } // Hide the Q&A and clear the selected answer after 1 second


    setTimeout(function () {
      insertedQA.style.display = 'none';
      thisButton.style.backgroundColor = 'white';
      thisButton.style.color = 'black';
      banner.style.display = 'block';
    }, 1000);
  }, ad.option4);
};

var templateObject_1, templateObject_2, templateObject_3;
},{"lit-html":"../node_modules/lit-html/lit-html.js"}],"app/templates/components/ad-block.ts":[function(require,module,exports) {
"use strict";

var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", {
      value: raw
    });
  } else {
    cooked.raw = raw;
  }

  return cooked;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var lit_html_1 = require("lit-html");

var message_1 = require("../../lib/message");

var ad_editor_1 = require("./ad-editor");

var ad_preview_1 = require("./ad-preview");

exports.AdBlock = function (options) {
  return lit_html_1.html(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  <li class=\"ad-block\">\n    <p class=\"question\">", "</p>\n    <p class=\"-no-margin\">\n      <small class=\"ad-metadata\">by <strong>Alan Hirsch</strong></small>\n      <button class=\"button-plain -red\" @click=", ">Remove</button>\n      <button class=\"button-plain\" @click=", ">Edit</button>\n    </p>\n\n    <section class=\"ad-editor-container\" id=", ">\n      ", "\n\n      ", "\n\n      <button @click=", ">Update</button>\n\n      ", "\n\n    </section>\n\n  </li>\n"], ["\n  <li class=\"ad-block\">\n    <p class=\"question\">", "</p>\n    <p class=\"-no-margin\">\n      <small class=\"ad-metadata\">by <strong>Alan Hirsch</strong></small>\n      <button class=\"button-plain -red\" @click=", ">Remove</button>\n      <button class=\"button-plain\" @click=", ">Edit</button>\n    </p>\n\n    <section class=\"ad-editor-container\" id=", ">\n      ", "\n\n      ", "\n\n      <button @click=", ">Update</button>\n\n      ", "\n\n    </section>\n\n  </li>\n"])), options.ad.question, function () {
    return message_1.send('removeAd', {
      _id: options.ad._id
    });
  }, function () {
    var editorContainer = document.querySelector('#id' + options.ad._id);
    editorContainer.style.display = 'block';
  }, 'id' + options.ad._id, ad_preview_1.AdPreview(options.ad), ad_editor_1.AdEditor(options.ad), function () {
    return message_1.send('updateAd', {
      _id: options.ad._id
    });
  }, options.ad.status === 'pending' ? lit_html_1.html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["<button @click=", ">Publish</button>"], ["<button @click=", ">Publish</button>"])), function () {
    return message_1.send('publishAd', {
      _id: options.ad._id
    });
  }) : lit_html_1.html(templateObject_2 || (templateObject_2 = __makeTemplateObject(["<button @click=", ">Unpublish</button>"], ["<button @click=", ">Unpublish</button>"])), function () {
    return message_1.send('unpublishAd', {
      _id: options.ad._id
    });
  }));
};

var templateObject_1, templateObject_2, templateObject_3;
},{"lit-html":"../node_modules/lit-html/lit-html.js","../../lib/message":"app/lib/message.ts","./ad-editor":"app/templates/components/ad-editor.ts","./ad-preview":"app/templates/components/ad-preview.ts"}],"app/templates/pages/ads.ts":[function(require,module,exports) {
"use strict";

var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", {
      value: raw
    });
  } else {
    cooked.raw = raw;
  }

  return cooked;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var lit_html_1 = require("lit-html");

var message_1 = require("../../lib/message");

var ad_publisher_1 = require("../components/ad-publisher");

var ad_block_1 = require("../components/ad-block");

var ad_preview_1 = require("../components/ad-preview");

exports.ActiveAds = function (options) {
  return lit_html_1.html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    <section class=\"main-section\">\n      <ul>\n        ", "\n      </ul>\n    </section>\n  "], ["\n    <section class=\"main-section\">\n      <ul>\n        ", "\n      </ul>\n    </section>\n  "])), options.state.ads.filter(function (x) {
    return x.status === 'active';
  }).map(function (ad) {
    return ad_block_1.AdBlock({
      ad: ad,
      state: options.state
    });
  }));
};

exports.PausedAds = function (options) {
  return lit_html_1.html(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    <section class=\"main-section\">\n      <ul>\n        ", "\n      </ul>\n    </section>\n  "], ["\n    <section class=\"main-section\">\n      <ul>\n        ", "\n      </ul>\n    </section>\n  "])), options.state.ads.filter(function (x) {
    return x.status === 'paused' || x.status === 'client paused';
  }).map(function (ad) {
    return ad_block_1.AdBlock({
      ad: ad,
      state: options.state
    });
  }));
};

exports.CreateAd = function (options) {
  return lit_html_1.html(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    <section class=\"main-section create-ad\">\n\n      <progress class=\"video-upload-progress\" style=\"width: 100%\" max=\"100\" value=\"0\"></progress>\n\n      ", "\n\n      ", "\n\n      <button @click=", ">Create Ad</button>\n    </section>\n  "], ["\n    <section class=\"main-section create-ad\">\n\n      <progress class=\"video-upload-progress\" style=\"width: 100%\" max=\"100\" value=\"0\"></progress>\n\n      ", "\n\n      ", "\n\n      <button @click=", ">Create Ad</button>\n    </section>\n  "])), options.state.newAd.video !== '' ? ad_preview_1.AdPreview(options.state.newAd) : '', ad_publisher_1.AdPublisher(options.state.newAd), function () {
    return message_1.send('createAd');
  });
};

var templateObject_1, templateObject_2, templateObject_3;
},{"lit-html":"../node_modules/lit-html/lit-html.js","../../lib/message":"app/lib/message.ts","../components/ad-publisher":"app/templates/components/ad-publisher.ts","../components/ad-block":"app/templates/components/ad-block.ts","../components/ad-preview":"app/templates/components/ad-preview.ts"}],"app/templates/pages/analytics.ts":[function(require,module,exports) {
"use strict";

var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", {
      value: raw
    });
  } else {
    cooked.raw = raw;
  }

  return cooked;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var lit_html_1 = require("lit-html");

exports.Analytics = function (options) {
  return lit_html_1.html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    <h1>This is the main content of the analytics page</h1>\n  "], ["\n    <h1>This is the main content of the analytics page</h1>\n  "])));
};

var templateObject_1;
},{"lit-html":"../node_modules/lit-html/lit-html.js"}],"app/templates/components/answer-block.ts":[function(require,module,exports) {
"use strict";

var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", {
      value: raw
    });
  } else {
    cooked.raw = raw;
  }

  return cooked;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var lit_html_1 = require("lit-html");

var message_1 = require("../../lib/message");

exports.AnswerBlock = function (answer, state) {
  // Get all the metadata from the answer
  var metadata = Object.entries(answer).map(function (entry) {
    return {
      property: entry[0],
      value: entry[1]
    };
  }).filter(function (entry) {
    return !['_id', '$loki', 'meta'].includes(entry.property);
  }); // Get the ad for this answer

  var ad = state.ads.find(function (ad) {
    return ad._id === answer.ad_id;
  });
  var answerContent = ad && ['option' + answer.answer];
  return lit_html_1.html(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    <li class=\"answer-block\" @click=", ">\n      <p class=", ">", " - ", "</p>\n\n      <section class=\"answer-details\" style=\"display: none\" id=", ">\n        <ul>\n          ", "\n        </ul>\n      </section>\n    </li>\n  "], ["\n    <li class=\"answer-block\" @click=", ">\n      <p class=", ">", " - ", "</p>\n\n      <section class=\"answer-details\" style=\"display: none\" id=", ">\n        <ul>\n          ", "\n        </ul>\n      </section>\n    </li>\n  "])), function () {
    return message_1.send('getFullAnswer', {
      _id: answer._id
    });
  }, answer.answer === ad.correctAnswer ? '-correct' : '-incorrect', ad.question, answerContent, 'ID' + answer._id, metadata.map(function (x) {
    return lit_html_1.html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["<li><strong>", "</strong>: ", "</li>"], ["<li><strong>", "</strong>: ", "</li>"])), x.property, x.value);
  }));
};

var templateObject_1, templateObject_2;
},{"lit-html":"../node_modules/lit-html/lit-html.js","../../lib/message":"app/lib/message.ts"}],"app/templates/pages/answers.ts":[function(require,module,exports) {
"use strict";

var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", {
      value: raw
    });
  } else {
    cooked.raw = raw;
  }

  return cooked;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var answer_block_1 = require("../components/answer-block");

var lit_html_1 = require("lit-html");

exports.Answers = function (options) {
  return lit_html_1.html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    <section class=\"main-section\">\n      <ul>\n        ", "\n      </ul>\n    </section>\n  "], ["\n    <section class=\"main-section\">\n      <ul>\n        ", "\n      </ul>\n    </section>\n  "])), options.state.answers.map(function (answer) {
    return answer_block_1.AnswerBlock(answer, options.state);
  }));
};

var templateObject_1;
},{"../components/answer-block":"app/templates/components/answer-block.ts","lit-html":"../node_modules/lit-html/lit-html.js"}],"app/templates/components/account-editor.ts":[function(require,module,exports) {
"use strict";

var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", {
      value: raw
    });
  } else {
    cooked.raw = raw;
  }

  return cooked;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var lit_html_1 = require("lit-html");

var message_1 = require("../../lib/message");

exports.AccountEditor = function (options) {
  return lit_html_1.html(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    <p>\n      <label>\n        <span>Email:</span>\n        <input type=\"email\" value=", " @input=", ">\n      </label>\n    </p>\n\n    <p>\n      <label>\n        <span>Old password:</span>\n        <input type=\"password\" placeholder=\"password\" @input=", ">\n      </label>\n    </p>\n\n    <p>\n      <label>\n        <span>New password:</span>\n        <input type=\"password\" placeholder=\"password\" @input=", ">\n      </label>\n    </p>\n\n    <p>\n      <label>\n        <span>Name:</span>\n        <input type=\"text\" value=", " @input=", ">\n      </label>\n    </p>\n\n    <p>\n      <label>\n        <span>UTC offset:</span>\n        <input type=\"text\" placeholder=\"+01\" value=", " @input=", ">\n      </label>\n    </p>\n\n    <p style=", ">\n      <label>\n        <span>Type:</span>\n        <select @change=", ">\n          <option ?selected=", ">Admin</option>\n          <option ?selected=", ">Editor</option>\n          <option ?selected=", ">Client</option>\n          <option ?selected=", ">Publisher</option>\n        </select>\n      </label>\n    </p>\n\n    <p style=", ">\n      <label>\n        <span>Status:</span>\n        <select @change=", ">\n          <option value=\"active\" ?selected=", ">Active</option>\n          <option value=\"paused\" ?selected=", ">Paused</option>\n        </select>\n      </label>\n    </p>\n\n    <p style=", ">\n      <label>\n        <span>Exclusive to:</span>\n        <select @change=", ">\n          <option data-userid=\"\" ?selected=", "></option>\n          ", "\n        </select>\n      </label>\n    </p>\n\n  "], ["\n    <p>\n      <label>\n        <span>Email:</span>\n        <input type=\"email\" value=", " @input=", ">\n      </label>\n    </p>\n\n    <p>\n      <label>\n        <span>Old password:</span>\n        <input type=\"password\" placeholder=\"password\" @input=", ">\n      </label>\n    </p>\n\n    <p>\n      <label>\n        <span>New password:</span>\n        <input type=\"password\" placeholder=\"password\" @input=", ">\n      </label>\n    </p>\n\n    <p>\n      <label>\n        <span>Name:</span>\n        <input type=\"text\" value=", " @input=", ">\n      </label>\n    </p>\n\n    <p>\n      <label>\n        <span>UTC offset:</span>\n        <input type=\"text\" placeholder=\"+01\" value=", " @input=", ">\n      </label>\n    </p>\n\n    <p style=", ">\n      <label>\n        <span>Type:</span>\n        <select @change=", ">\n          <option ?selected=", ">Admin</option>\n          <option ?selected=", ">Editor</option>\n          <option ?selected=", ">Client</option>\n          <option ?selected=", ">Publisher</option>\n        </select>\n      </label>\n    </p>\n\n    <p style=", ">\n      <label>\n        <span>Status:</span>\n        <select @change=", ">\n          <option value=\"active\" ?selected=", ">Active</option>\n          <option value=\"paused\" ?selected=", ">Paused</option>\n        </select>\n      </label>\n    </p>\n\n    <p style=", ">\n      <label>\n        <span>Exclusive to:</span>\n        <select @change=", ">\n          <option data-userid=\"\" ?selected=", "></option>\n          ", "\n        </select>\n      </label>\n    </p>\n\n  "])), options.account.email, function () {
    message_1.send('updateAccountField', {
      name: 'email',
      value: this.value
    });
  }, function () {
    message_1.send('updateAccountField', {
      name: 'oldpassword',
      value: this.value
    });
  }, function () {
    message_1.send('updateAccountField', {
      name: 'password',
      value: this.value
    });
  }, options.account.name, function () {
    message_1.send('updateAccountField', {
      name: 'name',
      value: this.value
    });
  }, options.account.utcOffset, function () {
    message_1.send('updateAccountField', {
      name: 'utcOffset',
      value: this.value
    });
  }, options.state.location === 'settings' ? 'display: none' : 'display: block', function () {
    message_1.send('updateAccountField', {
      name: 'type',
      value: this.options[this.selectedIndex].value
    });
  }, options.account.type === 'admin', options.account.type === 'editor', options.account.type === 'client', options.account.type === 'publisher', options.state.location === 'settings' ? 'display: none' : 'display: block', function () {
    message_1.send('updateAccountField', {
      name: 'status',
      value: this.options[this.selectedIndex].value
    });
  }, options.account.status === 'active', options.account.status === 'paused', options.state.updateAccount.type === 'publisher' ? 'display:block' : 'display: none', function () {
    message_1.send('updateAccountField', {
      name: 'exclusiveTo',
      value: this.options[this.selectedIndex].value
    });
  }, options.account.exclusiveTo === '', options.state.accounts.map(function (account) {
    return lit_html_1.html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            <option data-userid=", " ?selected=", ">", "</option>\n          "], ["\n            <option data-userid=", " ?selected=", ">", "</option>\n          "])), account.exclusiveTo, options.account.exclusiveTo === account.exclusiveTo, account.name);
  }));
};

var templateObject_1, templateObject_2;
},{"lit-html":"../node_modules/lit-html/lit-html.js","../../lib/message":"app/lib/message.ts"}],"app/templates/components/account-block.ts":[function(require,module,exports) {
"use strict";

var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", {
      value: raw
    });
  } else {
    cooked.raw = raw;
  }

  return cooked;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var lit_html_1 = require("lit-html");

var message_1 = require("../../lib/message");

var account_editor_1 = require("./account-editor");

exports.AccountBlock = function (options) {
  return lit_html_1.html(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  <li class=\"account-block\">\n    <p class=\"name\">", "</p>\n    <p class=\"-no-margin\">\n      <small class=\"account-metadata\"><strong>", "</strong></small>\n      <button style=", " class=\"button-plain -red\" @click=", ">Remove</button>\n      <button class=\"button-plain\" @click=", ">Edit</button>\n    </p>\n\n    <section class=\"account-editor-container\" id=", ">\n      ", "\n\n      <button @click=", ">Update</button>\n\n      ", "\n\n    </section>\n  </li>\n"], ["\n  <li class=\"account-block\">\n    <p class=\"name\">", "</p>\n    <p class=\"-no-margin\">\n      <small class=\"account-metadata\"><strong>", "</strong></small>\n      <button style=", " class=\"button-plain -red\" @click=", ">Remove</button>\n      <button class=\"button-plain\" @click=", ">Edit</button>\n    </p>\n\n    <section class=\"account-editor-container\" id=", ">\n      ", "\n\n      <button @click=", ">Update</button>\n\n      ", "\n\n    </section>\n  </li>\n"])), options.account.name, options.account.email, options.account._id === options.state.user._id ? 'display:none' : 'display:inline-block', function () {
    return message_1.send('removeAccount', {
      _id: options.account._id
    });
  }, function () {
    var editorContainer = document.querySelector('#id' + options.account._id);
    editorContainer.style.display = 'block';
  }, 'id' + options.account._id, account_editor_1.AccountEditor({
    account: options.account,
    state: options.state
  }), function () {
    return message_1.send('updateAccount', {
      _id: options.account._id
    });
  }, options.account.status === 'paused' ? lit_html_1.html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["<button @click=", ">Activate</button>"], ["<button @click=", ">Activate</button>"])), function () {
    return message_1.send('activateAccount', {
      _id: options.account._id
    });
  }) : lit_html_1.html(templateObject_2 || (templateObject_2 = __makeTemplateObject(["<button @click=", ">Deactivate</button>"], ["<button @click=", ">Deactivate</button>"])), function () {
    return message_1.send('deactivateAccount', {
      _id: options.account._id
    });
  }));
};

var templateObject_1, templateObject_2, templateObject_3;
},{"lit-html":"../node_modules/lit-html/lit-html.js","../../lib/message":"app/lib/message.ts","./account-editor":"app/templates/components/account-editor.ts"}],"app/templates/components/account-publisher.ts":[function(require,module,exports) {
"use strict";

var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", {
      value: raw
    });
  } else {
    cooked.raw = raw;
  }

  return cooked;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var lit_html_1 = require("lit-html");

var message_1 = require("../../lib/message");

exports.AccountPublisher = function (options) {
  return lit_html_1.html(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    <p>\n      <label>\n        <span>Name:</span>\n        <input type=\"text\" value=", " @input=", ">\n      </label>\n    </p>\n\n    <p>\n      <label>\n        <span>Email:</span>\n        <input type=\"email\" value=", " @input=", ">\n      </label>\n    </p>\n\n    <p>\n      <label>\n        <span>Password:</span>\n        <input type=\"password\" placeholder=\"password\" @input=", ">\n      </label>\n    </p>\n\n    <p>\n      <label>\n        <span>UTC offset:</span>\n        <input type=\"text\" placeholder=\"+01\" value=", " @input=", ">\n      </label>\n    </p>\n\n    <p>\n      <label>\n        <span>Type:</span>\n        <select @change=", ">\n          <option ?selected=", ">Admin</option>\n          <option ?selected=", ">Editor</option>\n          <option ?selected=", ">Client</option>\n          <option ?selected=", ">Publisher</option>\n        </select>\n      </label>\n    </p>\n\n    <p>\n      <label>\n        <span>Status:</span>\n        <select @change=", ">\n          <option value=\"active\" ?selected=", ">Active</option>\n          <option value=\"paused\" ?selected=", ">Paused</option>\n        </select>\n      </label>\n    </p>\n\n    <p style=", ">\n      <label>\n        <span>Exclusive to:</span>\n        <select @change=", ">\n          <option data-userid=\"\" ?selected=", "></option>\n          ", "\n        </select>\n      </label>\n    </p>\n  "], ["\n    <p>\n      <label>\n        <span>Name:</span>\n        <input type=\"text\" value=", " @input=", ">\n      </label>\n    </p>\n\n    <p>\n      <label>\n        <span>Email:</span>\n        <input type=\"email\" value=", " @input=", ">\n      </label>\n    </p>\n\n    <p>\n      <label>\n        <span>Password:</span>\n        <input type=\"password\" placeholder=\"password\" @input=", ">\n      </label>\n    </p>\n\n    <p>\n      <label>\n        <span>UTC offset:</span>\n        <input type=\"text\" placeholder=\"+01\" value=", " @input=", ">\n      </label>\n    </p>\n\n    <p>\n      <label>\n        <span>Type:</span>\n        <select @change=", ">\n          <option ?selected=", ">Admin</option>\n          <option ?selected=", ">Editor</option>\n          <option ?selected=", ">Client</option>\n          <option ?selected=", ">Publisher</option>\n        </select>\n      </label>\n    </p>\n\n    <p>\n      <label>\n        <span>Status:</span>\n        <select @change=", ">\n          <option value=\"active\" ?selected=", ">Active</option>\n          <option value=\"paused\" ?selected=", ">Paused</option>\n        </select>\n      </label>\n    </p>\n\n    <p style=", ">\n      <label>\n        <span>Exclusive to:</span>\n        <select @change=", ">\n          <option data-userid=\"\" ?selected=", "></option>\n          ", "\n        </select>\n      </label>\n    </p>\n  "])), options.account.name, function () {
    message_1.send('newAccountField', {
      name: 'name',
      value: this.value
    });
  }, options.account.email, function () {
    message_1.send('newAccountField', {
      name: 'email',
      value: this.value
    });
  }, function () {
    message_1.send('newAccountField', {
      name: 'password',
      value: this.value
    });
  }, options.account.utcOffset, function () {
    message_1.send('newAccountField', {
      name: 'utcOffset',
      value: this.value
    });
  }, function () {
    message_1.send('newAccountField', {
      name: 'type',
      value: this.options[this.selectedIndex].value
    });
  }, options.account.type === 'admin', options.account.type === 'editor', options.account.type === 'client', options.account.type === 'publisher', function () {
    message_1.send('newAccountField', {
      name: 'status',
      value: this.options[this.selectedIndex].value
    });
  }, options.account.status === 'active', options.account.status === 'paused', options.state.newAccount.type === 'publisher' ? 'display:block' : 'display:none', function () {
    message_1.send('newAccountField ', {
      name: 'exclusiveTo',
      value: this.options[this.selectedIndex].value
    });
  }, options.account.exclusiveTo === '', options.state.accounts.filter(function (x) {
    return x.type === 'client';
  }).map(function (account) {
    return lit_html_1.html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            <option data-userid=", " ?selected=", ">", "</option>\n          "], ["\n            <option data-userid=", " ?selected=", ">", "</option>\n          "])), account.exclusiveTo, options.account.exclusiveTo === account.exclusiveTo, account.name);
  }));
};

var templateObject_1, templateObject_2;
},{"lit-html":"../node_modules/lit-html/lit-html.js","../../lib/message":"app/lib/message.ts"}],"app/templates/pages/accounts.ts":[function(require,module,exports) {
"use strict";

var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", {
      value: raw
    });
  } else {
    cooked.raw = raw;
  }

  return cooked;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var lit_html_1 = require("lit-html");

var message_1 = require("../../lib/message");

var account_block_1 = require("../components/account-block");

var account_publisher_1 = require("../components/account-publisher");

var account_editor_1 = require("../components/account-editor");

exports.ActiveAccounts = function (options) {
  return lit_html_1.html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    <section class=\"main-section\">\n      <ul>\n        ", "\n      </ul>\n    </section>\n  "], ["\n    <section class=\"main-section\">\n      <ul>\n        ", "\n      </ul>\n    </section>\n  "])), options.state.accounts.filter(function (x) {
    return x.status === 'active';
  }).map(function (account) {
    return account_block_1.AccountBlock({
      account: account,
      state: options.state
    });
  }));
};

exports.PausedAccounts = function (options) {
  return lit_html_1.html(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    <section class=\"main-section\">\n      <ul>\n        ", "\n      </ul>\n    </section>\n  "], ["\n    <section class=\"main-section\">\n      <ul>\n        ", "\n      </ul>\n    </section>\n  "])), options.state.accounts.filter(function (x) {
    return x.status === 'paused';
  }).map(function (account) {
    return account_block_1.AccountBlock({
      account: account,
      state: options.state
    });
  }));
};

exports.CreateAccount = function (options) {
  return lit_html_1.html(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    <section class=\"main-section create-ad\">\n      ", "\n\n      <button style=\"display:none\" id=\"createaccountbutton\" @click=", ">Create Account</button>\n    </section>\n  "], ["\n    <section class=\"main-section create-ad\">\n      ", "\n\n      <button style=\"display:none\" id=\"createaccountbutton\" @click=", ">Create Account</button>\n    </section>\n  "])), account_publisher_1.AccountPublisher({
    account: options.state.newAccount,
    state: options.state
  }), function () {
    return message_1.send('createAccount');
  });
};

exports.AccountSettings = function (options) {
  return lit_html_1.html(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n    <section class=\"main-section create-ad\">\n      ", "\n\n      <button @click=", ">Update Account</button>\n    </section>\n  "], ["\n    <section class=\"main-section create-ad\">\n      ", "\n\n      <button @click=", ">Update Account</button>\n    </section>\n  "])), account_editor_1.AccountEditor({
    account: options.state.user,
    state: options.state
  }), function () {
    return message_1.send('updateAccount', {
      _id: options.state.user._id
    });
  });
};

var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
},{"lit-html":"../node_modules/lit-html/lit-html.js","../../lib/message":"app/lib/message.ts","../components/account-block":"app/templates/components/account-block.ts","../components/account-publisher":"app/templates/components/account-publisher.ts","../components/account-editor":"app/templates/components/account-editor.ts"}],"app/templates/components/nav-link.ts":[function(require,module,exports) {
"use strict";

var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", {
      value: raw
    });
  } else {
    cooked.raw = raw;
  }

  return cooked;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var lit_html_1 = require("lit-html");

var message_1 = require("../../lib/message"); // Template for navigation links


exports.NavLink = function (options) {
  return lit_html_1.html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  <a @click=", " class=\"", "\">", "</a>\n"], ["\n  <a @click=", " class=\"", "\">", "</a>\n"])), function () {
    return message_1.send('changeLocation', {
      target: options.target
    });
  }, options.isActive ? '-active' : '', options.text);
};

var templateObject_1;
},{"lit-html":"../node_modules/lit-html/lit-html.js","../../lib/message":"app/lib/message.ts"}],"app/templates/pages/login.ts":[function(require,module,exports) {
"use strict";

var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", {
      value: raw
    });
  } else {
    cooked.raw = raw;
  }

  return cooked;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var lit_html_1 = require("lit-html");

var message_1 = require("../../lib/message");

var nav_link_1 = require("../components/nav-link");

exports.Login = function () {
  return lit_html_1.html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  <section class=\"login-screen\">\n    <p>\n      <label>\n        <span>Email:</span>\n        <input type=\"email\" placeholder=\"example@mail.com\" @input=", ">\n      </label>\n    </p>\n\n    <p>\n      <label>\n        <span>Password:</span>\n        <input type=\"password\" placeholder=\"password\" @input=", ">\n      </label>\n    </p>\n\n    <p>\n      ", "\n    </p>\n\n    <p class=\"-text-right\">\n      <button @click=", ">Log in</button>\n    </p>\n  </section>\n"], ["\n  <section class=\"login-screen\">\n    <p>\n      <label>\n        <span>Email:</span>\n        <input type=\"email\" placeholder=\"example@mail.com\" @input=", ">\n      </label>\n    </p>\n\n    <p>\n      <label>\n        <span>Password:</span>\n        <input type=\"password\" placeholder=\"password\" @input=", ">\n      </label>\n    </p>\n\n    <p>\n      ", "\n    </p>\n\n    <p class=\"-text-right\">\n      <button @click=", ">Log in</button>\n    </p>\n  </section>\n"])), function () {
    message_1.send('newLogin', {
      field: 'email',
      value: this.value
    });
  }, function () {
    message_1.send('newLogin', {
      field: 'password',
      value: this.value
    });
  }, nav_link_1.NavLink({
    text: 'Forgot your password?',
    target: 'recoverpassword'
  }), function () {
    return message_1.send('login');
  });
};

var templateObject_1;
},{"lit-html":"../node_modules/lit-html/lit-html.js","../../lib/message":"app/lib/message.ts","../components/nav-link":"app/templates/components/nav-link.ts"}],"app/templates/pages/recoverpassword.ts":[function(require,module,exports) {
"use strict";

var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", {
      value: raw
    });
  } else {
    cooked.raw = raw;
  }

  return cooked;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var lit_html_1 = require("lit-html");

var message_1 = require("../../lib/message");

exports.RecoverPassword = function () {
  return lit_html_1.html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  <section class=\"login-screen\">\n    <p>\n      <label>\n        <span>Email:</span>\n        <input type=\"email\" placeholder=\"example@mail.com\" @input=", ">\n      </label>\n    </p>\n\n    <p class=\"-text-right\">\n      <button @click=", ">Recover Password</button>\n    </p>\n  </section>\n"], ["\n  <section class=\"login-screen\">\n    <p>\n      <label>\n        <span>Email:</span>\n        <input type=\"email\" placeholder=\"example@mail.com\" @input=", ">\n      </label>\n    </p>\n\n    <p class=\"-text-right\">\n      <button @click=", ">Recover Password</button>\n    </p>\n  </section>\n"])), function () {
    message_1.send('newLogin', {
      field: 'email',
      value: this.value
    });
  }, function () {
    return message_1.send('recoverpassword');
  });
};

var templateObject_1;
},{"lit-html":"../node_modules/lit-html/lit-html.js","../../lib/message":"app/lib/message.ts"}],"app/templates/components/notification.ts":[function(require,module,exports) {
"use strict";

var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", {
      value: raw
    });
  } else {
    cooked.raw = raw;
  }

  return cooked;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var lit_html_1 = require("lit-html");

var message_1 = require("../../lib/message");

exports.Notification = function (options) {
  return lit_html_1.html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  <div class=\"notification\">\n    <p>", "</p>\n    <button class=\"notification-close\" @click=", ">\xD7</button>\n  </div>\n\n"], ["\n  <div class=\"notification\">\n    <p>", "</p>\n    <button class=\"notification-close\" @click=", ">\xD7</button>\n  </div>\n\n"])), options.description, function () {
    return message_1.send('removeNotification');
  });
};

var templateObject_1;
},{"lit-html":"../node_modules/lit-html/lit-html.js","../../lib/message":"app/lib/message.ts"}],"app/templates/components/nav-subnav.ts":[function(require,module,exports) {
"use strict";

var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", {
      value: raw
    });
  } else {
    cooked.raw = raw;
  }

  return cooked;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var lit_html_1 = require("lit-html");

var nav_link_1 = require("./nav-link"); // Template for the secondary navigation


exports.SubNav = function (options) {
  switch (options.path[0]) {
    case 'analytics':
      return lit_html_1.html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n        <h1>Analytics</h1>\n      "], ["\n        <h1>Analytics</h1>\n      "])));

    case 'ads':
      return lit_html_1.html(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n        <nav class=\"sub-nav\">\n          ", "\n          ", "\n          ", "\n        </nav>\n      "], ["\n        <nav class=\"sub-nav\">\n          ", "\n          ", "\n          ", "\n        </nav>\n      "])), nav_link_1.NavLink({
        text: 'Active',
        target: 'ads/active',
        isActive: options.path[1] === 'active'
      }), nav_link_1.NavLink({
        text: 'Paused',
        target: 'ads/paused',
        isActive: options.path[1] === 'paused'
      }), nav_link_1.NavLink({
        text: 'Create',
        target: 'ads/create',
        isActive: options.path[1] === 'create'
      }));

    case 'answers':
      return lit_html_1.html(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n        <h1>Answers</h1>\n      "], ["\n        <h1>Answers</h1>\n      "])));

    case 'accounts':
      return lit_html_1.html(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n        <nav class=\"sub-nav\">\n          ", "\n          ", "\n          ", "\n        </nav>\n      "], ["\n        <nav class=\"sub-nav\">\n          ", "\n          ", "\n          ", "\n        </nav>\n      "])), nav_link_1.NavLink({
        text: 'Active',
        target: 'accounts/active',
        isActive: options.path[1] === 'active'
      }), nav_link_1.NavLink({
        text: 'Paused',
        target: 'accounts/paused',
        isActive: options.path[1] === 'paused'
      }), nav_link_1.NavLink({
        text: 'Create',
        target: 'accounts/create',
        isActive: options.path[1] === 'create'
      }));
  }
};

var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
},{"lit-html":"../node_modules/lit-html/lit-html.js","./nav-link":"app/templates/components/nav-link.ts"}],"app/templates/components/nav-main.ts":[function(require,module,exports) {
"use strict";

var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", {
      value: raw
    });
  } else {
    cooked.raw = raw;
  }

  return cooked;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var lit_html_1 = require("lit-html");

var nav_link_1 = require("./nav-link");

exports.MainNav = function (options) {
  return lit_html_1.html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    <nav class=\"main-nav\">\n        <h1 class=\"logo\">Accruly</h1>\n        ", "\n        ", "\n        ", "\n        ", "\n      </nav>\n    "], ["\n    <nav class=\"main-nav\">\n        <h1 class=\"logo\">Accruly</h1>\n        ", "\n        ", "\n        ", "\n        ", "\n      </nav>\n    "])), ['admin', 'publisher', 'client'].includes(options.state.user.type) ? nav_link_1.NavLink({
    text: 'Analytics',
    target: 'analytics',
    isActive: options.path[0] === 'analytics'
  }) : '', ['admin', 'client', 'editor'].includes(options.state.user.type) ? nav_link_1.NavLink({
    text: 'Ads',
    target: 'ads/active',
    isActive: options.path[0] === 'ads'
  }) : '', ['admin'].includes(options.state.user.type) ? nav_link_1.NavLink({
    text: 'Answers',
    target: 'answers',
    isActive: options.path[0] === 'answers'
  }) : '', ['admin'].includes(options.state.user.type) ? nav_link_1.NavLink({
    text: 'Accounts',
    target: 'accounts/active',
    isActive: options.path[0] === 'accounts'
  }) : '');
};

var templateObject_1;
},{"lit-html":"../node_modules/lit-html/lit-html.js","./nav-link":"app/templates/components/nav-link.ts"}],"app/template.ts":[function(require,module,exports) {
"use strict";

var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", {
      value: raw
    });
  } else {
    cooked.raw = raw;
  }

  return cooked;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var lit_html_1 = require("lit-html");

var message_1 = require("./lib/message"); // Pages


var ads_1 = require("./templates/pages/ads");

var analytics_1 = require("./templates/pages/analytics");

var answers_1 = require("./templates/pages/answers");

var accounts_1 = require("./templates/pages/accounts");

var login_1 = require("./templates/pages/login");

var recoverpassword_1 = require("./templates/pages/recoverpassword"); // UI Components


var notification_1 = require("./templates/components/notification");

var nav_subnav_1 = require("./templates/components/nav-subnav");

var nav_main_1 = require("./templates/components/nav-main");

var nav_link_1 = require("./templates/components/nav-link");

exports.template = function (state) {
  var currentPath = state.location.split('/');

  switch (currentPath[0]) {
    case 'login':
      return lit_html_1.html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      ", "\n\n      ", ""], ["\n      ", "\n\n      ", ""])), state.latestNotification !== '' ? notification_1.Notification({
        description: state.latestNotification
      }) : '', login_1.Login());

    case 'recoverpassword':
      return lit_html_1.html(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n        ", "\n\n        ", "\n      "], ["\n        ", "\n\n        ", "\n      "])), state.latestNotification !== '' ? notification_1.Notification({
        description: state.latestNotification
      }) : '', recoverpassword_1.RecoverPassword());

    default:
      return lit_html_1.html(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n        ", "\n\n        <main class=\"main-content\">\n          <section class=\"user-menu\">\n            Welcome back, <strong>", "</strong>.\n\n            <nav class=\"user-options\">\n              ", "\n              <a @click=", ">Log Out</a>\n            </nav>\n          </section>\n\n          <container>\n            ", "\n\n            ", "\n\n            ", "\n          </container>\n        </main>\n      "], ["\n        ", "\n\n        <main class=\"main-content\">\n          <section class=\"user-menu\">\n            Welcome back, <strong>", "</strong>.\n\n            <nav class=\"user-options\">\n              ", "\n              <a @click=", ">Log Out</a>\n            </nav>\n          </section>\n\n          <container>\n            ", "\n\n            ", "\n\n            ", "\n          </container>\n        </main>\n      "])), nav_main_1.MainNav({
        path: currentPath,
        state: state
      }), state.user.name, nav_link_1.NavLink({
        text: 'Settings',
        target: 'settings',
        isActive: state.location === 'settings'
      }), function () {
        return message_1.send('logout');
      }, state.latestNotification ? notification_1.Notification({
        description: state.latestNotification
      }) : '', nav_subnav_1.SubNav({
        path: currentPath
      }), MainContent({
        path: currentPath,
        state: state
      }));
  }
}; // Main content


var MainContent = function MainContent(options) {
  switch (options.path[0]) {
    case 'analytics':
      return analytics_1.Analytics(options);

    case 'ads':
      switch (options.path[1]) {
        case 'active':
          return ads_1.ActiveAds(options);

        case 'paused':
          return ads_1.PausedAds(options);

        case 'create':
          return ads_1.CreateAd(options);
      }

    case 'answers':
      return answers_1.Answers(options);

    case 'accounts':
      switch (options.path[1]) {
        case 'active':
          return accounts_1.ActiveAccounts(options);

        case 'paused':
          return accounts_1.PausedAccounts(options);

        case 'create':
          return accounts_1.CreateAccount(options);
      }

    case 'settings':
      return accounts_1.AccountSettings(options);
  }
};

var templateObject_1, templateObject_2, templateObject_3;
},{"lit-html":"../node_modules/lit-html/lit-html.js","./lib/message":"app/lib/message.ts","./templates/pages/ads":"app/templates/pages/ads.ts","./templates/pages/analytics":"app/templates/pages/analytics.ts","./templates/pages/answers":"app/templates/pages/answers.ts","./templates/pages/accounts":"app/templates/pages/accounts.ts","./templates/pages/login":"app/templates/pages/login.ts","./templates/pages/recoverpassword":"app/templates/pages/recoverpassword.ts","./templates/components/notification":"app/templates/components/notification.ts","./templates/components/nav-subnav":"app/templates/components/nav-subnav.ts","./templates/components/nav-main":"app/templates/components/nav-main.ts","./templates/components/nav-link":"app/templates/components/nav-link.ts"}],"../node_modules/axios/lib/helpers/bind.js":[function(require,module,exports) {
'use strict';

module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};

},{}],"../node_modules/axios/node_modules/is-buffer/index.js":[function(require,module,exports) {
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
module.exports = function isBuffer(obj) {
  return obj != null && obj.constructor != null && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj);
};
},{}],"../node_modules/axios/lib/utils.js":[function(require,module,exports) {
'use strict';

var bind = require('./helpers/bind');
var isBuffer = require('is-buffer');

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Function equal to merge with the difference being that no reference
 * to original objects is kept.
 *
 * @see merge
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function deepMerge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = deepMerge(result[key], val);
    } else if (typeof val === 'object') {
      result[key] = deepMerge({}, val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  deepMerge: deepMerge,
  extend: extend,
  trim: trim
};

},{"./helpers/bind":"../node_modules/axios/lib/helpers/bind.js","is-buffer":"../node_modules/axios/node_modules/is-buffer/index.js"}],"../node_modules/axios/lib/helpers/buildURL.js":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

},{"./../utils":"../node_modules/axios/lib/utils.js"}],"../node_modules/axios/lib/core/InterceptorManager.js":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;

},{"./../utils":"../node_modules/axios/lib/utils.js"}],"../node_modules/axios/lib/core/transformData.js":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};

},{"./../utils":"../node_modules/axios/lib/utils.js"}],"../node_modules/axios/lib/cancel/isCancel.js":[function(require,module,exports) {
'use strict';

module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

},{}],"../node_modules/axios/lib/helpers/normalizeHeaderName.js":[function(require,module,exports) {
'use strict';

var utils = require('../utils');

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

},{"../utils":"../node_modules/axios/lib/utils.js"}],"../node_modules/axios/lib/core/enhanceError.js":[function(require,module,exports) {
'use strict';

/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};

},{}],"../node_modules/axios/lib/core/createError.js":[function(require,module,exports) {
'use strict';

var enhanceError = require('./enhanceError');

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};

},{"./enhanceError":"../node_modules/axios/lib/core/enhanceError.js"}],"../node_modules/axios/lib/core/settle.js":[function(require,module,exports) {
'use strict';

var createError = require('./createError');

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};

},{"./createError":"../node_modules/axios/lib/core/createError.js"}],"../node_modules/axios/lib/helpers/parseHeaders.js":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};

},{"./../utils":"../node_modules/axios/lib/utils.js"}],"../node_modules/axios/lib/helpers/isURLSameOrigin.js":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);

},{"./../utils":"../node_modules/axios/lib/utils.js"}],"../node_modules/axios/lib/helpers/cookies.js":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);

},{"./../utils":"../node_modules/axios/lib/utils.js"}],"../node_modules/axios/lib/adapters/xhr.js":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');
var settle = require('./../core/settle');
var buildURL = require('./../helpers/buildURL');
var parseHeaders = require('./../helpers/parseHeaders');
var isURLSameOrigin = require('./../helpers/isURLSameOrigin');
var createError = require('../core/createError');

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = require('./../helpers/cookies');

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (config.withCredentials) {
      request.withCredentials = true;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};

},{"./../utils":"../node_modules/axios/lib/utils.js","./../core/settle":"../node_modules/axios/lib/core/settle.js","./../helpers/buildURL":"../node_modules/axios/lib/helpers/buildURL.js","./../helpers/parseHeaders":"../node_modules/axios/lib/helpers/parseHeaders.js","./../helpers/isURLSameOrigin":"../node_modules/axios/lib/helpers/isURLSameOrigin.js","../core/createError":"../node_modules/axios/lib/core/createError.js","./../helpers/cookies":"../node_modules/axios/lib/helpers/cookies.js"}],"C:/Users/pallav/AppData/Roaming/npm/node_modules/parcel/node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"../node_modules/axios/lib/defaults.js":[function(require,module,exports) {
var process = require("process");
'use strict';

var utils = require('./utils');
var normalizeHeaderName = require('./helpers/normalizeHeaderName');

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  // Only Node.JS has a process variable that is of [[Class]] process
  if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = require('./adapters/http');
  } else if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = require('./adapters/xhr');
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

},{"./utils":"../node_modules/axios/lib/utils.js","./helpers/normalizeHeaderName":"../node_modules/axios/lib/helpers/normalizeHeaderName.js","./adapters/http":"../node_modules/axios/lib/adapters/xhr.js","./adapters/xhr":"../node_modules/axios/lib/adapters/xhr.js","process":"C:/Users/pallav/AppData/Roaming/npm/node_modules/parcel/node_modules/process/browser.js"}],"../node_modules/axios/lib/helpers/isAbsoluteURL.js":[function(require,module,exports) {
'use strict';

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};

},{}],"../node_modules/axios/lib/helpers/combineURLs.js":[function(require,module,exports) {
'use strict';

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};

},{}],"../node_modules/axios/lib/core/dispatchRequest.js":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');
var transformData = require('./transformData');
var isCancel = require('../cancel/isCancel');
var defaults = require('../defaults');
var isAbsoluteURL = require('./../helpers/isAbsoluteURL');
var combineURLs = require('./../helpers/combineURLs');

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};

},{"./../utils":"../node_modules/axios/lib/utils.js","./transformData":"../node_modules/axios/lib/core/transformData.js","../cancel/isCancel":"../node_modules/axios/lib/cancel/isCancel.js","../defaults":"../node_modules/axios/lib/defaults.js","./../helpers/isAbsoluteURL":"../node_modules/axios/lib/helpers/isAbsoluteURL.js","./../helpers/combineURLs":"../node_modules/axios/lib/helpers/combineURLs.js"}],"../node_modules/axios/lib/core/mergeConfig.js":[function(require,module,exports) {
'use strict';

var utils = require('../utils');

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  utils.forEach(['url', 'method', 'params', 'data'], function valueFromConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    }
  });

  utils.forEach(['headers', 'auth', 'proxy'], function mergeDeepProperties(prop) {
    if (utils.isObject(config2[prop])) {
      config[prop] = utils.deepMerge(config1[prop], config2[prop]);
    } else if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (utils.isObject(config1[prop])) {
      config[prop] = utils.deepMerge(config1[prop]);
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  utils.forEach([
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'maxContentLength',
    'validateStatus', 'maxRedirects', 'httpAgent', 'httpsAgent', 'cancelToken',
    'socketPath'
  ], function defaultToConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  return config;
};

},{"../utils":"../node_modules/axios/lib/utils.js"}],"../node_modules/axios/lib/core/Axios.js":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');
var buildURL = require('../helpers/buildURL');
var InterceptorManager = require('./InterceptorManager');
var dispatchRequest = require('./dispatchRequest');
var mergeConfig = require('./mergeConfig');

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);
  config.method = config.method ? config.method.toLowerCase() : 'get';

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;

},{"./../utils":"../node_modules/axios/lib/utils.js","../helpers/buildURL":"../node_modules/axios/lib/helpers/buildURL.js","./InterceptorManager":"../node_modules/axios/lib/core/InterceptorManager.js","./dispatchRequest":"../node_modules/axios/lib/core/dispatchRequest.js","./mergeConfig":"../node_modules/axios/lib/core/mergeConfig.js"}],"../node_modules/axios/lib/cancel/Cancel.js":[function(require,module,exports) {
'use strict';

/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;

},{}],"../node_modules/axios/lib/cancel/CancelToken.js":[function(require,module,exports) {
'use strict';

var Cancel = require('./Cancel');

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;

},{"./Cancel":"../node_modules/axios/lib/cancel/Cancel.js"}],"../node_modules/axios/lib/helpers/spread.js":[function(require,module,exports) {
'use strict';

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

},{}],"../node_modules/axios/lib/axios.js":[function(require,module,exports) {
'use strict';

var utils = require('./utils');
var bind = require('./helpers/bind');
var Axios = require('./core/Axios');
var mergeConfig = require('./core/mergeConfig');
var defaults = require('./defaults');

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = require('./helpers/spread');

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;

},{"./utils":"../node_modules/axios/lib/utils.js","./helpers/bind":"../node_modules/axios/lib/helpers/bind.js","./core/Axios":"../node_modules/axios/lib/core/Axios.js","./core/mergeConfig":"../node_modules/axios/lib/core/mergeConfig.js","./defaults":"../node_modules/axios/lib/defaults.js","./cancel/Cancel":"../node_modules/axios/lib/cancel/Cancel.js","./cancel/CancelToken":"../node_modules/axios/lib/cancel/CancelToken.js","./cancel/isCancel":"../node_modules/axios/lib/cancel/isCancel.js","./helpers/spread":"../node_modules/axios/lib/helpers/spread.js"}],"../node_modules/axios/index.js":[function(require,module,exports) {
module.exports = require('./lib/axios');
},{"./lib/axios":"../node_modules/axios/lib/axios.js"}],"app/actions.ts":[function(require,module,exports) {
"use strict";

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var axios_1 = __importDefault(require("axios")); // @ts-ignore


var apiURL = "development" === 'development' ? 'http://localhost:4000/' : 'http://51.15.131.96:30627/';
var strongPassword = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"); // When we receive a 'someMsg' message we take the data of the message and the state
// Then we return a new state after doing some computations

exports.actions = {
  'init': function init() {
    return __awaiter(void 0, void 0, void 0, function () {
      var currentUser, isSessionActive, ads, _a, answers, _b, accounts, _c;

      return __generator(this, function (_d) {
        switch (_d.label) {
          case 0:
            return [4
            /*yield*/
            , function () {
              return __awaiter(void 0, void 0, void 0, function () {
                var e_1;
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      _a.trys.push([0, 2,, 3]);

                      return [4
                      /*yield*/
                      , axios_1.default({
                        method: 'get',
                        url: apiURL + 'user/login',
                        withCredentials: true
                      })];

                    case 1:
                      return [2
                      /*return*/
                      , _a.sent().data];

                    case 2:
                      e_1 = _a.sent();
                      console.error('There is an error when trying to log in');
                      return [2
                      /*return*/
                      , {
                        session: '',
                        type: '',
                        _id: ''
                      }];

                    case 3:
                      return [2
                      /*return*/
                      ];
                  }
                });
              });
            }()];

          case 1:
            currentUser = _d.sent();
            isSessionActive = currentUser.session !== '';
            if (!(isSessionActive && ['admin'].includes(currentUser.type))) return [3
            /*break*/
            , 3];
            return [4
            /*yield*/
            , axios_1.default({
              method: 'get',
              url: apiURL + 'ad/all',
              withCredentials: true
            })];

          case 2:
            _a = _d.sent().data;
            return [3
            /*break*/
            , 4];

          case 3:
            _a = [];
            _d.label = 4;

          case 4:
            ads = _a;
            if (!(isSessionActive && ['admin'].includes(currentUser.type))) return [3
            /*break*/
            , 6];
            return [4
            /*yield*/
            , axios_1.default({
              method: 'get',
              url: apiURL + 'answer',
              withCredentials: true
            })];

          case 5:
            _b = _d.sent().data;
            return [3
            /*break*/
            , 7];

          case 6:
            _b = [];
            _d.label = 7;

          case 7:
            answers = _b;
            if (!(isSessionActive && ['admin'].includes(currentUser.type))) return [3
            /*break*/
            , 9];
            return [4
            /*yield*/
            , axios_1.default({
              method: 'get',
              url: apiURL + 'user',
              withCredentials: true
            })];

          case 8:
            _c = _d.sent().data;
            return [3
            /*break*/
            , 10];

          case 9:
            _c = [];
            _d.label = 10;

          case 10:
            accounts = _c;
            return [2
            /*return*/
            , {
              latestNotification: '',
              location: isSessionActive ? 'ads/active' : 'login',
              user: currentUser,
              newLogin: {
                email: '',
                password: ''
              },
              ads: ads,
              answers: answers,
              accounts: accounts,
              newAccount: {
                email: '',
                password: '',
                name: '',
                type: 'admin',
                status: 'active',
                timezone: '',
                exclusiveTo: ''
              },
              updateAccount: {},
              newAd: {
                question: 'Write your question here',
                video: '',
                minWidth: '',
                minHeight: '',
                banner: '',
                logo: '',
                startsAt: 5,
                canSkip: false,
                type: 'multiple',
                options: [],
                correctAnswer: 1
              },
              updateAd: {}
            }];
        }
      });
    });
  },
  // Here we include all the other action names
  'changeLocation': function changeLocation(msg, state) {
    var newLocation = msg.detail.target; // Hide all ad editors

    document.querySelectorAll('.ad-editor-container').forEach(function (ad) {
      ;
      ad.style.display = 'none';
    }); // Merge the data with the state and return it

    return __assign(__assign({}, state), {
      location: newLocation
    });
  },
  // Update the new add state with the new data
  'newAdField': function newAdField(msg, state) {
    state.newAd[msg.detail.field] = msg.detail.value;
    return state;
  },
  'newAdFieldOption': function newAdFieldOption(msg, state) {
    state.newAd.options[msg.detail.field] = msg.detail.value;
    return state;
  },
  // Update the new add state with the new data
  'updateAdField': function updateAdField(msg, state) {
    return __assign(__assign({}, state), {
      updateAd: __assign(__assign({}, state.updateAd), msg.detail)
    });
  },
  'createAd': function createAd(msg, state) {
    return __awaiter(void 0, void 0, void 0, function () {
      var response;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , axios_1.default({
              method: 'post',
              url: apiURL + 'ad',
              data: state.newAd,
              headers: {
                'content-type': 'application/json'
              },
              withCredentials: true
            })];

          case 1:
            response = _a.sent().data; // Add the new ad to the state

            state.ads.unshift(response); // Send a notification about the added ad

            state.latestNotification = 'The ad was published'; // Change page

            state.location = 'ads/paused'; // Reset all the newAd fields

            state.newAd = {
              question: 'Write your question here',
              video: '',
              minWidth: '',
              minHeight: '',
              banner: '',
              logo: '',
              startsAt: 5,
              canSkip: false,
              option1: 'Option 1',
              option2: 'Option 2',
              option3: 'Option 3',
              option4: 'Option 4',
              correctAnswer: 1
            }; // Update state

            return [2
            /*return*/
            , state];
        }
      });
    });
  },
  'removeNotification': function removeNotification(msg, state) {
    state.latestNotification = false;
    return state;
  },
  'removeAd': function removeAd(msg, state) {
    return __awaiter(void 0, void 0, void 0, function () {
      var newState;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            ;
            return [4
            /*yield*/
            , axios_1.default({
              method: 'delete',
              url: apiURL + 'ad',
              params: {
                _id: msg.detail._id
              },
              headers: {
                'content-type': 'application/json'
              },
              withCredentials: true
            })];

          case 1:
            _a.sent().data;
            newState = __assign(__assign({}, state), {
              ads: state.ads.filter(function (ad) {
                return msg.detail._id !== ad._id;
              }),
              latestNotification: 'The ad was removed'
            });
            return [2
            /*return*/
            , newState];
        }
      });
    });
  },
  'updateAd': function updateAd(msg, state) {
    return __awaiter(void 0, void 0, void 0, function () {
      var updated, indexOfUpdate;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , axios_1.default({
              method: 'put',
              url: apiURL + 'ad',
              params: {
                _id: msg.detail._id
              },
              data: state.updateAd,
              headers: {
                'content-type': 'application/json'
              },
              withCredentials: true
            })];

          case 1:
            updated = _a.sent().data; // Send a notification about the updated ad

            state.latestNotification = 'The ad was updated';
            indexOfUpdate = state.ads.findIndex(function (ad) {
              return ad._id === msg.detail._id;
            });
            state.ads[indexOfUpdate] = updated;
            document.querySelector('#id' + msg.detail._id).style.display = 'none'; // Restore the defaults of the update ad state

            state.updateAd = {};
            return [2
            /*return*/
            , state];
        }
      });
    });
  },
  'publishAd': function publishAd(msg, state) {
    return __awaiter(void 0, void 0, void 0, function () {
      var publishedAd;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , axios_1.default({
              method: 'put',
              url: apiURL + 'ad',
              params: {
                _id: msg.detail._id
              },
              data: {
                status: 'active'
              },
              headers: {
                'content-type': 'application/json'
              },
              withCredentials: true
            })];

          case 1:
            // Send the data to the API
            _a.sent().data;
            publishedAd = state.ads.findIndex(function (ad) {
              return ad._id === msg.detail._id;
            });
            state.ads[publishedAd].status = 'active';
            state.location = 'ads/active'; // Send a notification about the published ad

            state.latestNotification = 'The ad was published';
            document.querySelector('#id' + msg.detail._id).style.display = 'none';
            return [2
            /*return*/
            , state];
        }
      });
    });
  },
  'unpublishAd': function unpublishAd(msg, state) {
    return __awaiter(void 0, void 0, void 0, function () {
      var publishedAd;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , axios_1.default({
              method: 'put',
              url: apiURL + 'ad',
              params: {
                _id: msg.detail._id
              },
              data: {
                status: 'paused'
              },
              headers: {
                'content-type': 'application/json'
              },
              withCredentials: true
            })];

          case 1:
            // Send the data to the API
            _a.sent().data;
            publishedAd = state.ads.findIndex(function (ad) {
              return ad._id === msg.detail._id;
            });
            state.ads[publishedAd].status = 'paused';
            state.location = 'ads/paused'; // Send a notification about the published ad

            state.latestNotification = 'The ad was unpublished';
            document.querySelector('#id' + msg.detail._id).style.display = 'none';
            return [2
            /*return*/
            , state];
        }
      });
    });
  },
  'getFullAnswer': function getFullAnswer(msg, state) {
    var answerDetails = document.querySelector('#ID' + msg.detail._id);

    if (answerDetails.style.display === 'none') {
      answerDetails.style.display = 'block';
    } else {
      answerDetails.style.display = 'none';
    }

    return state;
  },
  'uploadNewAdFile': function uploadNewAdFile(msg, state) {
    return __awaiter(void 0, void 0, void 0, function () {
      var filename;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , axios_1.default({
              url: apiURL + 'file',
              method: 'POST',
              data: msg.detail.content,
              onUploadProgress: function onUploadProgress(p) {
                document.querySelector('.video-upload-progress').value = p.loaded / p.total * 100;
              },
              withCredentials: true
            })];

          case 1:
            filename = _a.sent().data; // Put the URL in the state

            state.newAd[msg.detail.name] = apiURL + 'file?file=' + filename;
            return [2
            /*return*/
            , state];
        }
      });
    });
  },
  uploadUpdateAdFile: function uploadUpdateAdFile(msg, state) {
    return __awaiter(void 0, void 0, void 0, function () {
      var filename;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , fetch(apiURL + 'fileupload', {
              method: 'POST',
              body: msg.detail.content
            })];

          case 1:
            return [4
            /*yield*/
            , _a.sent().json() // Put the URL in the state
            ];

          case 2:
            filename = _a.sent(); // Put the URL in the state

            state.updateAd[msg.detail.name] = apiURL + 'getfile?file=' + filename;
            return [2
            /*return*/
            , state];
        }
      });
    });
  },
  newLogin: function newLogin(msg, state) {
    state.newLogin[msg.detail.field] = msg.detail.value;
    return state;
  },
  login: function login(msg, state) {
    return __awaiter(void 0, void 0, void 0, function () {
      var e_2;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2,, 3]);

            return [4
            /*yield*/
            , axios_1.default({
              method: 'POST',
              url: apiURL + 'user/login',
              data: {
                email: state.newLogin.email,
                password: state.newLogin.password
              },
              headers: {
                'content-type': 'application/json'
              },
              withCredentials: true
            })];

          case 1:
            _a.sent();

            state.location = 'ads/active';
            state.latestNotification = '';
            state.newLogin = {
              email: '',
              password: ''
            };
            return [3
            /*break*/
            , 3];

          case 2:
            e_2 = _a.sent();

            if (e_2.response.status === 401) {
              state.latestNotification = 'The email or password is incorrect';
            } else {
              state.latestNotification = 'Unknown server error';
            }

            return [3
            /*break*/
            , 3];

          case 3:
            return [2
            /*return*/
            , state];
        }
      });
    });
  },
  'removeAccount': function removeAccount(msg, state) {
    return __awaiter(void 0, void 0, void 0, function () {
      var newState;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            ;
            return [4
            /*yield*/
            , axios_1.default({
              method: 'delete',
              url: apiURL + 'user',
              params: {
                _id: msg.detail._id
              },
              headers: {
                'content-type': 'application/json'
              },
              withCredentials: true
            })];

          case 1:
            _a.sent().data;
            newState = __assign(__assign({}, state), {
              accounts: state.accounts.filter(function (account) {
                return msg.detail._id !== account._id;
              }),
              latestNotification: 'The account was removed'
            });
            return [2
            /*return*/
            , newState];
        }
      });
    });
  },
  updateAccountField: function updateAccountField(msg, state) {
    state.updateAccount[msg.detail.name] = msg.detail.value;
    return state;
  },
  newAccountField: function newAccountField(msg, state) {
    state.newAccount[msg.detail.name] = msg.detail.value;

    if (msg.detail.name === 'password') {
      if (!strongPassword.test(msg.detail.value)) {
        state.latestNotification = 'Password not strong enough';
        document.querySelector('#createaccountbutton').style.display = 'none';
      } else {
        state.latestNotification = '';
        document.querySelector('#createaccountbutton').style.display = 'block';
      }
    }

    return state;
  },
  createAccount: function createAccount(msg, state) {
    return __awaiter(void 0, void 0, void 0, function () {
      var response;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , axios_1.default({
              method: 'post',
              url: apiURL + 'user',
              data: state.newAccount,
              headers: {
                'content-type': 'application/json'
              },
              withCredentials: true
            })];

          case 1:
            response = _a.sent().data;
            console.log(response); // Add the new ad to the state

            state.accounts.unshift(response); // Send a notification about the added ad

            state.latestNotification = 'The user account was created'; // Change page

            state.location = 'accounts/active';
            console.log(state); // Reset all the newAd fields

            state.newAccount = {
              email: '',
              password: '',
              name: '',
              type: 'admin',
              status: 'active',
              timezone: '',
              exclusiveTo: ''
            }; // Update state

            return [2
            /*return*/
            , state];
        }
      });
    });
  },
  updateAccount: function updateAccount(msg, state) {
    return __awaiter(void 0, void 0, void 0, function () {
      var updated, indexOfUpdate;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , axios_1.default({
              method: 'put',
              url: apiURL + 'user',
              params: {
                _id: msg.detail._id
              },
              data: state.updateAccount,
              headers: {
                'content-type': 'application/json'
              },
              withCredentials: true
            })];

          case 1:
            updated = _a.sent().data; // Send a notification about the updated ad

            state.latestNotification = 'The account was updated';
            indexOfUpdate = state.accounts.findIndex(function (account) {
              return account._id === msg.detail._id;
            });
            state.accounts[indexOfUpdate] = updated; // Hide the editor if not editing oneself data

            if (state.location !== 'settings') {
              ;
              document.querySelector('#id' + msg.detail._id).style.display = 'none';
            } // Restore the defaults of the update ad state


            state.updateAccount = {};
            return [2
            /*return*/
            , state];
        }
      });
    });
  },
  'logout': function logout(msg, state) {
    return __awaiter(void 0, void 0, void 0, function () {
      var e_3;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2,, 3]);

            return [4
            /*yield*/
            , axios_1.default({
              method: 'delete',
              url: apiURL + 'user/logout',
              withCredentials: true
            })];

          case 1:
            _a.sent();

            state.location = 'login';
            state.latestNotification = '';
            return [3
            /*break*/
            , 3];

          case 2:
            e_3 = _a.sent();
            state.latestNotification = 'Error trying to log out';
            return [3
            /*break*/
            , 3];

          case 3:
            return [2
            /*return*/
            , state];
        }
      });
    });
  },
  activateAccount: function activateAccount(msg, state) {
    return __awaiter(void 0, void 0, void 0, function () {
      var activatedAccount;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , axios_1.default({
              method: 'put',
              url: apiURL + 'user',
              params: {
                _id: msg.detail._id
              },
              data: {
                status: 'active'
              },
              headers: {
                'content-type': 'application/json'
              },
              withCredentials: true
            })];

          case 1:
            // Send the data to the API
            _a.sent().data;
            activatedAccount = state.accounts.findIndex(function (account) {
              return account._id === msg.detail._id;
            });
            state.accounts[activatedAccount].status = 'active';
            state.location = 'accounts/active'; // Send a notification about the published ad

            state.latestNotification = 'The account was activated';
            document.querySelector('#id' + msg.detail._id).style.display = 'none';
            return [2
            /*return*/
            , state];
        }
      });
    });
  },
  deactivateAccount: function deactivateAccount(msg, state) {
    return __awaiter(void 0, void 0, void 0, function () {
      var deactivatedAccount;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , axios_1.default({
              method: 'put',
              url: apiURL + 'user',
              params: {
                _id: msg.detail._id
              },
              data: {
                status: 'paused'
              },
              headers: {
                'content-type': 'application/json'
              },
              withCredentials: true
            })];

          case 1:
            // Send the data to the API
            _a.sent().data;
            deactivatedAccount = state.accounts.findIndex(function (account) {
              return account._id === msg.detail._id;
            });
            state.accounts[deactivatedAccount].status = 'paused';
            state.location = 'accounts/paused';
            return [4
            /*yield*/
            , axios_1.default({
              method: 'put',
              url: apiURL + 'ad',
              params: {
                client_id: state.msg.detail._id
              },
              data: {
                status: 'client paused'
              },
              headers: {
                'content-type': 'application/json'
              },
              withCredentials: true
            })];

          case 2:
            _a.sent(); // Send a notification about the published ad


            state.latestNotification = 'The account was paused';
            document.querySelector('#id' + msg.detail._id).style.display = 'none';
            return [2
            /*return*/
            , state];
        }
      });
    });
  },
  'recoverpassword': function recoverpassword(msg, state) {
    // Send the password to the email in the field
    try {
      axios_1.default({
        method: 'post',
        url: apiURL + 'recovery',
        headers: {
          'content-type': 'application/json'
        },
        data: {
          email: state.newLogin.email
        }
      });
      state.latestNotification = 'Account recovery link was sent to ' + state.newLogin.email;
    } catch (e) {
      state.latestNotification = 'There was an error trying to recover this account.';
    }

    return state;
  }
};
},{"axios":"../node_modules/axios/index.js"}],"app/main.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var lit_html_1 = require("lit-html");

var template_1 = require("./template");

var actions_1 = require("./actions");

(function () {
  return __awaiter(void 0, void 0, void 0, function () {
    var state, _loop_1, action;

    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , actions_1.actions.init() // Render the main template with the initial state
          ];

        case 1:
          state = _a.sent(); // Render the main template with the initial state

          lit_html_1.render(template_1.template(state), document.body);

          _loop_1 = function _loop_1(action) {
            document.addEventListener(action, function (e) {
              return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      return [4
                      /*yield*/
                      , actions_1.actions[action](e, state)];

                    case 1:
                      // Get the data from the action by passing the event data to it
                      // The new state will be the same as the old state if the action
                      // doesn't return anything
                      state = _a.sent() || state;
                      if (!(action === 'login' && state.latestNotification === '')) return [3
                      /*break*/
                      , 3];
                      return [4
                      /*yield*/
                      , actions_1.actions.init()];

                    case 2:
                      state = _a.sent();
                      _a.label = 3;

                    case 3:
                      console.log(state); // Render the template again

                      lit_html_1.render(template_1.template(state), document.body);
                      return [2
                      /*return*/
                      ];
                  }
                });
              });
            });
          }; // Actions handler
          // Here we take all the actions and attach an event to trigger
          // them. Once the action is performed it will return a new state,
          // that data is then merged to the current state and then
          // passed to the template function and rendered again


          for (action in actions_1.actions) {
            _loop_1(action);
          }

          return [2
          /*return*/
          ];
      }
    });
  });
})();
},{"lit-html":"../node_modules/lit-html/lit-html.js","./template":"app/template.ts","./actions":"app/actions.ts"}],"C:/Users/pallav/AppData/Roaming/npm/node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "49186" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["C:/Users/pallav/AppData/Roaming/npm/node_modules/parcel/src/builtins/hmr-runtime.js","app/main.ts"], null)
//# sourceMappingURL=/main.183d4128.js.map