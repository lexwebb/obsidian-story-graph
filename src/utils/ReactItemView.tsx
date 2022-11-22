import { ItemView, WorkspaceLeaf } from "obsidian";
import React from "react";
import ReactDOM from "react-dom";
import { createRoot, Root } from "react-dom/client";

abstract class ReactItemView extends ItemView {
  abstract readonly VIEW_TYPE: string;
  abstract readonly DISPLAY_TEXT: string;

  private reactRoot: Root | null = null;


  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType() {
    return this.VIEW_TYPE;
  }

  getDisplayText() {
    return this.DISPLAY_TEXT;
  }

  async onOpen() {
    this.reactRoot = createRoot(this.containerEl.children[1]);
    this.reactRoot.render(
      <React.StrictMode>
        {this.render()}
      </React.StrictMode>
    );
  }

  abstract render(): JSX.Element;

  async onClose() {
    this.reactRoot?.unmount();
  }
}

export default ReactItemView;
