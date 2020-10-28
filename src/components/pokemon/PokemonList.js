import React, { Component } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import PokemonCard from './PokemonCard';
import axios from 'axios';

export default class PokemonList extends Component {

    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         url: `https://pokeapi.co/api/v2/pokemon/?limit=10&offset=0`,
    //         pokemon: null,
    //         pg: 0
    //     };
    // }

    state = {
        url: `https://pokeapi.co/api/v2/pokemon/?limit=10&offset=0`,
        pokemon: null,
        pg: 0
    }

    async componentDidMount() {
        const res = await axios.get(this.state.url);
        this.setState({ pokemon: res.data['results'] });
        // console.log(this.state.url)
    }

    add = () => {
        console.log("Clicked")

        try {
            // console.log(this.state.pg + "before")
            // console.log(this.state.url + "before")
            this.setState({
                pg: this.state.pg + 10,
                url: `https://pokeapi.co/api/v2/pokemon/?limit=10&offset=${this.state.pg + 10}`
            }, async () => {
                // console.log(this.state.pg + "after")
                // console.log(this.state.url + "after")
                const res = await axios.get(this.state.url);
                this.setState({ pokemon: res.data['results'] });
            });
        } catch {
            console.log('error')
        }

    }

    sub = () => {
        console.log("Clicked")

        if (this.state.pg > 0) {
            try {
                // console.log(this.state.pg + "before")
                // console.log(this.state.url + "before")
                this.setState({
                    pg: this.state.pg - 10,
                    url: `https://pokeapi.co/api/v2/pokemon/?limit=10&offset=${this.state.pg - 10}`
                }, async () => {
                    // console.log(this.state.pg + "after")
                    // console.log(this.state.url + "after")
                    const res = await axios.get(this.state.url);
                    this.setState({ pokemon: res.data['results'] });
                });
            } catch {
                console.log('error')
            }
        }


    }

    render() {
        return (
            <Container>
                <Row className="justify-content-md-center mt-5">
                    <Col>
                        <Button variant="danger" onClick={this.sub} block>-</Button>
                    </Col>
                    <Col>
                        <Button onClick={this.add} block>+</Button>
                    </Col>
                </Row>
                <React.Fragment>
                    {
                        this.state.pokemon ? (<Row>
                            {this.state.pokemon.map(pokemon => (
                                <PokemonCard
                                    key={pokemon.name}
                                    name={pokemon.name}
                                    url={pokemon.url}
                                />
                            ))}
                        </Row>) : (<h1>Loading Pokemon</h1>)
                    }
                </React.Fragment>
            </Container>


        )
    }

}
