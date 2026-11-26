import {
  Board,
  Card,
  GameOverModal,
  Header,
  Layout,
} from "@app/components";
import { useGameShortcuts, useTheme } from "@app/hooks";
import "./App.css";

function App() {
  useTheme();
  useGameShortcuts();

  return (
    <Layout>
      <Header />
      <Card>
        <Board />
      </Card>
      <GameOverModal />
    </Layout>
  );
}

export default App;
