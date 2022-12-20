import { Plugin } from "obsidian";

import SampleSettingTab from "./settings";
import ReactTestView, { TEST_VIEW_TYPE } from "./views/ReactTestView";
import StoryGraphView, { STORY_GRAPH_VIEW_TYPE } from "./views/StoryGraphView";

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
  mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
  mySetting: "default",
};

export default class StoryGraphPlugin extends Plugin {
  settings: MyPluginSettings;

  async activateView() {
    this.app.workspace.detachLeavesOfType(TEST_VIEW_TYPE);

    await this.app.workspace.getRightLeaf(false).setViewState({
      type: TEST_VIEW_TYPE,
      active: true,
    });

    this.app.workspace.revealLeaf(
      this.app.workspace.getLeavesOfType(TEST_VIEW_TYPE)[0]
    );
  }

  async onload() {
    await this.loadSettings();

    this.registerView(TEST_VIEW_TYPE, (leaf) => new ReactTestView(leaf));

    this.registerView(
      STORY_GRAPH_VIEW_TYPE,
      (leaf) => new StoryGraphView(leaf)
    );

    this.registerExtensions(["sg"], STORY_GRAPH_VIEW_TYPE);

    this.addRibbonIcon("dice", "Activate view", () => {
      this.activateView();
    });

    // This adds a settings tab so the user can configure various aspects of the plugin
    this.addSettingTab(new SampleSettingTab(this.app, this));
  }

  onunload() {
    this.app.workspace.detachLeavesOfType(TEST_VIEW_TYPE);
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
