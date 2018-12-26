"use strict";

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

const figureTemplate = "<figure class=\"\">\n" +
	"![${figOptions.altText}](${figOptions.path}${figOptions.imageName})\n" +
	"<figcaption>\n" +
	"${figOptions.figCaption}\n" +
	"</figcaption>\n" +
	"</figure>";

let insertText = (value) => {
	let editor = vscode.window.activeTextEditor;

	if (!editor) {
		vscode.window.showErrorMessage("Can't insert text because no document is open.");
		return;
	}
	let selection = editor.selection;
	let range = new vscode.Range(selection.start, selection.end);
	editor.edit((editBuilder) => {
		editBuilder.replace(range, value);
	});
}

let getImageTemplate = () => {
	return vscode.workspace.getConfiguration("staticSiteHero")["imagePathTemplate"];
};

let getFileTemplate = () => {
	return vscode.workspace.getConfiguration("staticSiteHero")["filePathTemplate"];
};


let fillFigureTemplate = (figOptions) => {
	let figure = figureTemplate.replace('${figOptions.imageName}', figOptions.imageName);
	figure = figure.replace("${figOptions.path}", figOptions.path);
	figure = figure.replace("${figOptions.altText}", figOptions.altText);
	figure = figure.replace("${figOptions.figCaption}", figOptions.figCaption);

	return figure;
};

let updateTemplateWithDate = (template) => {
	let today = new Date();
	let year = today.getFullYear();
	let month = ('0' + (today.getMonth() + 1)).slice(-2);
	template = template.replace("${year}", year);
	template = template.replace("${month}", month);
	return template;
};

exports.updateTemplateWithDate = updateTemplateWithDate;


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "static-site-hero" is now active!');


	let fileLinkDisposable = vscode.commands.registerCommand('extension.insertLink', () => {

		let linkTypeList = ['File', 'Image'];

		vscode.window.showQuickPick(linkTypeList, { placeHolder: 'Link Type' })
			.then(result => {

				if (result === 'File') {
					insertText("[Link Text](" + updateTemplateWithDate(getFileTemplate()) + ")");
				}
				else if (result === 'Image') {
					insertText("![Alt Text](" + updateTemplateWithDate(getImageTemplate()) + ")");
				}
			});

		vscode.window.showInformationMessage('Insert HTML link  initiated');
		insertText("Insert file link");
	});
	context.subscriptions.push(fileLinkDisposable);

	let figureDisposable = vscode.commands.registerCommand('extension.insertFigure', () => {
		let template = getImageTemplate();
		template = updateTemplateWithDate(template);
		let figOptions = {
			path: template,
			imageName: "",
			altText: '',
			figCaption: ''
		};
		vscode.window.showInputBox({ prompt: "Image File Name" })
			.then(value => {
				figOptions.imageName = value;
			})
			.then(() => {
				return vscode.window.showInputBox({ prompt: "Figure Caption" }).then(value => {
					figOptions.altText = value;
					figOptions.figCaption = value;
				})
			}).then(() => {
				insertText(insertText(fillFigureTemplate(figOptions)));
			});

	});
	context.subscriptions.push(figureDisposable);


}


exports.activate = activate;


// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate,
	updateTemplateWithDate
}
