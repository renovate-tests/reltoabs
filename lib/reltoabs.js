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
var util;
try {
   util = require('util');
} catch (e) {
   util = require('sys');
}

//var path = require('path');

var _ = require('underscore');
_.str = require('underscore.string');
_.mixin(_.str.exports());

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

/**
 * Gets positions for the relative links in the document.
 * @param  {String} content The html to process for positions.
 * @return {Array}         Array of objects containing first and last string position.
 */
app.getRelativeLinkPositions = function (content) {
   return app.getLinkPositions(content, function (link) {
      return app.isAbsolute(app.removeHref(link[0]));
   });
};

/**
 * Updates a link reference at the given points
 * @param  {String} baseUrl       The base url to make things relative to.
 * @param  {String} content       The HTML content to replace the string in.
 * @param  {Number} startPosition The starting position of the relative link.
 * @param  {Number} endPosition   The ending position of the relative link.
 * @return {Object}               Object containing the new link length and the modified content.
 */
app.updateLinkReference = function (baseUrl, content, startPosition, endPosition) {
   var absolute = url.resolve(baseUrl, content.substring(startPosition, endPosition));
   content = _(content).splice(startPosition, endPosition - startPosition, absolute);
   return { content: content, absoluteLength: absolute.length};
};


/**
 * Replaces all relative links in the given content with absolute links based
 * on the given base url.
 * @param  {String} baseUrl The base url to relate the relative links to.
 * @param  {String} content The HTML content to replace links in.
 * @return {String}         The HTML content with only absolute links.
 */
app.replaceRelatives = function (baseUrl, content) {
   var locations = app.getRelativeLinkPositions(content);
   var offset = 0;
   var contentObj = {};
   _.each(locations, function (element) {
      var originalLength = content.substring(element.first + 6 + offset, element.last - 1 + offset).length;
      contentObj = app.updateLinkReference(baseUrl, content, element.first + 6 + offset, element.last - 1 + offset);
      content = contentObj.content;
      offset += contentObj.absoluteLength - originalLength;
   });
   return content;
};


exports.reltoabs = app;