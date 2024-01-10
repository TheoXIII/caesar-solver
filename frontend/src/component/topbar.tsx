import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'

export default function TopBar() {
    return(
        <Navbar bg="light" data-bs-theme="light">
            <Container>
            <Nav className="me-auto">
                <Nav.Link href="/sentiment-analysis">Sentiment Analysis</Nav.Link>
                <Nav.Link href="/caesar-solver">Caesar Solver</Nav.Link>
            </Nav>
            </Container>
        </Navbar>
    )
}