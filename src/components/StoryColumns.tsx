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
          <AddNewCard onAddNewClick={() => onCardInserted(i, 1)} />
          {column.map((card, j) => (
            <StoryCard
              key={card.id}
              id={card.id}
              onUpdatedMd={(md) => onCardUpdated(`${i}-${j}`, md)}
              onUpdateTitle={(title) => onTitleUpdated(`${i}-${j}`, title)}
              onDelete={() => onCardDeleted(`${i}-${j}`)}
              {...card}
            />
          ))}
          {column.length !== 0 && (
            <AddNewCard
              onAddNewClick={() => onCardInserted(i, column.length)}
            />
          )}
        </div>
      ))}
      <div className={styles.column}>
        <AddNewCard onAddNewClick={() => onCardInserted(cards.length, 1)} />
      </div>
    </div>
  );
};

export default StoryColumns;
