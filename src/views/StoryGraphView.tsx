import StoryColumns from "@components/StoryColumns";
import { Card } from "@models/Card";
import { nanoid } from "nanoid";
import { WorkspaceLeaf } from "obsidian";
import React, { useEffect, useMemo, useState } from "react";
import { parse } from "yaml";

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

const StoryGraph: React.FC = () => {
  const { data } = useTextFile();
  const { vault } = useApp();
  const [mutableCards, setMutableCards] = useState<Card[][]>([]);

  useEffect(() => {
    if (!data) {
      vault.modify(app.workspace.getActiveFile(), serializeCards([[]]));
    }
  }, [data, vault]);

  const onCardUpdated = (id: string, md: string) => {
    const [col, row] = id.split("-").map((s) => parseInt(s));
    const newCards = [...mutableCards];
    newCards[col][row].content = md;

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

    const newCard: Card = {
      id: nanoid(),
      links: [],
      title: "",
      content: "",
    };

    if (!newCards[column]) newCards[column] = [];

    newCards[column].splice(row, 0, newCard);

    vault.modify(app.workspace.getActiveFile(), serializeCards(newCards));
  };

  const onCardDeleted = (id: string) => {
    const [col, row] = id.split("-").map((s) => parseInt(s));
    const newCards = [...mutableCards];
    newCards[col].splice(row, 1);

    if (newCards[col].length === 0) newCards.splice(col, 1);

    vault.modify(app.workspace.getActiveFile(), serializeCards(newCards));
  };

  const parsedData = useMemo(() => {
    return (parse(data) as Card[][]) || [[]];
  }, [data]);

  useEffect(() => {
    setMutableCards(parsedData);
  }, [parsedData]);

  return (
    <StoryColumns
      cards={parsedData}
      onCardUpdated={onCardUpdated}
      onCardInserted={onCardInserted}
      onTitleUpdated={onCardTitleUpdated}
      onCardDeleted={onCardDeleted}
    />
  );
};

export default StoryGraphView;
