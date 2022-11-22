import { WorkspaceLeaf } from "obsidian";
import React, { useMemo } from "react";
import remarkDirective from "remark-directive";
import markdown from "remark-parse";
import { unified } from "unified";

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

  const parsed = useMemo(() => {
    // TODO https://github.com/remarkjs/remark-directive#use
    return unified().use(markdown).use(remarkDirective).parse(data);
  }, [data]);

  return <div>{JSON.stringify(parsed)}</div>;
};

export default StoryGraphView;
