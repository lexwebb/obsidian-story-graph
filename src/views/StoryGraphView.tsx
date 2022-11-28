import StoryColumns from "@components/StoryColumns";
import { Card } from "@models/Card";
import { WorkspaceLeaf } from "obsidian";
import React, { useMemo } from "react";
import remarkDirective from "remark-directive";
import remarkHtml from "remark-html";
import markdown from "remark-parse";
import { CompilerFunction, unified } from "unified";
import { Node } from "unist";
import { visitParents } from "unist-util-visit-parents";

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
  cards: Card[][];
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

  return <StoryColumns cards={parsedData.cards} />;
};

type DirectiveNode = Node & {
  name: string;
  attributes: Record<string, string>;
  children: DirectiveNode[];
};

function remarkCardPlugin() {
  const compiler: CompilerFunction = (entryNode, data) => {
    data.data.cards = [];
    const nodeData = data.data as { cards: Card[][] };

    visitParents(
      entryNode,
      (node: DirectiveNode, ancestors: DirectiveNode[]) => {
        switch (node.type) {
          case "containerDirective":
            if (node.name === "card") {
              addNodeDataFromDirective(node, nodeData);
            }
            break;
          case "textDirective":
            switch (node.name) {
              case "link":
                addLinkDataFromDirective(node, nodeData, ancestors);
                break;
              case "meta":
                addMetaDataFromDirective(node, nodeData, ancestors);
                break;
            }
            break;
        }
      }
    );

    // visit(entryNode, "containerDirective", (node: DirectiveNode) => {
    //   if (node.name === "card") {
    //     const col = node.attributes.c;
    //     const row = node.attributes.r;

    //     if (!nodeData.cards[parseInt(col)]) nodeData.cards[parseInt(col)] = [];

    //     nodeData.cards[parseInt(col)][parseInt(row)] = {
    //       col: node.attributes.c,
    //       row: node.attributes.r,
    //       title: "beans",
    //       html: node.children
    //         .map((c) =>
    //           unified()
    //             .use(remarkDirective)
    //             .use(remarkHtml)
    //             // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //             .stringify(c as any)
    //         )
    //         .join(""),
    //       links: [],
    //     };
    //   }
    // });

    // visit(entryNode, "textDirective", (node: DirectiveNode) => {
    //   if (node.name === "link") {
    //     const col = node.attributes.c;
    //     const row = node.attributes.r;

    //     // Somehow we have a link without a parent
    //     if (
    //       !nodeData.cards[parseInt(col)] ||
    //       !nodeData.cards[parseInt(col)][parseInt(row)]
    //     )
    //       return;

    //     nodeData.cards[parseInt(col)][parseInt(row)].links.push({ col, row });
    //   }
    // });

    // visit(entryNode, "textDirective", (node: DirectiveNode) => {
    //   if (node.name === "link") {
    //     const col = node.attributes.c;
    //     const row = node.attributes.r;

    //     // Somehow we have a link without a parent
    //     if (
    //       !nodeData.cards[parseInt(col)] ||
    //       !nodeData.cards[parseInt(col)][parseInt(row)]
    //     )
    //       return;

    //     nodeData.cards[parseInt(col)][parseInt(row)].links.push({ col, row });
    //   }
    // });
  };

  Object.assign(this, { Compiler: compiler });
}

const addNodeDataFromDirective = (
  node: DirectiveNode,
  data: { cards: Card[][] }
) => {
  const col = node.attributes.c;
  const row = node.attributes.r;

  if (!data.cards[parseInt(col)]) data.cards[parseInt(col)] = [];

  data.cards[parseInt(col)][parseInt(row)] = {
    col: node.attributes.c,
    row: node.attributes.r,
    title: "beans",
    html: node.children
      .map((c) =>
        unified()
          .use(remarkDirective)
          .use(remarkHtml)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .stringify(c as any)
      )
      .join(""),
    links: [],
  };
};

const addLinkDataFromDirective = (
  node: DirectiveNode,
  data: { cards: Card[][] },
  ancestors: DirectiveNode[]
) => {
  const parentCard = getParentCard(data, ancestors);
  const col = node.attributes.c;
  const row = node.attributes.r;

  parentCard?.links.push({
    col,
    row,
  });
};

const addMetaDataFromDirective = (
  node: DirectiveNode,
  data: { cards: Card[][] },
  ancestors: DirectiveNode[]
) => {
  const parentCard = getParentCard(data, ancestors);
  const title = node.attributes.title;

  parentCard.title = title;

  // Somehow we have a link without a parent
  // if (!data.cards[parseInt(col)] || !data.cards[parseInt(col)][parseInt(row)])
  //   return;

  // data.cards[parseInt(col)][parseInt(row)].links.push({
  //   col,
  //   row,
  // });
};

const getParentCard = (
  data: { cards: Card[][] },
  ancestors: DirectiveNode[]
): Card | null => {
  const container = ancestors.find((a) => a.type === "containerDirective");
  const col = container?.attributes.c;
  const row = container?.attributes.r;

  if (!col || !row) return null;
  return data.cards[parseInt(col)][parseInt(row)];
};

export default StoryGraphView;
