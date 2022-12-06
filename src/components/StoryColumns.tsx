import { Card } from "@models/Card";
import React from "react";

import StoryCard from "./StoryCard";
import styles from "./StoryColumns.module.scss";

type Props = {
  cards: Card[][];
  onCardUpdated: (id: string, md: string) => void;
};

const StoryColumns: React.FC<Props> = ({ cards, onCardUpdated }) => {
  return (
    <div className={styles.container}>
      {cards.map((column, i) => (
        <div key={i} className={styles.column}>
          {column.map((card) => (
            <StoryCard
              key={`${card.col}-${card.row}`}
              id={`${card.col}-${card.row}`}
              onUpdatedMd={(md) => onCardUpdated(`${card.col}-${card.row}`, md)}
              {...card}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default StoryColumns;
