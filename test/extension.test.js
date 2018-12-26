'use strict';

/* global suite, test */

//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
const assert = require('assert');

const myExtension = require('../extension');


// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// const vscode = require('vscode');
// const myExtension = require('../extension');

// Defines a Mocha test suite to group tests of similar kind together
suite("Extension Tests", function () {

	// Defines a Mocha unit test
	test("Something 1", function () {
		assert.equal(-1, [1, 2, 3].indexOf(5));
		assert.equal(-1, [1, 2, 3].indexOf(0));
	});

	test("Update Template with Date", () => {




		let template = "/images/${year}/${month}";

		let controltemplate = template;

		let today = new Date();
		let year = today.getFullYear();
		let month = ('0' + (today.getMonth() + 1)).slice(-2);
		controltemplate = controltemplate.replace("${year}", year.toString());
		controltemplate = controltemplate.replace("${month}", month);
		controltemplate = "Bogus template";


		let updatedTemplate = myExtension.updateTemplateWithDate(template);
		//assert.notEqual(updatedTemplate, null, "Updated template was Null");

		assert.equal(updatedTemplate, controltemplate, "Updated Template not correct. Expected: " + controltemplate + " but got: " + updatedTemplate);


	});


});
