import { Card } from "@models/Card";
import parse from "html-react-parser";
import React from "react";

import styles from "./StoryCard.module.scss";

interface StoryCardProps extends Card {
  id: string;
}

const StoryCard: React.FC<StoryCardProps> = ({ id, col, row, title, html }) => {
  return (
    <div className={styles.card}>
      <div className={styles.title}>{title}</div>
      <div className={styles.body}>
        {parse(html.replace("<p><div></div></p>", ""))}
      </div>
    </div>
  );
};

export default StoryCard;
