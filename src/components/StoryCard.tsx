import { Card } from "@models/Card";
import React from "react";

import styles from "./StoryCard.module.scss";

interface StoryCardProps extends Card {
  id: string;
}

const StoryCard: React.FC<StoryCardProps> = ({ title, md }) => {
  return (
    <div className={styles.card}>
      <div className={styles.title}>{title}</div>
      <div className={styles.body}>
        {/* {parse(html.replace("<p><div></div></p>", ""))} */}
        {md}
      </div>
    </div>
  );
};

export default StoryCard;
