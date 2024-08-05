import { Cell as ICell } from "@app/types";
import { useMemo } from "react";

interface Props {
  cell: ICell;
}

export const Cell: React.FC<Props> = ({ cell }) => {
  let renderContent = useMemo(() => {
    if (cell.hasMine) return "💣";
    if (cell.adjacentMines) return cell.adjacentMines;
    return "";
  }, [cell]);

  return (
    <button className="w-6 h-6 p-1 btn min-w-6 min-h-6">{renderContent}</button>
  );
};
