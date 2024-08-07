import { Board, Card, Layout } from "@app/components";
import "./App.css";
import { Header } from "./components/Header";

function App() {
  return (
    <Layout>
      <Header />
      <Card>
        <Board />
      </Card>
    </Layout>
  );
}

export default App;
