import React, { Component } from 'react';
import Axios from 'axios';
import { Card, Row, Col, Image, ProgressBar } from 'react-bootstrap';

const TYPE_COLORS = {
    bug: 'B1C12E',
    dark: '4F3A2D',
    dragon: '755EDF',
    electric: 'FCBC17',
    fairy: 'F4B1F4',
    fighting: '823551D',
    fire: 'E73B0C',
    flying: 'A3B3F7',
    ghost: '6060B2',
    grass: '74C236',
    ground: 'D3B357',
    ice: 'A3E7FD',
    normal: 'C8C4BC',
    poison: '934594',
    psychic: 'ED4882',
    rock: 'B9A156',
    steel: 'B5B5C3',
    water: '3295F6'
};

export default class Pokemon extends Component {
    state = {
        name: '',
        pokemonIndex: '',
        imageUrl: '',
        types: [],
        description: '',
        stats: {
            hp: '',
            attack: '',
            defense: '',
            speed: '',
            specialAttack: '',
            specialDefense: ''
        },
        height: '',
        weight: '',
        eggGroups: '',
        catchRate: '',
        abilities: '',
        genderRatioMale: '',
        genderRatioFemale: '',
        evs: '',
        hatchSteps: '',
        themeColor: '#EF5350'

    };

    async componentDidMount() {
        const { pokemonIndex } = this.props.match.params;

        //urls for pokemon information
        const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonIndex}/`;
        const pokemonSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonIndex}/`;

        //get information
        const pokemonRes = await Axios.get(pokemonUrl);

        const name = pokemonRes.data.name;
        const imageUrl = pokemonRes.data.sprites.front_default;

        let { hp, attack, defense, speed, specialAttack, specialDefense } = '';

        pokemonRes.data.stats.map(stat => {
            switch (stat.stat.name) {
                case 'hp':
                    hp = stat['base_stat'];
                    break;
                case 'attack':
                    attack = stat['base_stat'];
                    break;
                case 'defense':
                    defense = stat['base_stat'];
                    break;
                case 'speed':
                    speed = stat['base_stat'];
                    break;
                case 'special-attack':
                    specialAttack = stat['base_stat'];
                    break;
                case 'special-defense':
                    specialDefense = stat['base_stat'];
                    break;
                default:
                    break;
            }
        })

        // Convert Decimeters to Feet... The + 0.0001 * 100 ) / 100 is for rounding to two decimal places :)
        const height =
            Math.round((pokemonRes.data.height * 0.328084 + 0.00001) * 100) / 100;

        const weight =
            Math.round((pokemonRes.data.weight * 0.220462 + 0.00001) * 100) / 100;

        const types = pokemonRes.data.types.map(type => type.type.name);

        const themeColor = `${TYPE_COLORS[types[types.length - 1]]}`;

        const abilities = pokemonRes.data.abilities
            .map(ability => {
                return ability.ability.name
                    .toLowerCase()
                    .split('-')
                    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(' ');
            })
            .join(', ');

        const evs = pokemonRes.data.stats
            .filter(stat => {
                if (stat.effort > 0) {
                    return true;
                }
                return false;
            })
            .map(stat => {
                return `${stat.effort} ${stat.stat.name
                    .toLowerCase()
                    .split('-')
                    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(' ')}`;
            })
            .join(', ');

        // Get Pokemon Description .... Is from a different end point uggh
        await Axios.get(pokemonSpeciesUrl).then(res => {
            let description = '';
            res.data.flavor_text_entries.some(flavor => {
                if (flavor.language.name === 'en') {
                    description = flavor.flavor_text;
                    return;
                }
            });
            const femaleRate = res.data['gender_rate'];
            const genderRatioFemale = 12.5 * femaleRate;
            const genderRatioMale = 12.5 * (8 - femaleRate);

            const catchRate = Math.round((100 / 255) * res.data['capture_rate']);

            const eggGroups = res.data['egg_groups']
                .map(group => {
                    return group.name
                        .toLowerCase()
                        .split(' ')
                        .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                        .join(' ');
                })
                .join(', ');

            const hatchSteps = 255 * (res.data['hatch_counter'] + 1);

            this.setState({
                description,
                genderRatioFemale,
                genderRatioMale,
                catchRate,
                eggGroups,
                hatchSteps
            });
        });

        this.setState({
            imageUrl,
            pokemonIndex,
            name,
            types,
            stats: {
                hp,
                attack,
                defense,
                speed,
                specialAttack,
                specialDefense
            },
            themeColor,
            height,
            weight,
            abilities,
            evs
        });


    }
    render() {
        return (
            <Col className="mt-5">
                <Card>
                    <Card.Header>
                        <Row className="">
                            <Col>
                                <h5 className="float-left">{this.state.pokemonIndex}</h5>
                            </Col>
                            <Col>
                                <div className="float-right">
                                    {this.state.types.map(type => (
                                        <span
                                            key={type}
                                            className="badge badge-pill mr-1"
                                            style={{
                                                backgroundColor: `#${TYPE_COLORS[type]}`,
                                                color: 'white'
                                            }}
                                        >
                                            {type
                                                .toLowerCase()
                                                .split(' ')
                                                .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                                                .join(' ')}
                                        </span>
                                    ))}
                                </div>
                            </Col>
                        </Row>
                    </Card.Header>
                    <Card.Body>
                        <Row className="align-items-center">
                            <Col md="3">
                                <Image src={this.state.imageUrl} className="mx-auto card-img-top" />
                            </Col>
                            <Col>
                                <h4 className="mx-auto mb-3">
                                    {this.state.name
                                        .toLowerCase()
                                        .split(' ')
                                        .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                                        .join(' ')}
                                </h4>
                                <Row>
                                    <Col md={this.state.statTitleWidth}>
                                        Hp
                                    </Col>
                                    <Col md={this.state.statBarWidth}>
                                        <ProgressBar now={this.state.stats.hp} label={`${this.state.stats.hp}`} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={this.state.statTitleWidth}>
                                        Attack
                                    </Col>
                                    <Col md={this.state.statBarWidth}>
                                        <ProgressBar now={this.state.stats.attack} label={`${this.state.stats.attack}`} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={this.state.statTitleWidth}>
                                        Defence
                                    </Col>
                                    <Col md={this.state.statBarWidth}>
                                        <ProgressBar now={this.state.stats.defense} label={`${this.state.stats.defense}`} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={this.state.statTitleWidth}>
                                        Speed
                                    </Col>
                                    <Col md={this.state.statBarWidth}>
                                        <ProgressBar now={this.state.stats.speed} label={`${this.state.stats.speed}`} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={this.state.statTitleWidth}>
                                        Sp Attack
                                    </Col>
                                    <Col md={this.state.statBarWidth}>
                                        <ProgressBar now={this.state.stats.specialAttack} label={`${this.state.stats.specialAttack}`} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={this.state.statTitleWidth}>
                                        Sp Defence
                                    </Col>
                                    <Col md={this.state.statBarWidth}>
                                        <ProgressBar now={this.state.stats.specialDefense} label={`${this.state.stats.specialDefense}`} />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="mt-5">
                                <p>{this.state.description}</p>
                            </Col>
                        </Row>
                        <hr />
                        <Card.Body>
                            <Card.Title>Profile</Card.Title>
                            <Row md="12">
                                <Col md="6">
                                    <Row>

                                        <Row className="align-items-center col-12">
                                            <Col><h6 className="float-right">Height:</h6></Col>
                                            <Col><h6 className="float-left">{this.state.height} ft.</h6></Col>
                                        </Row>


                                        <Row className="col-12">
                                            <Col ><h6 className="float-right">Weight:</h6></Col>
                                            <Col><h6 className="float-left">{this.state.weight} lbs</h6></Col>
                                        </Row>

                                        <Row className="col-12">
                                            <Col><h6 className="float-right">Catch Rate:</h6></Col>
                                            <Col><h6 className="float-left">{this.state.catchRate}%</h6></Col>
                                        </Row>

                                        <Row className="col-12">
                                            <Col><h6 className="float-right">Gender Ratio:</h6></Col>
                                            <Col className="">
                                                <div className="progress">
                                                    <div
                                                        className="progress-bar"
                                                        role="progressbar"
                                                        style={{
                                                            width: `${this.state.genderRatioFemale}%`,
                                                            backgroundColor: '#c2185b'
                                                        }}
                                                        aria-valuenow="15"
                                                        aria-valuemin="0"
                                                        aria-valuemax="100"
                                                    >
                                                        <small>{this.state.genderRatioFemale}</small>
                                                    </div>
                                                    <div
                                                        className="progress-bar"
                                                        role="progressbar"
                                                        style={{
                                                            width: `${this.state.genderRatioMale}%`,
                                                            backgroundColor: '#1976d2'
                                                        }}
                                                        aria-valuenow="30"
                                                        aria-valuemin="0"
                                                        aria-valuemax="100"
                                                    >
                                                        <small>{this.state.genderRatioMale}</small>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>




                                    </Row>
                                </Col>

                                <Col md="6">
                                    <Row>
                                        <Row className="col-12">
                                            <Col><h6 className="float-right">Egg Groups:</h6></Col>
                                            <Col ><h6 className="float-left">{this.state.eggGroups}</h6></Col>
                                        </Row>

                                        <Row className="col-12">
                                            <Col ><h6 className="float-right">Hatch Steps:</h6></Col>
                                            <Col ><h6 className="float-left">{this.state.hatchSteps}</h6></Col>
                                        </Row>


                                        <Row className="col-12">
                                            <Col><h6 className="float-right">Abilities:</h6></Col>
                                            <Col><h6 className="float-left">{this.state.abilities}</h6></Col>
                                        </Row>


                                        <Row className="col-12">
                                            <Col><h6 className="float-right">EVs:</h6></Col>
                                            <Col><h6 className="float-left">{this.state.evs}</h6></Col>
                                        </Row>

                                    </Row>
                                </Col>
                            </Row>
                        </Card.Body>

                    </Card.Body>

                </Card>
            </Col>
        )
    }
}
