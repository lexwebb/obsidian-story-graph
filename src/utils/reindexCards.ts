import { Card } from "@models/Card";

export const reindexCards = (
  cards: Card[][],
  changedIndex: number
): Card[][] => {
  const newCards = [...cards];
  // newCards[changedIndex].splice(row - 1, 0, {
  //   col: String(column),
  //   row: String(row),
  //   links: [],
  //   title: "",
  //   md: "",
  //   html: "",
  // });

  for (let i = newCards[changedIndex].length - 1; i >= 0; i--) {
    newCards[changedIndex][i].row = String(i + 1);
  }

  return cards;
};
