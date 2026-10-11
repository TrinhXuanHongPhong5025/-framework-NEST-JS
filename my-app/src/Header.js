import { useState } from "react";
import { Navbar, Nav, Container, NavDropdown, Modal, Row, Col, Button } from "react-bootstrap";
import AccountModal from "./AccountModal";

function Header({ favorites, favoriteProfiles, favoriteProfileCount, artifacts, onOpenArtifactManager, onToggleFavorite, onToggleProfileFavorite, onOpenProfile, authToken, authUser, authChecking, onAuthenticated, onLogout }) {
    const [showFavorites, setShowFavorites] = useState(false);
    const [showAccount, setShowAccount] = useState(false);
    const favoriteItems = favorites.map((favorite) => {
        if (favorite.startsWith("artifact:")) {
            const artifact = artifacts.find((item) => `artifact:${item.id}` === favorite);
            return artifact ? { key: favorite, image: artifact.imageData, title: artifact.title } : null;
        }
        return { key: favorite, image: favorite, title: "Hiện vật yêu thích" };
    }).filter(Boolean);
    const favoriteCount = favoriteItems.length + favoriteProfileCount;

    return (
        <>
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

                        <button
                            type="button"
                            className="nav-link favorites-trigger"
                            aria-label={`Mở danh sách yêu thích (${favoriteCount})`}
                            onClick={() => setShowFavorites(true)}
                        >
                            <i className="bi bi-heart-fill fs-5" aria-hidden="true"></i>
                            <span className="favorites-count">{favoriteCount}</span>
                        </button>

                        {authUser?.role === "admin" && (
                            <button
                                type="button"
                                className="nav-link account-trigger artifact-manager-trigger"
                                aria-label="Quản lý hiện vật"
                                title="Quản lý hiện vật"
                                onClick={() => onOpenArtifactManager()}
                            >
                                <i className="bi bi-flag-fill fs-5" aria-hidden="true"></i>
                            </button>
                        )}

                        <button
                            type="button"
                            className="nav-link account-trigger"
                            aria-label={authUser ? `Tài khoản ${authUser.username}` : "Đăng nhập quản trị"}
                            onClick={() => setShowAccount(true)}
                        >
                            <i className={`bi ${authUser ? "bi-person-check-fill" : "bi-person-circle"} fs-4`} aria-hidden="true"></i>
                            {authUser?.role === "admin" && <span>Admin</span>}
                        </button>

                    </Nav>

                </Navbar.Collapse>

            </Container>

        </Navbar>

        <Modal show={showFavorites} onHide={() => setShowFavorites(false)} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Danh sách yêu thích ({favoriteCount})</Modal.Title>
            </Modal.Header>
            <Modal.Body className="favorites-body">
                <section className="favorites-section">
                    <h5>Hiện vật ({favorites.length})</h5>
                    {favorites.length === 0 ? (
                    <p className="favorites-empty">Bạn chưa lưu hiện vật nào.</p>
                ) : (
                    <Row className="g-3">
                        {favoriteItems.map((item) => (
                            <Col xs={6} md={4} key={item.key}>
                                <div className="favorite-item">
                                    <img src={item.image} alt={item.title} />
                                    <Button
                                        variant="light"
                                        className="favorite-remove"
                                        aria-label="Bỏ yêu thích hiện vật"
                                        onClick={() => onToggleFavorite(item.key)}
                                    >
                                        <i className="bi bi-heartbreak" aria-hidden="true"></i>
                                    </Button>
                                </div>
                            </Col>
                        ))}
                    </Row>
                )}
                </section>
                <section className="favorites-section profile-favorites-section">
                    <h5>Hồ sơ người dùng ({favoriteProfileCount})</h5>
                    {favoriteProfiles.length === 0 ? (
                        <p className="favorites-empty">Bạn chưa lưu hồ sơ nào.</p>
                    ) : (
                        <div className="favorite-profiles-list">
                            {favoriteProfiles.map((user) => (
                                <div className="favorite-profile-row" key={user.id}>
                                    <button
                                        type="button"
                                        className="favorite-profile-open"
                                        onClick={() => {
                                            setShowFavorites(false);
                                            onOpenProfile(user);
                                        }}
                                    >
                                        <span className="favorite-profile-avatar">{user.name.charAt(0)}</span>
                                        <span className="favorite-profile-details">
                                            <strong>{user.name}</strong>
                                            <small>{user.company.name}</small>
                                        </span>
                                    </button>
                                    <Button
                                        variant="light"
                                        className="favorite-remove"
                                        aria-label={`Bỏ yêu thích profile ${user.name}`}
                                        onClick={() => onToggleProfileFavorite(user.id)}
                                    >
                                        <i className="bi bi-heartbreak" aria-hidden="true"></i>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </Modal.Body>
        </Modal>

        <AccountModal
            show={showAccount}
            onHide={() => setShowAccount(false)}
            user={authUser}
            token={authToken}
            authChecking={authChecking}
            onAuthenticated={onAuthenticated}
            onLogout={() => {
                onLogout();
                setShowAccount(false);
            }}
        />

        </>
    )

}

export default Header;