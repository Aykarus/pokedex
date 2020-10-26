import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import PokemonList from '../pokemon/PokemonList';

export default class Dashboard extends Component {
    render() {
        return (

            <Row>
                <Col>
                    <PokemonList></PokemonList>
                </Col>
            </Row>

        )
    }
}
