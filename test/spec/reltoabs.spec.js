var reltoabs = require("../../lib/reltoabs").reltoabs;
var _ = require('underscore');

describe("Testing if something is absolute", function () {

   it("should return true for http://simplydiffrient.com", function () {
      var isAbs = reltoabs.isAbsolute("http://simplydiffrient.com");
      expect(isAbs).toBe(true);
   });

   it("should return false for simplydiffrient.com", function() {
      var isAbs = reltoabs.isAbsolute("simplydiffrient.com");
      expect(isAbs).toBe(false);
   });

   it("should return false for index.html", function() {
      var isAbs = reltoabs.isAbsolute("index.html");
      expect(isAbs).toBe(false);
   });

   it("should return true for https://simplydiffrient.com", function () {
      var isAbs = reltoabs.isAbsolute("https://simplydiffrient.com");
      expect(isAbs).toBe(true);
   });

});

describe("Testing file opening abilities", function () {

   it("should open the file testData.html", function () {
      var data = reltoabs.openFile(process.cwd() + "/test/testData.html");
      expect(data).toBe('<!doctype html>\n<html lang="en">\n<head>\n' +
                        '   <meta charset="UTF-8">\n   <title>Document</title>\n' +
                        '</head>\n<body>\n\n</body>\n</html>');
   });

});

describe("Testing the parsing abilities", function () {
   var fileContents;
   //var baseUrl = "http://www.simplydiffrient.com";
   beforeEach(function () {
      fileContents = '<!doctype html>\n<html lang="en">\n<head>\n' +
                        '   <meta charset="UTF-8">\n   <title>Document</title>\n' +
                        '</head>\n<body>\n<a href="something.html">Something</a>' +
                        '<a href="somethingElse.html">Something Else</a>' +
                        '<a href="another.html">Another</a>' +
                        '<a href="http://simplydiffrient.com">Simply Diffrient</a>' +
                        '\n</body>\n</html>';
   });

   it("should find all href attributes and return them in an array", function () {
       var results = reltoabs.findAllHrefs(fileContents);
       expect(_.isArray(results)).toBe(true);
   });

   it("should have 4 found results", function () {
      var results = reltoabs.findAllHrefs(fileContents);
      expect(results.length).toBe(4);
   });

   it("should return 3 non-absolute references", function () {
      var results = reltoabs.findRelatives(fileContents);
      expect(results.length).toBe(3);
   });

   it("should find the position of the first \" in the first href.", function () {
      var location = reltoabs.getLinkPositions(fileContents);
      expect(location[0].first).toBe(111);
   });

   it("should find the position of the last \" in the first href.", function () {
      var location = reltoabs.getLinkPositions(fileContents);
      expect(location[0].last).toBe(132);
   });

   it("should not find the position of the absolute reference.", function () {
      var location = reltoabs.getRelativeLinkPositions(fileContents);
      expect(location.length).toBe(3);
      expect(location[2].first).toBe(196);   //Make sure the last one wasn't the absolute one.
      expect(location[2].last).toBe(215);
   });

/*   it("should replace a string with the absolute reference", function () {
      var locations = reltoabs.getRelativeLinkPositions(fileContents);

   });*/

});
