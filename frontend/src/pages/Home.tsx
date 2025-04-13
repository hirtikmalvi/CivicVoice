import React from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #008080, #20c997)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
      }}
    >
      <Container
        className="text-center p-5 rounded shadow-lg"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
      >
        <h1 className="display-4 fw-bold mb-3">Welcome to CivicVoice</h1>
        <p className="lead mb-4">
          Empowering citizens to report municipal issues and track their
          resolution — quickly and transparently.
        </p>
        <Row className="justify-content-center">
          <Col xs="auto">
            <Button
              variant="light"
              size="lg"
              className="m-2 px-4"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </Col>
          <Col xs="auto">
            <Button
              variant="outline-light"
              size="lg"
              className="m-2 px-4"
              onClick={() => navigate("/register")}
            >
              Register
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
