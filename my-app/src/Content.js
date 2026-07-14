import { useEffect, useState } from "react";
import axios from "axios";

import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Modal,
  Button
} from "react-bootstrap";

function Content() {

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [show, setShow] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((res) => {
        setUsers(res.data);
      });
  }, []);

  const openProfile = (user) => {
    setSelectedUser(user);
    setShow(true);
  };

  const closeProfile = () => {
    setShow(false);
  };

  const filterUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container className="my-5">

      {/* Statistics */}

      <Row className="mb-4 g-4">

        <Col md={4}>
          <div className="stats-card">
            <h2>{users.length}</h2>
            <p>Total Users</p>
          </div>
        </Col>

        <Col md={4}>
          <div className="stats-card">
            <h2>{new Set(users.map((u) => u.company.name)).size}</h2>
            <p>Companies</p>
          </div>
        </Col>

        <Col md={4}>
          <div className="stats-card">
            <h2>React</h2>
            <p>Bootstrap UI</p>
          </div>
        </Col>

      </Row>

      {/* Search */}

      <Form className="mb-5">

        <Form.Control
          className="search-box"
          placeholder="🔍 Search user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </Form>

      {/* User Card */}

      <Row className="g-4">

        {filterUsers.map((user) => (

          <Col lg={4} md={6} key={user.id}>

            <Card className="user-card">

              <Card.Body>

                <div className="avatar">

                  {user.name.charAt(0)}

                </div>

                <h4>{user.name}</h4>

                <p>📧 {user.email}</p>

                <p>🏢 {user.company.name}</p>

                <p>🌐 {user.website}</p>

                <button
                  className="profile-btn"
                  onClick={() => openProfile(user)}
                >
                  View Profile
                </button>

              </Card.Body>

            </Card>

          </Col>

        ))}

      </Row>

      {/* Modal */}

      <Modal
        show={show}
        onHide={closeProfile}
        centered
      >

        <Modal.Header closeButton>

          <Modal.Title>

            👤 User Profile

          </Modal.Title>

        </Modal.Header>

        <Modal.Body>

          {selectedUser && (

            <>

              <div className="text-center mb-4">

                <div className="avatar mx-auto">

                  {selectedUser.name.charAt(0)}

                </div>

                <h3 className="mt-3">

                  {selectedUser.name}

                </h3>

              </div>

              <p><strong>📧 Email:</strong> {selectedUser.email}</p>

              <p><strong>📱 Phone:</strong> {selectedUser.phone}</p>

              <p><strong>🌍 Website:</strong> {selectedUser.website}</p>

              <p><strong>🏢 Company:</strong> {selectedUser.company.name}</p>

              <p>

                <strong>🏠 Address:</strong>{" "}

                {selectedUser.address.street},{" "}

                {selectedUser.address.city}

              </p>

            </>

          )}

        </Modal.Body>

        <Modal.Footer>

          <Button
            variant="secondary"
            onClick={closeProfile}
          >

            Close

          </Button>

        </Modal.Footer>

      </Modal>

    </Container>
  );

}

export default Content;