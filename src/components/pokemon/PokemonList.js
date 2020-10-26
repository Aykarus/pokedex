import React, { Component } from 'react';
import { Container, Row } from 'react-bootstrap';
import PokemonCard from './PokemonCard';
import axios from 'axios';

export default class PokemonList extends Component {
    // limit=60&offset=60
    state = {
        url: "https://pokeapi.co/api/v2/pokemon/",
        pokemon: null
    };

    async componentDidMount() {
        const res = await axios.get(this.state.url);
        this.setState({ pokemon: res.data['results'] })
    }

    render() {
        return (
            <Container>
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
