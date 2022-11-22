import { WorkspaceLeaf } from "obsidian";
import * as React from "react";

import ReactTextFileView, { useTextFile } from "../utils/ReactTextFileView";

export const STORY_GRAPH_VIEW_TYPE = "story-graph-view";

class StoryGraphView extends ReactTextFileView {
  VIEW_TYPE = STORY_GRAPH_VIEW_TYPE;

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  render(): JSX.Element {
    return <StoryGraph />;
  }
}

const StoryGraph: React.FC = () => {
  const { data } = useTextFile();
  return <div>{data}</div>;
};

export default StoryGraphView;
