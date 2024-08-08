import { GameStates } from "@app/config";
import { useNewGame } from "@app/hooks";
import { gameStateAtom } from "@app/stores";
import { useAtomValue } from "jotai";

export const ButtonPlay = () => {
  const newGame = useNewGame();

  return (
    <div className="tooltip tooltip-bottom" data-tip="New Game">
      <button
        onClick={() => newGame()}
        className="w-10 h-10 min-h-0 text-xl btn"
      >
        <ButtonPlayContent />
      </button>
    </div>
  );
};

function ButtonPlayContent() {
  const gameState = useAtomValue(gameStateAtom);

  switch (gameState) {
    case GameStates.Won:
      return <>😎</>;
    case GameStates.Lost:
      return <>🤯</>;

    default:
      return <>🙂</>;
  }
}
