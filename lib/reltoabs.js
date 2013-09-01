/*
 * relTOabs
 * https://github.com/claydiffrient/reltoabs
 *
 * Copyright (c) 2013 Clay Diffrient
 * Licensed under the MIT license.
 *
 * Special thanks to Rob W. at http://stackoverflow.com/questions/7544550/javascript-regex-to-change-all-relative-urls-to-absolute
 * for the inspiration.
 */

'use strict';

var fs = require('fs');
var _ = require('underscore');

/**
 * Determines if the given string is an absolute reference.
 * @param  {String}  url The url to check.
 * @return {Boolean}     true, if the reference is absolute.
 */
function isAbsolute (url)
{
   //Check for common patterns at the beginning.
   return (/^(https?|file|ftps?|mailto|javascript|data:image\/[^;]{2,9};):/i.test(url));
}

/**
 * Opens a file in the filesystem returning its data.
 * @param  {String} filePath The path to the file.
 * @return {String}          The content of the file.
 */
function openFile (filePath) {
   return fs.readFileSync(filePath, { encoding: "utf8"});
}

/**
 * Finds all href attributes in an html file.
 * @param  {String} content The text of an html document
 * @param {Function} filter Optional filter to run before returning.
 * @return {Array}         An array containing all the references.
 */
function findAllHrefs (content, filter) {
   var matches = content.match(/href="([^\'\"]+)/g);
   if (_.isFunction(filter)) {
      return filter(matches);
   }
   return matches;
}

/**
 * Removes the "href=" from the beginning of an href= attribute.
 * @param  {String} href Complete href attribute and value
 * @return {String}      Url from the href attribute.
 */
function removeHref (href) {
   return href.replace("href=\"", "");
}

/**
 * Returns all relative links found in hrefs.
 * @param  {Array} hrefs Href attributes to filter
 * @return {Array}       Urls for relative hrefs
 */
function relativeFilter(hrefs) {
   if (!_.isArray(hrefs)) {
      throw new Error("hrefs must be an array.");
   }

   //Get rid of the href on the urls.
   var urls = _.map(hrefs, removeHref);

   return  _.filter(urls, function (href) {
      return (!isAbsolute(href));
   });
}

/**
 * Returns all the relative links in a given content string.
 * @param  {String} content HTML to parse for href attributes
 * @return {Array}         Contains all relative urls found.
 */
function findRelatives (content) {
   return findAllHrefs(content, relativeFilter);
}

/**
 * Converts a given array into absolute urls with the given baseUrl.
 * @param  {Array} relativeUrls Relative URLs to change.
 * @param  {String} baseUrl      The base url to make it absolute to.
 * @return {Array}              All the absolute URLs
 */
function convertRelToAbs (relativeUrls, baseUrl) {
   return _.map(relativeUrls, function (url) {
      return baseUrl + "/" + url;
   });
}


exports.convertRelToAbs = convertRelToAbs;
exports.removeHref = removeHref;
exports.isAbsolute = isAbsolute;
exports.openFile = openFile;
exports.findAllHrefs = findAllHrefs;
exports.relativeFilter = relativeFilter;
exports.findRelatives = findRelatives;
