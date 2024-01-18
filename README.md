# HELP - Help function to inspect EMSE objects.
This JavaScript script provides a way to deeply inspect objects in Accela Civic Platform.  
The larger goal of this project is to generate EMSE documentation in-line and at-will in Script Test.  


## Installation
Create a new script in Classic Admin named "HELP" and paste the contents of help.js into the Script Text box.  

(Instructions for use with a synced repository will come once I learn about it)


## Use
I import the script into the Script Initializer box with:  

`aa.includeScript("HELP")`

and then use it in the Script Text box with `help(aa.abortScript)`, or whatever object your heart desires.
