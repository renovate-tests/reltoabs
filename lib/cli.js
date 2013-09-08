/**
 * Command line interface for the reltoabs library.
 */

console.log("Made it here.");

var reltoabs = require('reltoabs');
var path = require('path');

/**
 * Prints out the help information when called.
 */
function printHelp() {
   var help = [
      'Usage: reltoabs base-url source-file [dest-file]',
      '',
      'Searches through the given source-file replacing any href="" relative links with',
      'absolute links.  It will output it to the given dest-file.  If no dest-file is provided',
      'it will send it to absolute/source-file.',
      '',
      'Options:',
      '  --help, -h        - open this help file then exit.',
      ''
   ].join('\n');

   console.log(help);
}

function createDestFileName(fileName) {
  var ext = path.extname(fileName || '').split('.');
  return ext;
}

var args = process.argv.slice(2);

if (args.length === 0) {
   console.log("You didn't provide any arguments.\n");
   printHelp();
   process.exit(1);
}
if (args.length < 2) {
   console.log("Not enough arguments sent in.\n");
   printHelp();
   process.exit(1);
}

for (var i = 0; i < args.length; i++)
{
   if ((args[i] === '-h') || (args[i] === '--help')) {
      printHelp();
      process.exit(0);
   }
}

var baseUrl = args[0];
var sourceFile = args[1];
var destFile = args[2] || createDestFileName(sourceFile);

var content = reltoabs.openFile(sourceFile);
var output = reltoabs.replaceRelatives(baseUrl, content);

console.log(output);
console.log("************");
console.log(destFile);


/*while (args.length) {
   var arg = args.shift();

   switch (arg) {
      case '--help':
      case '-h':
         printHelp();
         break;
   }
}*/





process.exit(0);