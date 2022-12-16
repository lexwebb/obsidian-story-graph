import StoryColumns from "@components/StoryColumns";
import { Card } from "@models/Card";
import { WorkspaceLeaf } from "obsidian";
import React, { useEffect, useMemo, useState } from "react";
import remarkBreaks from "remark-breaks";
import remarkDirective from "remark-directive";
import remarkHtml from "remark-html";
import markdown from "remark-parse";
import remarkStringify from "remark-stringify";
import { CompilerFunction, unified } from "unified";
import { Node } from "unist";
import { visitParents } from "unist-util-visit-parents";

import { useApp } from "../appContext";
import ReactTextFileView, { useTextFile } from "../utils/ReactTextFileView";
import { serializeCards } from "../utils/serializeCards";

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
  const { vault } = useApp();
  const [mutableCards, setMutableCards] = useState<Card[][]>([]);

  const onCardUpdated = (id: string, md: string) => {
    const [col, row] = id.split("-").map((s) => parseInt(s));
    const newCards = [...mutableCards];
    newCards[col][row].md = md;

    // TODO fix wierd makrdown conversions
    vault.modify(app.workspace.getActiveFile(), serializeCards(newCards));
  };

  const onCardTitleUpdated = (id: string, title: string) => {
    const [col, row] = id.split("-").map((s) => parseInt(s));
    const newCards = [...mutableCards];
    newCards[col][row].title = title;

    vault.modify(app.workspace.getActiveFile(), serializeCards(newCards));
  };

  const onCardInserted = (column: number, row: number) => {
    const newCards = [...mutableCards];
    newCards[column - 1].splice(row, 0, {
      col: String(column),
      row: String(row),
      links: [],
      title: "",
      md: "",
      html: "",
    });

    vault.modify(app.workspace.getActiveFile(), serializeCards(newCards));
  };

  const onCardDeleted = (id: string) => {
    const [col, row] = id.split("-").map((s) => parseInt(s));
    const newCards = [...mutableCards];
    newCards[col].splice(row, 1);

    vault.modify(app.workspace.getActiveFile(), serializeCards(newCards));
  };

  const parsedData = useMemo(() => {
    return unified()
      .use(markdown)
      .use(remarkDirective)
      .use(remarkCardPlugin)
      .processSync(data).data as GraphData;
  }, [data]);

  useEffect(() => {
    setMutableCards(parsedData.cards);
  }, [parsedData.cards]);

  return (
    <StoryColumns
      cards={parsedData.cards}
      onCardUpdated={onCardUpdated}
      onCardInserted={onCardInserted}
      onTitleUpdated={onCardTitleUpdated}
      onCardDeleted={onCardDeleted}
    />
  );
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
    md: node.children
      .map((c) =>
        unified()
          .use(remarkDirective)
          .use(remarkStringify)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .stringify(c as any)
      )
      .join(""),
    html: node.children
      .map((c) =>
        unified()
          .use(remarkDirective)
          .use(remarkBreaks)
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
