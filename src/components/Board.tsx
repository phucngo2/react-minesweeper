import { Cell } from "@app/components";

export const Board = () => {
  return (
    <div
      className="grid gap-0.5"
      style={{
        gridTemplateColumns: "repeat(30, 1fr)",
        gridTemplateRows: "repeat(16, 1fr)",
      }}
    >
      {[...Array(480).keys()].map((item: number) => (
        <Cell key={item} />
      ))}
    </div>
  );
};
