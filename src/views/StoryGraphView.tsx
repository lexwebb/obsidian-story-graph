import { Card } from "@/models/Card";
import StoryCard from "@components/StoryCard";
import parse from "html-react-parser";
import { WorkspaceLeaf } from "obsidian";
import React, { useMemo } from "react";
import remarkDirective from "remark-directive";
import remarkHtml from "remark-html";
import markdown from "remark-parse";
import { CompilerFunction, unified } from "unified";
import { Node } from "unist";
import { visit } from "unist-util-visit";

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

type GraphData = {
  cards: Card[];
};

const StoryGraph: React.FC = () => {
  const { data } = useTextFile();

  const parsedData = useMemo(() => {
    return unified()
      .use(markdown)
      .use(remarkDirective)
      .use(remarkCardPlugin)
      .processSync(data).data as GraphData;
  }, [data]);

  return (
    <div>
      <StoryCard></StoryCard>
      {parse(
        parsedData.cards
          .map((d) => d.html)
          .join("")
          .replace("<p><div></div></p>", "")
      )}
    </div>
  );
};

type DirectiveNode = Node & {
  name: string;
  attributes: Record<string, string>;
  children: DirectiveNode[];
};

function remarkCardPlugin() {
  const compiler: CompilerFunction = (node, data) => {
    data.data.cards = [];
    visit(node, "containerDirective", (node: DirectiveNode) => {
      if (node.name === "card") {
        (data.data.cards as Card[]).push({
          col: node.attributes.c,
          row: node.attributes.r,
          html: node.children
            .map((c) =>
              unified()
                .use(remarkDirective)
                .use(remarkHtml)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .stringify(c as any)
            )
            .join(""),
        });
      }
    });
  };

  Object.assign(this, { Compiler: compiler });
}

export default StoryGraphView;
