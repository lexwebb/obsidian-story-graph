import { Card } from "@models/Card";

export const serializeCards = (cards: Card[][]): string => {
  let data = "";

  cards.forEach((column, colIndex) => {
    if (!column) return;
    column.forEach((card, index) => {
      if (!card) return;

      let cardData = `:::card{c=${colIndex} r=${index}}\r\n`;

      if (card.links)
        card.links.forEach((link) => {
          cardData += `:link{c=${link.col} r=${link.row}}\r\n`;
        });

      cardData += `:meta{title="${card.title}"}\r\n`;

      const filteredMd = card.md.replace(/^:.*(\n|\r\n)?/gm, "");

      cardData += filteredMd;

      if (!cardData.endsWith("\r\n") || !cardData.endsWith("\n")) {
        cardData += "\r\n";
      }
      cardData += ":::\r\n\r\n";

      data += cardData;
    });
  });

  return data;
};
