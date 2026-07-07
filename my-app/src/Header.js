import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";

function Header() {

    return (

        <Navbar expand="lg" className="custom-navbar">

            <Container>

                <Navbar.Brand className="logo">

                    <i className="bi bi-bootstrap-fill"></i>

                    {" "}MY APP

                </Navbar.Brand>

                <Navbar.Toggle />

                <Navbar.Collapse>

                    <Nav className="mx-auto">

                        <Nav.Link href="#">Home</Nav.Link>

                        <Nav.Link href="#">Products</Nav.Link>

                        <Nav.Link href="#">Gallery</Nav.Link>

                        <NavDropdown title="More">

                            <NavDropdown.Item>About</NavDropdown.Item>

                            <NavDropdown.Item>Contact</NavDropdown.Item>

                        </NavDropdown>

                    </Nav>

                    <Nav>

                        <Nav.Link>

                            <i className="bi bi-search fs-5"></i>

                        </Nav.Link>

                        <Nav.Link>

                            <i className="bi bi-heart fs-5"></i>

                        </Nav.Link>

                        <Nav.Link>

                            <i className="bi bi-person-circle fs-4"></i>

                        </Nav.Link>

                    </Nav>

                </Navbar.Collapse>

            </Container>

        </Navbar>

    )

}

export default Header;