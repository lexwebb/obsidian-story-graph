import { Card } from "@models/Card";
import isEqual from "lodash.isequal";
import React, { useCallback, useLayoutEffect, useState } from "react";
import {
  useBoundingclientrectRef,
  useDimensionsRef,
  useTimeoutWhen,
} from "rooks";

import AddNewCard from "./AddNewCard";
import StoryCard from "./StoryCard";
import styles from "./StoryColumns.module.scss";

type Props<T> = {
  cards: T;
  onCardUpdated: (id: string, md: string) => void;
  onCardInserted: (column: number, row: number) => void;
  onTitleUpdated: (id: string, title: string) => void;
  onCardDeleted: (id: string) => void;
};

const StoryColumns: React.FC<Props<Card[][] | undefined>> = ({
  cards,
  onCardUpdated,
  onCardInserted,
  onTitleUpdated,
  onCardDeleted,
}) => {
  if (!cards || !cards.length) return null;

  return (
    <div className={styles.container}>
      {cards.map((column, i) => (
        <Column
          cards={column}
          key={i}
          index={i}
          onCardUpdated={onCardUpdated}
          onCardInserted={onCardInserted}
          onTitleUpdated={onTitleUpdated}
          onCardDeleted={onCardDeleted}
        />
      ))}
      <div className={styles.column}>
        <AddNewCard
          onAddNewClick={() => onCardInserted(cards?.length || 0, 1)}
        />
      </div>
    </div>
  );
};

const Column: React.FC<Props<Card[]> & { index: number }> = ({
  cards,
  index,
  onCardInserted,
  onCardDeleted,
  onCardUpdated,
  onTitleUpdated,
}) => {
  const [ref, boundingClientRect] = useBoundingclientrectRef();
  const [links, setLinks] = useState<
    { fromY: number; toPoss: { x: number; y: number }[] }[]
  >([]);

  const getLinkPoss = useCallback(() => {
    return (
      cards?.map((card) => {
        const fromEl = document.getElementById(card.id);

        if (!fromEl) return { fromY: 0, toPoss: [] };

        const from = document.getElementById(card.id)?.getBoundingClientRect();
        const to = card.links?.map((id) =>
          document.getElementById(id)?.getBoundingClientRect()
        );

        if (!from || !to) return { fromY: 0, toPoss: [] };

        const fromY = from.y + from.height / 2;

        const toPoss = to.map((to) => {
          if (!to) return { x: 0, y: 0 };
          const x = to.x;
          const y = to.y + to.height / 2;
          return { x, y };
        });

        return { fromY, toPoss };
      }) || []
    );
  }, [cards]);

  useLayoutEffect(() => {
    const linkPoss = getLinkPoss();

    if (!isEqual(linkPoss, links)) setLinks(linkPoss);
  }, [getLinkPoss, links, boundingClientRect]);

  useTimeoutWhen(
    () => {
      const linkPoss = getLinkPoss();

      if (!isEqual(linkPoss, links)) setLinks(linkPoss);
    },
    50,
    true
  );

  return (
    <>
      <div className={styles.column} ref={ref}>
        <AddNewCard onAddNewClick={() => onCardInserted(index, 0)} />
        {cards.map((card, j) => (
          <StoryCard
            key={card.id}
            onUpdatedMd={(md) => onCardUpdated(`${index}-${j}`, md)}
            onUpdateTitle={(title) => onTitleUpdated(`${index}-${j}`, title)}
            onDelete={() => onCardDeleted(`${index}-${j}`)}
            {...card}
          />
        ))}
        {cards.length !== 0 && (
          <AddNewCard
            onAddNewClick={() => onCardInserted(index, cards.length)}
          />
        )}
      </div>
      <svg width={80} className={styles.connectorContainer}>
        {links.some((l) => l.toPoss.some((p) => p.y)) &&
          links?.map((link) => {
            return (
              <>
                {link.toPoss.map((to) => {
                  return (
                    <>
                      <line
                        key={`${link.fromY}-${to.x}-${to.y}`}
                        x1={0}
                        y1={link.fromY - (boundingClientRect?.y || 0)}
                        x2={80}
                        y2={to.y - (boundingClientRect?.y || 0)}
                      />
                      <circle
                        r={5}
                        cx={80}
                        cy={to.y - (boundingClientRect?.y || 0)}
                      />
                    </>
                  );
                })}
                <circle
                  r={5}
                  cx={0}
                  cy={link.fromY - (boundingClientRect?.y || 0)}
                />
              </>
            );
          })}
      </svg>
    </>
  );
};

export default StoryColumns;
