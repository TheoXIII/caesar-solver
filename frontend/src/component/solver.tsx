import React, {Component} from 'react'
import { Form, FormGroup, Input, Label } from 'reactstrap';
import { Button, Alert } from 'react-bootstrap'
import axios from 'axios'
import Cookies from 'js-cookie'
import './solver.css'

interface IProps {    
}

interface IState {
    solved: boolean,
    solutionPlaintext: string | null,
    solutionKey: number | null,
    ciphertext: string,
    length: number,
}

export default class Solver extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            solved: false,
            solutionPlaintext: null,
            solutionKey: null,
            ciphertext: "",
            length: 0,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.setSolution = this.setSolution.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getCookie = this.getCookie.bind(this);
        this.updateLength = this.updateLength.bind(this);
    }

    componentDidMount() {
        if (!Cookies.get('csrftoken'))
            this.getCookie();
    }

    setSolution(result: {key: number, plaintext: string}) {
        this.setState({solved: true, solutionKey: result.key, solutionPlaintext: result.plaintext});
    }

    async getCookie() {
        axios.get('/api/solver/csrf')
        .then((response) => Cookies.set('csrftoken', response.data.token))
    }

    updateLength(ciphertext: string) {
        let length = 0;
        const lowercaseCiphertext = ciphertext.toLowerCase();
        for (let i = 0; i < lowercaseCiphertext.length; i++) {
            const ord = lowercaseCiphertext.charCodeAt(i);
            if (97 <= ord && ord <= 122)
                length++;
        }
        this.setState({length: length});
    }

    async handleChange(event: any) {
        this.setState({ciphertext: event.target.value});
        this.updateLength(event.target.value);
    }

    async handleSubmit(event: any) {
        if (this.state.length < 10 || this.state.length > 300)
            return
        event.preventDefault();
        this.setState({solved: false});

        axios.post('/api/solver/', {
            ciphertext: this.state.ciphertext,
        }, {
            headers: { 'X-CSRFToken': Cookies.get('csrftoken'), 'Test-Header': '123' }
        })
        .then(response => this.setSolution(response.data))
        .catch((error) => console.log(error))
    }

    render() {
        return(
            <div className="solver">
                <FormGroup>
                    <Label for="ciphertext">Caesar Solver</Label>
                    <Input type="textarea" name="ciphertext" id="ciphertext" value={this.state.ciphertext}
                        onChange={this.handleChange}/>
                </FormGroup>
                <FormGroup class="submit">
                    <Button color="primary" type="submit" onClick={this.handleSubmit}>Solve</Button>
                </FormGroup>

                {this.state.length < 10 &&
                    <Alert variant="warning">There must be at least 10 alphabetic characters in the ciphertext</Alert>
                }

                {this.state.length > 300 &&
                    <Alert variant="warning">There must be at most 300 alphabetic characters in the ciphertext</Alert>
                }
                
                {this.state.solved &&
                    <><Alert className="plaintext" variant="success">{this.state.solutionPlaintext}</Alert>
                    <Alert variant="info">Shift: {this.state.solutionKey}</Alert></>
                }
            </div>
        )
    }
}