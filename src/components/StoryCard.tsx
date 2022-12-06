import { useFocus } from "@hooks/useFocus";
import { Card } from "@models/Card";
import parse from "html-react-parser";
import React, { useRef, useState } from "react";

import styles from "./StoryCard.module.scss";

interface StoryCardProps extends Card {
  id: string;
  onUpdatedMd: (md: string) => void;
}

const StoryCard: React.FC<StoryCardProps> = ({
  title,
  md,
  html,
  onUpdatedMd,
}) => {
  const [mode, setMode] = useState<"md" | "html">("html");
  const [dirtyMd, setDirtyMd] = useState<string>(
    md.replace(/^:.*(\n|\r\n)?/gm, "")
  );

  const onContentClick = () => {
    setMode("md");
  };

  const updateMd = () => {
    setMode("html");
    onUpdatedMd(dirtyMd);
  };

  return (
    <div className={styles.card}>
      <div className={styles.title}>{title}</div>
      <div className={styles.body} onClick={onContentClick}>
        {mode === "md" ? (
          <textarea
            value={dirtyMd}
            onChange={(e) => setDirtyMd(e.target.value)}
            onBlur={updateMd}
            autoFocus
          />
        ) : (
          parse(html.replace("<p><div></div></p>", ""))
        )}
      </div>
    </div>
  );
};

export default StoryCard;
