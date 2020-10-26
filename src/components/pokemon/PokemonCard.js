import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import styled from 'styled-components';
import Spinner from 'react-bootstrap/Spinner';
import { Link } from 'react-router-dom';

const Sprite = styled.img`
    width: 5em;
    height: 5em;
    display:none;
`;

const StyledCard = styled(Card)`
box-shadow: 0 1px 3px rgba(0,0,0, .012), 0 1px 2px rgba(0,0,0,.24);
`;

const StyledLink = styled(Link)`
text-decoration:none;
color:black;
&:focus,
&:hover,
&:visited,
&:link,
&active {
    text-decoration: none;
}
`;



export default class PokemonCard extends Component {
    state = {
        name: '',
        imageUrl: '',
        pokemonIndex: ''
    }

    componentDidMount() {
        const { name, url } = this.props;
        const pokemonIndex = url.split("/")[url.split('/').length - 2];
        const imageUrl = `https://github.com/PokeAPI/sprites/blob/master/sprites/pokemon/${pokemonIndex}.png?raw=true`;

        this.setState({
            name: name,
            imageUrl: imageUrl,
            pokemonIndex: pokemonIndex,
            toManyRequests: false
        });
    }

    render() {

        return (
            <div className="mt-5 col-md-3 col-sm-6 mb-5">
                <StyledLink to={`pokemon/${this.state.pokemonIndex}`}>
                    <StyledCard>
                        <Card.Header>{this.state.pokemonIndex}</Card.Header>
                        {this.state.imageLoading ? (
                            <Spinner animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        ) : null}
                        <Card.Body className="mx-auto">
                            {/* <Card.Img variant="top" className="rounded mx-auto mt-2" src={this.state.imageUrl}></Card.Img> */}
                            <Sprite
                                className="card-img-top rounded mx-auto mt-2"
                                onLoad={() => this.setState({ imageLoading: false })}
                                onError={() => this.setState({ toManyRequests: true })}
                                src={this.state.imageUrl}
                                style={
                                    this.state.toManyRequests ? { display: "none" } :
                                        this.state.imageLoading ? null : { display: "block" }
                                }
                            >

                            </Sprite>
                            {this.state.toManyRequests ? (<h6 className="mx-auto"><span className="badge badge-danger mt-2">To Many Requests</span></h6>) : null}
                            <Card.Title>{this.state.name
                                .toLowerCase()
                                .split(" ")
                                .map(
                                    letter => letter.charAt(0).toUpperCase() + letter.substring(1)
                                )
                                .join(' ')}
                            </Card.Title>
                        </Card.Body>
                    </StyledCard>
                </StyledLink>

            </div>
        )
    }
}
