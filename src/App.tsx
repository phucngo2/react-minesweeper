import { Board, Card, Header, Layout } from "@app/components";
import "./App.css";

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
