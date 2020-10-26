import './App.css';
import DashBoard from './components/layout/Dashboard';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Container } from 'react-bootstrap';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Pokemon from './components/pokemon/Pokemon';

function App() {
  return (

    <Router>
      <div className="App">

        <Navbar collapseOnSelect expand="lg" bg="danger" variant="dark">
          <Navbar.Brand href="#home">Pokedex</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="#List">List</Nav.Link>
              <Nav.Link href="#Favorite">Favorite</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Container>
          <Switch>
            <Route exact path="/" component={DashBoard} />
            <Route exact path="/pokemon/:pokemonIndex" component={Pokemon} />
            <DashBoard />
          </Switch>

        </Container>

      </div>
    </Router>

  );
}

export default App;
