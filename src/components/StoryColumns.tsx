import { Card } from "@models/Card";
import React from "react";

import AddNewCard from "./AddNewCard";
import StoryCard from "./StoryCard";
import styles from "./StoryColumns.module.scss";

type Props = {
  cards: Card[][];
  onCardUpdated: (id: string, md: string) => void;
  onCardInserted: (column: number, row: number) => void;
  onTitleUpdated: (id: string, title: string) => void;
  onCardDeleted: (id: string) => void;
};

const StoryColumns: React.FC<Props> = ({
  cards,
  onCardUpdated,
  onCardInserted,
  onTitleUpdated,
  onCardDeleted,
}) => {
  return (
    <div className={styles.container}>
      {cards.map((column, i) => (
        <div key={i} className={styles.column}>
          <AddNewCard onAddNewClick={() => onCardInserted(i + 1, 1)} />
          {column.map((card) => (
            <StoryCard
              key={`${card.col}-${card.row}`}
              id={`${card.col}-${card.row}`}
              onUpdatedMd={(md) => onCardUpdated(`${card.col}-${card.row}`, md)}
              onUpdateTitle={(title) =>
                onTitleUpdated(`${card.col}-${card.row}`, title)
              }
              onDelete={() => onCardDeleted(`${card.col}-${card.row}`)}
              {...card}
            />
          ))}
          <AddNewCard
            onAddNewClick={() => onCardInserted(i + 1, column.length + 1)}
          />
        </div>
      ))}
    </div>
  );
};

export default StoryColumns;
