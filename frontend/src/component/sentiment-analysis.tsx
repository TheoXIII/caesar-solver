import React, {Component} from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'

import { Form, FormGroup, Input, Label } from 'reactstrap';
import { Alert } from 'react-bootstrap'

interface IProps {    
}

interface IState {
    text: string,
    polarity: number,
    assessments: [string[], number][]
}

function createPercentage(n: number) {
    return (n * 100).toFixed(1).toString() + '%'
}

function ShowPolarity(props: {polarity: number}) {
    if (props.polarity === 0)
        //return <p>Neutral</p>
        return <Alert variant="light">Neutral</Alert>
    else if (props.polarity > 0)
        //return <p>{createPercentage(props.polarity)} Positive</p>
        return <Alert variant='success'>{createPercentage(props.polarity)} Positive</Alert>
    else
        //return <p>{createPercentage(-props.polarity)} Negative</p>
        return <Alert variant='danger'>{createPercentage(-props.polarity)} Negative</Alert>
}

//WIP
function concatTokens(tokens: string[]) {
    let concatenatedTokens: string[] = [];
    for (let token of tokens) {
        if (token.match(/^[.,:!?]/))
            concatenatedTokens[-1].concat(token)
        else
            concatenatedTokens.push(token)
    }
    return concatenatedTokens
}

export default class SentimentAnalysis extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            text: "",
            polarity: 0,
            assessments: [],
        };

        this.setVars = this.setVars.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
    }

    //WIP
    processAssessments(assessments: [string[], number][]) {
        const words = this.state.text.split(" ")
        assessments = assessments.map(([tokens, score]) => [concatTokens(tokens), score])
        let currentAssessment = 0
        let tokens: {text: string, score: number}[] = [];
        for (let i=0; i < words.length; i++) {
            if (currentAssessment === assessments.length || (words[i].toLowerCase() !== assessments[currentAssessment][0][0])) {
                tokens.push({text: words[i], score: 0})
            }
            else {
                const length = assessments[currentAssessment][0].length

            }
        }
    }

    setVars(result: {polarity: number, assessments: [string[], number][]}) {
        this.setState({polarity: result.polarity, assessments: result.assessments});
    }

    async handleChange(event: any) {
        this.setState({text: event.target.value});
        this.submit(event.target.value);

    }

    async submit(text: string) {
        axios.post('/api/sentiment-analysis/', {
            text: text,
        }, {
            headers: { 'X-CSRFToken': Cookies.get('csrftoken') }
        })
        .then(response => this.setVars(response.data))
        .catch((error) => console.log(error))
    }

    render() {
        return(
            <div className="sentiment-analysis">
                <FormGroup>
                    <Label for="text">Sentiment Analysis</Label>
                    <Input type="textarea" name="text" id="text" value={this.state.text}
                        onChange={this.handleChange}/>
                </FormGroup>
                
                <ShowPolarity polarity={this.state.polarity}/>

                <p>{this.state.text}</p>
            </div>
        )
    }
}