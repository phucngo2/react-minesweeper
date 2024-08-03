import { Container, Layout } from "@app/components";
import "./App.css";

function App() {
  return (
    <Layout>
      <Container>
        <h1 className="text-blue-600">Hello, 世界!</h1>
        <button className="btn btn-primary">Click me!</button>
      </Container>
    </Layout>
  );
}

export default App;
