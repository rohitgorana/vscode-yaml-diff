import * as vscode from 'vscode';
import * as yaml from 'js-yaml';
import { readAndSortYaml } from './yamlUtils'; // Implement this function (see step 3)

export function activate(context: vscode.ExtensionContext) {

	const selectForCompareCmd = vscode.commands.registerCommand('yaml-diff.selectForCompare', (...args) => {
		context.globalState.update('lastTagged', args[0].fsPath);
		console.log(args)
    });

	const compareWithSelectedCmd = vscode.commands.registerCommand('yaml-diff.compareWithSelected', async (...args) => {
		const file1Path = args[0].fsPath;
		const file2Path = context.globalState.get<string>('lastTagged');

		if (!file1Path || !file2Path) {
            vscode.window.showErrorMessage('Please open a YAML file and select another YAML file for comparison.');
            return;
        }

        const sortedData1 = readAndSortYaml(file1Path);
        const sortedData2 = readAndSortYaml(file2Path);

		const newFile1 = vscode.workspace.openTextDocument({language : "YAML", content: yaml.dump(sortedData1)})
		const newFile2 = vscode.workspace.openTextDocument({language : "YAML", content: yaml.dump(sortedData2)})

		vscode.commands.executeCommand("vscode.diff", (await newFile2).uri, (await newFile1).uri)
    });

    const compareCommand = vscode.commands.registerCommand('yaml-diff.CompareWithOpenFile', async () => {
        const file1Path = vscode.window.activeTextEditor?.document.uri.fsPath;
        const file2Path = await vscode.window.showOpenDialog({
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: false,
            filters: { 'YAML Files': ['yaml', 'yml'] },
        });

        if (!file1Path || !file2Path) {
            vscode.window.showErrorMessage('Please open a YAML file and select another YAML file for comparison.');
            return;
        }
		vscode.window.showInformationMessage(file1Path);

        const sortedData1 = readAndSortYaml(file1Path);
        const sortedData2 = readAndSortYaml(file2Path[0].fsPath);

		// const newFile1 = vscode.Uri.parse('untitled:' + file1Path)
		// const newFile2 = vscode.Uri.parse('untitled:' + file2Path)

		const newFile1 = vscode.workspace.openTextDocument({language : "YAML", content: yaml.dump(sortedData1)})
		const newFile2 = vscode.workspace.openTextDocument({language : "YAML", content: yaml.dump(sortedData2)})

		vscode.commands.executeCommand("vscode.diff", (await newFile2).uri, (await newFile1).uri);

    });

    context.subscriptions.push(compareCommand);
    context.subscriptions.push(selectForCompareCmd);
    context.subscriptions.push(compareWithSelectedCmd);
}

// Implement the readAndSortYaml function (see step 3)

export function deactivate() {}
