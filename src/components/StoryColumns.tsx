import { Card } from "@models/Card";
import React from "react";

import StoryCard from "./StoryCard";
import styles from "./StoryColumns.module.scss";

type Props = {
  cards: Card[][];
};

const StoryColumns: React.FC<Props> = ({ cards }) => {
  return (
    <div className={styles.container}>
      {cards.map((column, i) => (
        <div key={i} className={styles.column}>
          {column.map((card) => (
            <StoryCard
              key={`${card.col}-${card.row}`}
              id={`${card.col}-${card.row}`}
              {...card}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default StoryColumns;
