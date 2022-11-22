import { ItemView, WorkspaceLeaf } from "obsidian";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import ReactItemView from "../utils/ReactItemView";

export const TEST_VIEW_TYPE = "react-test-view";

class ReactTestView extends ReactItemView {
  VIEW_TYPE = TEST_VIEW_TYPE;
  DISPLAY_TEXT = "Example View";

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  render(): JSX.Element {
    return <div>Example View</div>;
  }
}

export default ReactTestView;
