// @ts-check
/**
 * @file This script provides a `help()` function that uses the Ident object
 * (also provided in this script) to print in-line documentation for the given
 * object.
 * 
 * @author Garin Wally <wallyg@ci.missoula.mt.us>
 * @version 0.0.1
 * @copyright Copyright (C) 2024 City of Missoula
 * 
 * @license MIT License<br>
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 * <br><br>
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * <br><br>
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 * <br><br>
 * 
 * Accela, the Accela logo, the Accela logo with "Government Software"
 * notation, Accela Civic Platform, Accela Automation, Accela Asset
 * Management, Accela Citizen Access, Accela Mobile Citizen Access,
 * Accela ERS, Accela GIS, Accela IVR, Accela Land Management, Accela
 * Licensing, Accela Mobile Office, Accela Public Health and Safety, Accela
 * Service Request, Accela Wireless, Kiva DMS, Kiva Development Management
 * System, 'PERMITS' Plus, SiteSynch, Tidemark Advantage, Civic Platform,
 * Civic Cloud, Civic Hero, E-Boardroom, EnvisionConnect, Envista, GEOTMS,
 * IQM2, Mediatraq, Minutetraq, PublicStuff, Trusted To Do More,
 * VelocityHall, Vantage360, and other Accela logos, devices, product names,
 * and service names are trademarks or service marks of Accela, Inc. Brava!
 * Viewer is a trademark of Informative Graphics Corporation. Windows is a
 * registered trademark of Microsoft Corporation. Acrobat is a trademark of
 * Adobe Systems Incorporated. All other company names, product names, and
 * designs mentioned herein are held by their respective owners.
 */


/**
 * This object acts as a support library (much like Math) for the help function.
 * 
 * @example
 * var x = ["Hello", "world"];
 * var type = Ident.getType(x);  // array<string>
 */
var Ident = {
    // Troublesome child objects (keys)
    "ignoreKeys": [
        // BUG: aa.db.connection and/or JavaConnection.XAResource
        // org.jboss.resource.adapter.jdbc.WrappedConnection
        // Error: "Wrapped javax.resource.ResourceException: IJ031090: LocalTransaction only"
        "XAResource",
    ],
    
    // Troublesome child objects (values)
    "ignoreValues": [
        // Error: "Wrapped javax.resource.ResourceException: IJ031090: LocalTransaction only"
        "WrappedConnectionJDK7",
    ],

    // Properties on Java objects
    "jProps": [
        // java.lang.Object
        "class",
        "equals",
        "getClass",
        "hashCode",
        "notify",
        "notifyAll",
        "toString",
        "wait",

        // java.lang.String
        "at",  // ES 2022
        "chars",
        "codePointBefore",
        "codePointCount",
        "codePoints",
        "compareTo",
        "compareToIgnoreCase",
        "contains",
        "contentEquals",
        "equalsIgnoreCase",
        "getBytes",
        "getChars",
        "intern",
        "isEmpty",
        "offsetByCodePoints",
        "padEnd",  // ES 2017
        "padStart",  // ES 2017
        "regionMatches",
        "repeat",  // ES6
        "replaceAll",  // ES 2021
        "subSequence",
        "toCharArray",
        "trimEnd",  // ES 2019
        "trimStart",  // ES 2019

        // Script Properties
        "initScript",

        // ModelBase Properties
        "auditDate",
        "auditID",
        "auditStatus",
        "clone",
        "dispStringValue",
        "dispValue",
        "enableI18N",
        "enbaleI18N",
        "fillI18NStatus",
        "fillLanguageModel",
        "getAuditDate",
        "getAuditID",
        "getAuditStatus",
        "getDispStringValue",
        "getDispValue",
        "getOriginalValue",
        "getProcessCode",
        "getResColumns",
        "getResId",
        "getResLangId",
        "getResObject",
        "getResStringValue",
        "getResValue",
        //"getServiceProviderCode",
        "hasResource",
        "isEnableI18N",
        "isEnbaleI18N",
        "originalValue",
        "processCode",
        "resColumns",
        "resId",
        "resLangId",
        "resObject",
        "resStringValue",
        "resValue",
        //"serviceProviderCode",
        "setAuditDate",
        "setAuditID",
        "setAuditStatus",
        "setDispValue",
        "setOriginalValue",
        "setProcessCode",
        "setResId",
        "setResLangId",
        "setResValue",
        //"setServiceProviderCode",
    ],

    // Name to give nameless functions (e.g. `{"func": function(a, b){return a+b;}}`)
    "namelessFunctionName": "<nameless_function>",

    // Java object names mapped to native/JavaScript object names
    "javaObjMap": [
        ["JavaObject", "object"],
        ["JavaString", "string"],
        ["JavaBoolean", "boolean"],
        ["JavaInteger", "number"],
        ["JavaDouble", "number"],
        ["JavaLong", "number"],
    ],

    /**
     * Converts a Java object name (string) to a JavaScript object name.
     */
    "javaToJavaScript": function javaToJavaScript(javaObjStr){
        var objMap = this.javaObjMap;
        for(i in objMap){
            var rpl = objMap[i];
            javaObjStr = javaObjStr.replace(rpl[0], rpl[1]);
        }
        return javaObjStr;
    },

    /**
    * Gets the type of an object (better than `typeof`)
    * 
    * @param {any} obj - The object to identify.
    * 
    * @returns {String}
    */
    "getType": function getType(obj){
        var type;
        if(obj === null){
            type = "null";
        }
        else if(typeof obj === "undefined"){
            type = "undefined";
        }
        else {
            type = Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
        }

        // Get contained types
        if(type.indexOf("array") >= 0){
            var containedTypes = [];  // kinda like a set
            for(var i in obj){
                var item = obj[i];
                var itemType = this.getType(item);
                // Only push unique value types
                if(containedTypes.indexOf(itemType) === -1){
                    containedTypes.push(itemType);
                }
            }
            // Format with '<type>[]' notation; ex. string[] or number[]
            if(containedTypes.length === 1 && obj.length > 1){
                type += "<" + containedTypes[0] + ">";
            }
            else {
                type += "<any>";
            }
        }
        
        return type;
    },

    /**
    * Convert the object to a string representation.
    * 
    * @param {any} obj - The object to identify.
    * @param {String} type - The type of the object.
    * 
    * @returns {String}
    */
    "getAsString": function getAsString(obj, type){
        var objStr = String(obj);

        if(type === "null" || type === "undefined" || objStr === ""){
            return objStr;
        }

        // Ignore error-causing values
        if(Ident.ignoreValues.indexOf(this.cleanJavaStr(objStr)) >= 0){
            return objStr;
        }

        // Convert javaobjects for inspection as an object (type === "object") & enable JSON.stringify
        if(type === "javaobject"){
            var jsObj = {};
            Object.keys(obj).map(function(i){jsObj[i] = String(obj[i])});
            obj = jsObj;
        }

        if(type === "object"){
            objStr = JSON.stringify(obj);
            objStr = objStr.replace(",", ", ");
        }

        if(type === "function"){
            objStr = this.getFunctionSignatures(obj).join("\n");
        }

        objStr = this.cleanJavaStr(objStr);
        return objStr;
    },

    /**
    * Get the name of the object. Note that this might be a Java-type.
    * 
    * @param {any} obj - The object to identify.
    * @param {String} objStr - The string representation of the object.
    * @param {String} type - The type of the object.
    * 
    * @returns {String}
    */
    "getObjectName": function getObjectName(obj, objStr, type){
        var objName;
        if(type === "null" || type === "undefined"){
            return type;
        }
        if(type === "string" || type === "number"){
            return objStr;
        }
        // Containers
        if(type.indexOf("array") === 0 || type.indexOf("object") === 0){
            objName = type.replace(/<.*>/g, "");  // remove generics like "array<any>" -> "array"
            return objName;
        }
        else if(type === "function"){
            objName = this.getFunctionName(obj);
        }
        else if(typeof obj.class !== "undefined"){
            objName = String(obj.class.name);  // e.g. "com.accela.aa.emse.dom.UtilScript"
        }
        else {
            objName = "";
        }
        objName = this.cleanJavaStr(objName);
        // Clean object of "function "
        objName = objName.replace("function ", "");
        //objName = objName.split(" ")[0];

        return objName;
    },

    /**
     * Get function name.
     * 
     * @param {Function} func - The function for which to parse a name.
     * 
     * @returns {string}
     */
    "getFunctionName": function getFunctionName(func){
        if(typeof func !== "function"){
            return "";
        }
        var funcStr = String(func);
        var funcNameMatch = funcStr.match(/function \w+ ?\(/g);
        if(funcNameMatch === null){
            return Ident.namelessFunctionName;
        }
        var funcName = funcNameMatch[0].replace(/\(/g, "").replace(/function ?/g, "");
        return funcName;
    },

    /**
     * Parse a function for argument types and return type if they exist.
     * func_name(arg)
     */
    "getFunctionSignatures": function getFunctionSignatures(func){
        var funcStr = String(func);
        var funcName = Ident.getFunctionName(func);
        var isJavaFunc = funcStr.indexOf("() {/*\n") >= 0 && funcStr.indexOf("*/}") === funcStr.length-4;
        var signatures = [];

        // Java-defined functions
        if(isJavaFunc){
            var sigs = funcStr.split(/\n/g);
            sigs = sigs.slice(1, sigs.length - 2);
            for(i in sigs){
                var sig = sigs[i];
                // Break into caller (e.g. `name(args)`) and returnType
                var parts = sig.split(" ");
                var returnType = this.cleanJavaStr(parts[0]);
                // @todo Maybe someday we create a giant JSON data of {"funcName": "ScriptResult<actualType>"}
                var secondaryReturnType = "unknown";  // We can't know the return type of .getOutput()
                returnType = returnType.replace("ScriptResult", "ScriptResult<" + secondaryReturnType + ">");
                var caller = parts[1];
                var argTypes = caller.split("(")[1].split(")")[0].split(",");
                var args = [];
                for(j in argTypes){
                    if(!argTypes[j]){
                        continue;
                    }

                    // We want to see native object names as param/arg types
                    // So convert things like JavaString -> string; JavaBoolean -> boolean.
                    var argType = this.cleanJavaStr(argTypes[j], true);

                    // Make full arg string (e.g. "arg#: argType")
                    var arg = "arg" + String(j) + ": " + argType;
                    args.push(arg);
                }

                // Add spaces between commas
                var cleaned = funcName + "(" + args.join(", ") + "): " + returnType + ";"
                cleaned = cleaned.replace(/int|double|long/g, "number");

                signatures.push(cleaned);
            }
        }

        // Nameless functions
        else {
            var sigMatch;
            if(funcName === Ident.namelessFunctionName){
                sigMatch = funcStr.match(/function ?\(.*\)/g);
            }
            else {
                sigMatch = funcStr.match(/function \w+\(.*\)/g);
            }
            if(sigMatch !== null){
                var sig = sigMatch[0].replace("function ", "");
                sig = sig + ": unknown;";  // JavaScript functions don't have return types
                signatures.push(sig);
            }
        }

        signatures.sort();  // order overloaded signatures ascending
        return signatures;
    },

    /**
     * Cleans a string of Java-library information.
     * 
     * @param {String} objStr - The string representation of the object.
     * @param {boolean} [toJsObj=false] - Optionally convert Java-objects to JavaScript objects.
     * 
     * @example
     * var a = "com.accela.aa.emse.dom.ScriptRoot@ba627e1";
     * Ident.cleanJavaStr(a);  // "ScriptRoot"
     * 
     * var c = "org.mozilla.javascript.Context";
     * Ident.cleanJavaStr(c);  // "Context"
     * 
     * var j = "java.lang.String";  // converts "java.*" to "Java"
     * Ident.cleanJavaStr(j);  // "JavaString"
     * 
     * var arg = "arg0: JavaString";
     * Ident.cleanJavaStr(arg);  // "arg0: JavaString"
     * Ident.cleanJavaStr(arg, true);  // "arg0: string"
     */
    "cleanJavaStr": function cleanJavaStr(objStr, toJsObj){
        if(typeof toJsObj !== "boolean"){
            toJsObj = false;
        }
        // Replace "java.<something>.<Whatever>" with "Java<Whatever>" (e.g. "java.lang.String" -> "JavaString")
        var cleanedStr = objStr.replace(/java\.\w+\./g, "Java");

        // Get the last dot-seperated thing
        var parts = cleanedStr.split(/\./g);
        cleanedStr = parts[parts.length - 1];

        // Removes the dangling ID(?)
        // e.g. "com.accela.aa.emse.dom.ScriptRoot@ba627e1" -> "ScriptRoot"
        cleanedStr = cleanedStr.split("@")[0];

        // Add generics
        var containers = [
            "JavaArray",
            "JavaCollection",
            "JavaList",
        ];
        if(containers.indexOf(cleanedStr) >= 0){
            cleanedStr = cleanedStr + "<unknown>";
        }
        // JavaHashtable, JavaHashmap
        else if(cleanedStr.indexOf("JavaHash") === 0 || cleanedStr === "JavaMap"){
            cleanedStr = cleanedStr + "<unknown, unknown>";
        }

        // Optionally, convert Java objects to native JavaScript objects
        if(toJsObj === true){
            cleanedStr = this.javaToJavaScript(cleanedStr);
        }

        return cleanedStr;
    },

    /**
    * Identifies the object and returns data.
    * 
    * @param {any} obj - The thing to identify.
    * 
    * @returns {Object}
    */
    "identify": function(obj){  // makes for an example nameless function
        var type = this.getType(obj);
        var objStr = this.getAsString(obj, type);
        var name = this.getObjectName(obj, objStr, type);

        var data = {
            name: name,
            objStr: objStr,
            type: type,
            contents: []
        };

        // Handle null, undefined, and javaobjects
        if(obj === null || typeof obj === "undefined"){
            return data;
        }

        // Handle containers / nested items (prevents recursion)
        if(data.type.indexOf("array") >= 0 || data.type.indexOf("object") >= 0){
            var children = [];
            var existingHelpStrs = [];
            for(var key in obj){
                // Ignore error-causing child-objects
                if(Ident.ignoreKeys.indexOf(key) >= 0){
                    continue;
                }

                var childObj = obj[key];
                var childType = this.getType(childObj);

                // Only list function signatures for Java-objects (e.g. JavaString, etc.)
                // This probably isn't the best... like we still want JavaArray items listed...
                if(data.name.indexOf("Java") === 0 && childType !== "function"){
                    continue;
                }

                var childObjStr = this.getAsString(childObj, childType);
                var childName = this.getObjectName(childObj, childObjStr, childType);

                // Fix troublesome values
                if(key === "debugOutput"){
                    childObjStr = "<debugOutput>";  // contains anything printed before Ident.identify() is called
                }

                var childData = {
                    "key": key,
                    "name": childName,
                    "objStr": childObjStr,
                    "type": childType,
                    "helpStr": ""
                };

                // Put quotes around string values
                if(childType === "string" || childName === "JavaString"){
                    childObjStr = '"' + childObjStr + '"';
                }

                if(childType === "javaobject"){
                    childData.helpStr = "." + key + ": " + childName + ";";
                    // Ignore things like CalendarScript
                    if(childName.indexOf("Script") === -1){
                        childData.helpStr = childData.helpStr + "  // " + childObjStr;
                    }
                }

                // Functions need special treatment (it's possible to have multiple signatures)
                else if(childType === "function"){
                    // Handle nameless functions (safe to assume there's no overloaded variants)
                    if(childObjStr.indexOf("(") === 0){
                        childData.helpStr = "." + key + ": " + childName + childObjStr;
                    }
                    else {
                        childData.helpStr = "." + childObjStr.split("\n").join("\n+ .");
                    }
                }

                // arrays / key is a number
                // @ts-ignore
                else if(key.trim() !== "" && !isNaN(key)){
                    childData.helpStr = "[" + key + "]: " + childType + ";  // " + childObjStr;
                }

                else {
                    if(childType === "undefined" || childType === "null"){
                        childType = "unknown"
                    }
                    childData.helpStr = "." + key + ": " + childType + ";  // " + childObjStr;
                }

                // Ignore children with blank help strings
                if(childData.helpStr.replace(".", "").trim() === ""){
                    continue;
                }
                // Ignore child values that are undefined (a result of related get-methods)
                if(childData.helpStr.indexOf(": unknown;  // undefined") >= 0){
                    continue;
                }

                // Enforce unique help strings ("JavaLong.numberValue()" duplicated)
                if(existingHelpStrs.indexOf(childData.helpStr) >= 0){
                    continue;
                }
                existingHelpStrs.push(childData.helpStr);
                children.push(childData);
            }
            
            // Sort the objects by key
            var sortedKeys = Object.keys(obj);
            sortedKeys.sort();
            for(var i in sortedKeys){
                var k = sortedKeys[i];
                for(var j in children){
                    var child = children[j];
                    if(child.key === k){
                        // @ts-ignore
                        data.contents.push(child);
                    }
                }
            }

            return data;
        }

        // Handle functions
        if(data.type === "function"){
            //var funcData = this.getFunctionTypes(obj);  // Function stuff here?
            data.name = this.getFunctionName(obj);
            //data.objStr = funcData.signatures.join("\n");
            data.objStr = this.getFunctionSignatures(obj).join("\n");
            return data;
        }

        // Strings
        if(data.type === "string"){
            data.name = '"' + data.name + '"';
        }
        return data;
    }
};


/**
 * Prints a detailed report about the target object.
 * // @todo add arg to remove comments from output.
 * 
 * @param {*} obj - Any javascript variable.
 * @param {boolean} [hideJProps=false] - Optionally hide properties common to all subclasses of java.lang.Object.
 *
 * @returns {void}
 */
function help(obj, hideJProps){
    // Make rmJProps optional and default to false
    if(typeof hideJProps !== "boolean"){
        // @ts-ignore
        var hideJProps = false;
    }
    var ident = Ident.identify(obj);
    // Give better detail about the ScriptResult and what it's output is
    if(ident.name === "ScriptResult" && typeof obj.class !== "undefined" && obj.output !== null){
        var outputClass = Ident.cleanJavaStr(String(obj.output.class.name));
        ident.name = "ScriptResult<" + outputClass + ">";
    }
    // ScriptResult has an error
    else if(ident.name === "ScriptResult" && typeof obj.class !== "undefined" && obj.output === null){
        ident.name = "ScriptResult<unknown>";
    }

    // Format as a cute little box
    aa.print("\n+=============================== HELP ===============================+");
    aa.print("| " + ident.name);
    aa.print("| type: " + ident.type);
    if(ident.name === "JavaString"){
        aa.print("| value: '" + ident.objStr + "'");
    }
    else if(["JavaInteger", "JavaLong", "JavaDouble"].indexOf(ident.name) >= 0){
        aa.print("| value: " + ident.objStr);
    }
    aa.print("+--------------------------------------------------------------------+");
    var helpContents = [];

    // Objects & Arrays
    if(ident.contents.length > 0){
        for(var i in ident.contents){
            var childData = ident.contents[i];
            if(hideJProps && Ident.jProps.indexOf(childData.key) >= 0){
                continue;
            }
            aa.print("| " + childData.helpStr);
            continue;
        }
    }

    // Functions
    else if(ident.type === "function"){
        var contents = ident.objStr.split("\n");
        for(i in contents){
            helpContents.push(contents[i]);
        }
    }
    
    // Print it
    for(i in helpContents){
        var line = helpContents[i];
        aa.print("| " + line);
    }

    aa.print("+====================================================================+\n");
}



/* Script Test tests
// Script Initializer
aa.includeScript("HELP");


// Script Text
var x;

// Native Types
function x(a, b){return a+b;}  // Named function
//x = function(a, b){return a+b;}  // Nameless function
//x = "Hello world!";  // string
//x = 42;  // number
//x = {"first": "Garin", "last": "Wally"};  // object
//x = ["foo", "bar"];  // array


// Java Types
// @todo Use raw java types (e.g. `java.lang.String("Test")`)
//x = aa.serviceProviderCode;  // JavaString or java.lang.String
//x = aa.cap.createCapIDScriptModel("", "", "").getCapID().isMissingIdentifier();  // JavaBoolean or java.lang.Boolean
//x = aa.util.parseInt("42");  // JavaInteger or java.lang.Integer
//x = aa.util.parseDouble("42");  // JavaDouble or java.lang.Double
//x = aa.util.parseLong("42");  // JavaLong or java.lang.Long

//x = aa.util.parseDate("01/11/2024");  // JavaDate or java.util.Date

//x = aa.util.newArrayList();  // JavaArrayList or java.util.ArrayList
//x = aa.util.newArrayList().toArray();  // JavaArray or java.util.Array  // BUG/ERROR
//x = aa.util.newHashMap();  // JavaHashMap or java.util.HashMap
//x = aa.util.newHashtable();  // JavaHashtable or java.util.Hashtable


// Accela Types
//x = aa;  // ScriptRoot object, lots of contents
//x = aa.abortScript  // Function (Java)
//x = aa.util.divide;  // overloaded function, arg types and return type are numbers
//x = aa.workflow.adjustTask;  // overloaded function, returns ScriptResult
//x = aa.cap.getCapModel().getOutput();  // CapModel
//x = aa.cap.createCapIDScriptModel("", "", "").getCapID();  // CapIDModel
//x = aa.cap.getCapTypeModel().getOutput();  // CapTypeModel


// Test `help` first, if it fails, debug with the following tests
help(x);
//help(x, true);

// Test the main `identify` function
//var ident = Ident.identify(x);  // comment out if it breaks

// Test the functions
//var type = Ident.getType(x);
//var objStr = Ident.getAsString(x, type);
//var name = Ident.getObjectName(x, objStr, type);

//aa.print("Name: " + name);
//aa.print("Type: " + type);
//aa.print("String: " + objStr);

 */
