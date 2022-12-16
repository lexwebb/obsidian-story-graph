import { Card } from "@models/Card";
import parse from "html-react-parser";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import BinIcon from "./icons/BinIcon";
import styles from "./StoryCard.module.scss";

interface StoryCardProps extends Card {
  id: string;
  onUpdatedMd: (md: string) => void;
  onUpdateTitle: (title: string) => void;
  onDelete: () => void;
}

type Mode = "md" | "html" | "title";

const StoryCard: React.FC<StoryCardProps> = ({
  title,
  md,
  html,
  onUpdatedMd,
  onUpdateTitle,
  onDelete,
}) => {
  const [mode, setMode] = useState<Mode>("html");
  const [dirtyMd, setDirtyMd] = useState<string>(
    md.replace(/^:.*(\n|\r\n)?/gm, "")
  );
  const [dirtyTitle, setDirtyTitle] = useState<string>(title);

  const onContentClick = () => {
    setMode("md");
  };

  const onTitleClick = () => {
    setMode("title");
  };

  const updateMd = () => {
    setMode("html");
    onUpdatedMd(dirtyMd);
  };

  const updateTitle = useCallback(() => {
    setMode("html");
    onUpdateTitle(dirtyTitle);
  }, [dirtyTitle, onUpdateTitle]);

  useEffect(() => {
    setDirtyMd(md.replace(/^:.*(\n|\r\n)?/gm, ""));
  }, [md]);

  const titleContent = useMemo(() => {
    if (mode === "title")
      return (
        <input
          type="text"
          autoFocus
          value={dirtyTitle}
          onChange={(e) => setDirtyTitle(e.target.value)}
          placeholder={"Enter title..."}
          onBlur={updateTitle}
          onSubmit={updateTitle}
          onKeyDown={(e) => {
            if (e.key === "Enter") updateTitle();
          }}
        />
      );

    if (!dirtyTitle) return <i>Unnamed</i>;
    return title;
  }, [dirtyTitle, mode, title, updateTitle]);

  return (
    <div className={styles.card}>
      <div className={styles.titleArea}>
        <div className={styles.title} onClick={onTitleClick}>
          {titleContent}
        </div>
        <div className="clickable-icon" onClick={onDelete}>
          <BinIcon />
        </div>
      </div>
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
