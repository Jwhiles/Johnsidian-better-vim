import { App, Plugin, PluginSettingTab, Setting } from "obsidian";

interface BetterVimSettings {
	useSystemClipboard: boolean;
}

const DEFAULT_SETTINGS: BetterVimSettings = {
	useSystemClipboard: true,
};

interface CodeMirrorVim {
	noremap(keys: string, toKeys: string, context: string): void;
	unmap(keys: string, context: string): void;
}

interface CodeMirrorAdapter {
	Vim: CodeMirrorVim;
}

declare global {
	interface Window {
		CodeMirrorAdapter?: CodeMirrorAdapter;
	}
}

const CLIPBOARD_MAPPINGS: Array<{
	keys: string;
	toKeys: string;
	context: string;
}> = [
		// Yank
		{ keys: "y", toKeys: '"+y', context: "normal" },
		{ keys: "Y", toKeys: '"+Y', context: "normal" },
		{ keys: "y", toKeys: '"+y', context: "visual" },
		{ keys: "Y", toKeys: '"+Y', context: "visual" },
		// Delete
		{ keys: "d", toKeys: '"+d', context: "normal" },
		{ keys: "D", toKeys: '"+D', context: "normal" },
		{ keys: "d", toKeys: '"+d', context: "visual" },
		// Paste
		{ keys: "p", toKeys: '"+p', context: "normal" },
		{ keys: "P", toKeys: '"+P', context: "normal" },
		// Change
		{ keys: "c", toKeys: '"+c', context: "normal" },
		{ keys: "C", toKeys: '"+C', context: "normal" },
		{ keys: "x", toKeys: '"+x', context: "normal" },
		{ keys: "s", toKeys: '"+s', context: "normal" },
	];

export default class BetterVim extends Plugin {
	settings: BetterVimSettings;
	initialized = false;

	private codeMirrorVimObject: CodeMirrorVim | null = null;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new SettingsTab(this.app, this));

		this.app.workspace.on("active-leaf-change", async () => {
			if (!this.initialized) await this.initialize();
		});
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async initialize() {
		this.codeMirrorVimObject = window.CodeMirrorAdapter?.Vim ?? null;

		this.syncVimOptions();
		this.initialized = true;
	}

	syncVimOptions() {
		const vim = this.codeMirrorVimObject;
		if (!vim) return;

		if (this.settings.useSystemClipboard) {
			for (const m of CLIPBOARD_MAPPINGS) {
				vim.noremap(m.keys, m.toKeys, m.context);
			}
		} else {
			for (const m of CLIPBOARD_MAPPINGS) {
				vim.unmap(m.keys, m.context);
			}
		}
	}
}

class SettingsTab extends PluginSettingTab {
	plugin: BetterVim;

	constructor(app: App, plugin: BetterVim) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("Use system clipboard")
			.setDesc("Sync vim yank/paste with the system clipboard")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.useSystemClipboard)
					.onChange(async (value) => {
						this.plugin.settings.useSystemClipboard = value;
						await this.plugin.saveSettings();
						this.plugin.syncVimOptions();
					}),
			);
	}
}
