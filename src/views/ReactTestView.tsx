import { ItemView, WorkspaceLeaf } from "obsidian";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import ReactView from "../utils/ReactView";

export const TEST_VIEW_TYPE = "react-test-view";

class ReactTestView extends ReactView {
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
