// src/Complaints/ProfileCard.tsx
import React, { useState } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import { getUserFromToken } from "../hooks/useAuth";
import { FaUserCircle } from "react-icons/fa";

const ProfileCard: React.FC = () => {
  const user = getUserFromToken();
  const [show, setShow] = useState(false);

  return (
    <>
      <Button variant="light" onClick={() => setShow(true)} className="p-0 border-0">
        {/* <FaUserCircle size={32} /> */}
      </Button>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>User Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {user ? (
            <Card>
              <Card.Body>
                <Card.Title>{user.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{user.email}</Card.Subtitle>
                <Card.Text>
                  <strong>Role:</strong> {user.role}
                </Card.Text>
              </Card.Body>
            </Card>
          ) : (
            <p>User not found</p>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProfileCard;
