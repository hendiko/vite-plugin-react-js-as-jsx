/*
 * @Author: Xavier Yin
 * @Date: 2022-08-18 11:36:32
 * @Description:
 */
import babelCore from "@babel/core";

const isRegexp = (any) => any instanceof RegExp;
const isFunction = (any) => typeof any === "function";

const makeMatch = (rule) =>
  isRegexp(rule)
    ? (str) => rule.test(str)
    : isFunction(rule)
    ? (str) => !!rule(str)
    : (str) => str.indexOf(rule) >= 0;

/**
 *
 * @param {array} babelPlugins
 * @param {object} options
 * - jsxInject {boolean}: inject statement "import React from 'react'" or not. Default is true.
 * - match {regexp|function|string}: determine file if it should be processed by this plugin.
 * - include: {Array<regexp|string>}: the rules to tell which file needs to be processed. This is prior to exclude rules.
 * - exclude: {Array<regexp|string>}: the rules to tell which file should not be processed.
 * @returns
 */
function vitePluginReactJsAsJsx(babelPlugins, options) {
  const {
    exclude = [],
    jsxInject = true,
    ignoreNodeModules = true, // default to ignore node_modules directory
    include = [],
    rule = /\.(js|ts)$/,
  } = options || {};

  const canMatch = makeMatch(rule);

  const includes = (include || []).map((item) => makeMatch(item));
  const excludes = (exclude || []).map((item) => makeMatch(item));

  if (ignoreNodeModules) {
    excludes.unshift(makeMatch("node_modules"));
  }

  // include rules are prior to exclude rules
  const canInclude = (str) =>
    includes.some((fn) => fn(str)) || !excludes.some((fn) => fn(str));

  return {
    name: "vite-plugin-react-js-as-jsx",
    transform(source, id) {
      if (canMatch(id) && canInclude(id)) {
        if (
          jsxInject &&
          source.indexOf("import React") === -1 &&
          source.indexOf('from "react"') === -1 &&
          source.indexOf("from 'react'") === -1
        ) {
          source = 'import React from "react"; \n' + source;
        }
        const plugins = Array.isArray(babelPlugins) ? babelPlugins : [];
        return {
          code: compileFileToJS(source, plugins),
          map: null, // provide source map if available
        };
      }
    },
  };
}

function compileFileToJS(source, plugins) {
  const result = babelCore.transformSync(source, {
    plugins: ["@babel/plugin-transform-react-jsx", ...plugins],
  });
  return result.code;
}

module.exports = vitePluginReactJsAsJsx;
