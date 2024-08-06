import { Board, Container, Layout } from "@app/components";
import "./App.css";
import { Header } from "./components/Header";

function App() {
  return (
    <Layout>
      <Header />
      <Container>
        <Board />
      </Container>
    </Layout>
  );
}

export default App;
