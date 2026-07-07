import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";

function Header() {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand>MY APP</Navbar.Brand>

        <Navbar.Toggle />

        <Navbar.Collapse>
          <Nav>
            <Nav.Link href="#">Home</Nav.Link>
            <Nav.Link href="#">Link</Nav.Link>

            <NavDropdown title="Options">
              <NavDropdown.Item>Option 1</NavDropdown.Item>
              <NavDropdown.Item>Option 2</NavDropdown.Item>
            </NavDropdown>

          </Nav>
        </Navbar.Collapse>

      </Container>
    </Navbar>
  );
}

export default Header;