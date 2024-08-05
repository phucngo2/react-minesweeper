import { Cell } from "@app/components";
import { generateBoards, placeMines } from "@app/handlers";

export const Board = () => {
  return (
    <div
      className="grid gap-0.5"
      style={{
        gridTemplateColumns: "repeat(30, 1fr)",
        gridTemplateRows: "repeat(16, 1fr)",
      }}
    >
      {placeMines(generateBoards(16, 30), 99)
        .flat()
        .map((cell, index) => (
          <Cell key={index} cell={cell} />
        ))}
    </div>
  );
};
