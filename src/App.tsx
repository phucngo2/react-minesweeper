import {
  Board,
  Card,
  GameOverModal,
  Header,
  Layout,
} from "@app/components";
import { useGameShortcuts } from "@app/hooks";
import "./App.css";

function App() {
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
