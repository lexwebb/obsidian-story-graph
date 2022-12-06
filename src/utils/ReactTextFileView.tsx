import { TextFileView, WorkspaceLeaf } from "obsidian";
import React, { createContext, useContext } from "react";
import { Root, createRoot } from "react-dom/client";

import { AppContext } from "../appContext";

export const TextFileContext = createContext<ReactTextFileView>(
  null as unknown as ReactTextFileView
);

export const useTextFile = (): ReactTextFileView => {
  return useContext(TextFileContext);
};

abstract class ReactTextFileView extends TextFileView {
  abstract readonly VIEW_TYPE: string;

  private reactRoot: Root | null = null;

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType() {
    return this.VIEW_TYPE;
  }

  getViewData() {
    return this.data;
  }

  setViewData(data: string) {
    this.data = data;

    this.reactRoot?.render(
      <TextFileContext.Provider value={this}>
        <AppContext.Provider value={this.app}>
          <React.StrictMode>{this.render()}</React.StrictMode>
        </AppContext.Provider>
      </TextFileContext.Provider>
    );
  }

  clear() {
    this.data = "";
  }

  async onOpen() {
    this.reactRoot = createRoot(this.containerEl.children[1]);
  }

  renderRoot() {
    this.reactRoot?.render(
      <TextFileContext.Provider value={this}>
        <AppContext.Provider value={this.app}>
          <React.StrictMode>{this.render()}</React.StrictMode>
        </AppContext.Provider>
      </TextFileContext.Provider>
    );
  }

  abstract render(): JSX.Element;

  async onClose() {
    this.reactRoot?.unmount();
  }
}

export default ReactTextFileView;
