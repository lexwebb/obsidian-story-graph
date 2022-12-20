import { Card } from "@models/Card";
import parse from "html-react-parser";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import remarkHtml from "remark-html";
import remarkParse from "remark-parse";
import { unified } from "unified";

import BinIcon from "./icons/BinIcon";
import styles from "./StoryCard.module.scss";

interface StoryCardProps extends Card {
  onUpdatedMd: (md: string) => void;
  onUpdateTitle: (title: string) => void;
  onDelete: () => void;
}

type Mode = "md" | "html" | "title";

const StoryCard: React.FC<StoryCardProps> = ({
  id,
  links,
  title,
  content,
  onUpdatedMd,
  onUpdateTitle,
  onDelete,
}) => {
  const [mode, setMode] = useState<Mode>("html");
  const [dirtyMd, setDirtyMd] = useState<string>(
    content.replace(/^:.*(\n|\r\n)?/gm, "")
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
    setDirtyMd(content.replace(/^:.*(\n|\r\n)?/gm, ""));
  }, [content]);

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

  const asHtml = useMemo(() => {
    return unified().use(remarkParse).use(remarkHtml).processSync(content)
      .value as string;
  }, [content]);

  return (
    <div className={styles.card} id={id}>
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
          parse(asHtml.replace("<p><div></div></p>", ""))
        )}
      </div>
    </div>
  );
};

export default StoryCard;
