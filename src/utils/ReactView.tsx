import { ItemView, WorkspaceLeaf } from "obsidian";
import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";

abstract class ReactView extends ItemView {
  abstract readonly VIEW_TYPE: string;
  abstract readonly DISPLAY_TEXT: string;


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
    const root = createRoot(this.containerEl.children[1]);
    root.render(
      <React.StrictMode>
        {this.render()},
      </React.StrictMode>
    );
  }

  abstract render(): JSX.Element;

  async onClose() {
    ReactDOM.unmountComponentAtNode(this.containerEl.children[1]);
  }
}

export default ReactView;
