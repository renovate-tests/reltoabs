var reltoabs = require("../../lib/reltoabs");
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

//TODO: This test doesn't work on travis for some reason. Fix it.
/*describe("Testing file opening abilities", function () {

   it("should open the file testData.html", function () {
      var data = reltoabs.openFile(process.cwd() + "/test/testData.html");
      expect(data).toBe('<!doctype html>\n<html lang="en">\n<head>\n' +
                        '   <meta charset="UTF-8">\n   <title>Document</title>\n' +
                        '</head>\n<body>\n\n</body>\n</html>');
   });

});*/

describe("Testing the parsing abilities", function () {
   var fileContents;
   var baseUrl = "http://simplydiffrient.com";

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

   it("should return an array of absolute references", function () {
      var results = reltoabs.convertRelToAbs(reltoabs.findRelatives(fileContents), baseUrl);
      expect(reltoabs.findRelatives(results)).toBe(0);
   });
});