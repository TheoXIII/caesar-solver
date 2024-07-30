import {Component} from 'react'
import { FormGroup, Input, Label } from 'reactstrap';
import { Button } from 'react-bootstrap'
import axios from 'axios'
import Cookies from 'js-cookie'
import './attention-visualizer.css'

interface IProps {    
}

interface IState {
    inputText: string,
    vectorMapping: {token: string, vector: number[]}[]
}

export default class Solver extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            inputText: "",
            vectorMapping: []
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.setVectorMapping = this.setVectorMapping.bind(this);
    }

    setVectorMapping(result: {vectorMapping: {token: string, vector: number[]}[]}) {
        this.setState({vectorMapping: result.vectorMapping});
    }

    async handleChange(event: any) {
        this.setState({inputText: event.target.value});
    }

    async handleSubmit(event: any) {
        event.preventDefault();

        axios.post('/api/attention-visualizer/', {
            text: this.state.inputText,
        }, {
            headers: { 'X-CSRFToken': Cookies.get('csrftoken') }
        })
        .then(response => this.setVectorMapping(response.data))
        .catch((error) => console.log(error))
    }

    render() {
        return(
            <div className="attention-visualizer">
                <FormGroup>
                    <Label for="inputText">Attention Visualizer</Label>
                    <Input type="textarea" name="inputText" id="inputText" value={this.state.inputText}
                        onChange={this.handleChange}/>
                </FormGroup>
                <FormGroup className="submit">
                    <Button color="primary" type="submit" onClick={this.handleSubmit}>Submit</Button>
                </FormGroup>
            </div>
        )
    }
}