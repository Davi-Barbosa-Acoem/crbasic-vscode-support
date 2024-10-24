const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

function activate(context) {
    // Comando para importar arquivos CRB
    let disposableImportCRB = vscode.commands.registerCommand('extension.importCRB', async () => {
        const fileUri = await vscode.window.showOpenDialog({
            canSelectMany: false,
            filters: {
                'CRB Files': ['crb'],
            },
        });

        if (!fileUri || fileUri.length === 0) {
            vscode.window.showErrorMessage('No file selected.');
            return;
        }

        const filePath = fileUri[0].fsPath;
        const editor = vscode.window.activeTextEditor;

        if (!editor) return;

        const document = editor.document;

        try {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const position = editor.selection.active;

            editor.edit(editBuilder => {
                editBuilder.insert(position.with(position.line, 0), fileContent + '\n');
            });
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to read file: ${filePath}`);
        }
    });

    // Comando para abrir o PC400
    let disposableOpenPC400 = vscode.commands.registerCommand('extension.openPC400', async () => {
        const config = vscode.workspace.getConfiguration('crbasic');
        let folderPath = config.get('pc400Path');

        // Se o caminho não estiver configurado, solicita ao usuário para selecioná-lo
        if (!folderPath) {
            const folderUri = await vscode.window.showOpenDialog({
                canSelectFolders: true,
                canSelectFiles: false,
                openLabel: 'Select Folder for PC400',
            });

            if (folderUri && folderUri.length > 0) {
                folderPath = folderUri[0].fsPath;
                // Salva o caminho na configuração
                await vscode.workspace.getConfiguration('crbasic').update('pc400Path', folderPath, true);
            } else {
                vscode.window.showErrorMessage('No folder selected.');
                return; // Se o usuário não selecionar uma pasta, saia
            }
        }

        // Caminho do executável do PC400
        const pc400Path = path.join(folderPath, 'PC400.exe'); // Ajuste conforme necessário

        exec(`"${pc400Path}"`, (error) => {
            if (error) {
                vscode.window.showErrorMessage(`Failed to open PC400: ${error.message}`);
            }
        });
    });

    context.subscriptions.push(disposableImportCRB);
    context.subscriptions.push(disposableOpenPC400);
}

function deactivate() { }

module.exports = {
    activate,
    deactivate
};
