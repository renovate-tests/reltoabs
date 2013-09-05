/**
 * Command line interface for the reltoabs library.
 */

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

var args = process.argv.slice(2);

if (args.length === 0) {
   console.log("You didn't provide any arguments.\n");
   printHelp();
   process.exit(1);
}

while (args.length) {
   var arg = args.shift();

   switch (arg) {
      case '--help':
      case '-h':
         printHelp();
         break;
   }
}





process.exit(0);