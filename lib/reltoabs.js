/*
 * relTOabs
 * https://github.com/claydiffrient/reltoabs
 *
 * Copyright (c) 2013 Clay Diffrient
 * Licensed under the MIT license.
 *
 */

'use strict';

var fs = require('fs');
var url = require('url');
var _ = require('underscore');

var app = {};



/**
 * Determines if the given string is an absolute reference.
 * @param  {String}  url The url to check.
 * @return {Boolean}     true, if the reference is absolute.
 */
app.isAbsolute = function (url)
{
   //Check for common patterns at the beginning.
   return (/^(https?|file|ftps?|mailto|javascript|data:image\/[^;]{2,9};):/i.test(url));
};

/**
 * Opens a file in the filesystem returning its data.
 * @param  {String} filePath The path to the file.
 * @return {String}          The content of the file.
 */
app.openFile = function (filePath) {
   return fs.readFileSync(filePath, 'utf8');
};

/**
 * Finds all href attributes in an html file.
 * @param  {String} content The text of an html document
 * @param {Function} filter Optional filter to run before returning.
 * @return {Array}         An array containing all the references.
 */
app.findAllHrefs = function (content, filter) {
   var matches = content.match(/href="([^\'\"]+)/g);
   if (_.isFunction(filter)) {
      return filter(matches);
   }
   return matches;
};

/**
 * Removes the "href=" from the beginning of an href= attribute.
 * @param  {String} href Complete href attribute and value
 * @return {String}      Url from the href attribute.
 */
app.removeHref = function (href) {
   return href.replace("href=\"", "");
};

/**
 * Returns all relative links found in hrefs.
 * @param  {Array} hrefs Href attributes to filter
 * @return {Array}       Urls for relative hrefs
 */
app.relativeFilter =function (hrefs) {
   if (!_.isArray(hrefs)) {
      throw new Error("hrefs must be an array.");
   }

   //Get rid of the href on the urls.
   var urls = _.map(hrefs, app.removeHref);

   return  _.filter(urls, function (href) {
      return (!app.isAbsolute(href));
   });
};

/**
 * Returns all the relative links in a given content string.
 * @param  {String} content HTML to parse for href attributes
 * @return {Array}         Contains all relative urls found.
 */
app.findRelatives = function (content) {
   return app.findAllHrefs(content, app.relativeFilter);
};

/**
 * Converts a given array into absolute urls with the given baseUrl.
 * @param  {Array} relativeUrls Relative URLs to change.
 * @param  {String} baseUrl      The base url to make it absolute to.
 * @return {Array}              All the absolute URLs
 */
app.convertRelToAbs = function (relativeUrls, baseUrl) {
   return _.map(relativeUrls, function (rUrl) {
      //return baseUrl + "/" + url;
      return url.resolve(baseUrl, rUrl);
   });
};

/**
 * Returns the positions of all links in the document.
 * @param  {String} content The content to process for positions.
 * @param  {Function} filter  Optional filter will exclude entries that return false.
 * @return {Array}         Array of objects containing first and last string positions.
 */
app.getLinkPositions = function (content, filter) {
   var tagRegex = /href="([^"']*["'])/gi;
   var match;
   var matches = [];
   while (match=tagRegex.exec(content)) {
      if (_.isFunction(filter)) {
         if (filter(match)) {
            continue;
         }
      }
      matches.push({
         first: match.index,
         last: tagRegex.lastIndex
      });
   }
   return matches;
};

app.getRelativeLinkPositions = function (content) {
   return app.getLinkPositions(content, function (link) {
      return app.isAbsolute(app.removeHref(link[0]));
   });
};



exports.reltoabs = app;