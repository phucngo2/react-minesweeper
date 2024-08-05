import { Cell as ICell } from "@app/types";

interface Props {
  cell: ICell;
}

export const Cell: React.FC<Props> = ({ cell }) => {
  return (
    <button className="w-6 h-6 p-1 btn min-w-6 min-h-6">
      {cell.hasMine ? "💣" : ""}
    </button>
  );
};
