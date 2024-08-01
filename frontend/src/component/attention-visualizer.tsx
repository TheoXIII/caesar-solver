import {Component} from 'react'
import {
    FormGroup,
    Input,
    Label,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';
import { Button } from 'react-bootstrap'
import axios from 'axios'
import Cookies from 'js-cookie'
import { sum, dot } from 'mathjs'
import './attention-visualizer.css'
import Token from './attention-visualizer-components/token'
import TokenModal from './attention-visualizer-components/tokenModal'

const DROP_DOWN_OPTIONS = ["XLNet", "BERT", "GPT2"]

interface IProps {    
}

interface IState {
    inputText: string,
    vectorMapping: {token: string, vector: number[]}[],
    selectedTokenId: number | null,
    showModal: boolean,
    modalScore: number | null,
    modalText: string,
    dropDownOpen: boolean,
    selectedModel: string,
    loading: boolean
}

function softmax(arr: number[]) {
    return arr.map((value) => Math.exp(value) / sum(arr.map( Math.exp )));
}

export default class Solver extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            inputText: "",
            vectorMapping: [],
            showModal: false,
            modalScore: null,
            modalText: "",
            selectedTokenId: null,
            dropDownOpen: false,
            selectedModel: DROP_DOWN_OPTIONS[0],
            loading: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.setVectorMapping = this.setVectorMapping.bind(this);
        this.setTargetToken = this.setTargetToken.bind(this);
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.getScore = this.getScore.bind(this);
        this.toggle = this.toggle.bind(this);
        this.InfoBox = this.InfoBox.bind(this)
    }

    setVectorMapping(result: {vectorMapping: {token: string, vector: number[]}[]}) {
        this.setState({loading: false})
        this.setState({vectorMapping: result.vectorMapping});
    }

    setTargetToken(index : number) {
        this.setState({selectedTokenId: index});
        //this.setState({modalScore: this.getScore(this.state.vectorMapping[index]["vector"])});
        this.setState({modalScore: 1});
    }

    show(text: string, score: number) {
        this.setState({showModal: true, modalText: text, modalScore: score})
    }

    hide() {
        this.setState({showModal: false})
    }

    async handleChange(event: any) {
        this.setState({inputText: event.target.value});
    }

    async handleSubmit(event: any) {
        event.preventDefault();
        this.setState({loading: true, vectorMapping: [], selectedTokenId: null})

        axios.post('/api/attention-visualizer/', {
            text: this.state.inputText,
            model: this.state.selectedModel
        }, {
            headers: { 'X-CSRFToken': Cookies.get('csrftoken') }
        })
        .then(response => this.setVectorMapping(response.data))
        .catch((error) => console.log(error))
    }

    getScore(vector: number[]): number | null {
        if (this.state.selectedTokenId === null)
            return null
        const comparisonVector = this.state.vectorMapping[this.state.selectedTokenId]["vector"]
        return dot(vector, comparisonVector) / (Math.sqrt(dot(vector, vector)) * Math.sqrt(dot(comparisonVector, comparisonVector)))
    }

    toggle() {
        this.setState({dropDownOpen: !this.state.dropDownOpen})
    }

    InfoBox() {
        if (this.state.vectorMapping.length > 0) {
            if (this.state.selectedTokenId !== null)
                return(<span>Selected token: <b>{this.state.vectorMapping[this.state.selectedTokenId]["token"]}</b></span>)
            return(<span>Click on a token</span>)
        }
        return (<></>)
    }

    render() {
        const tokens: any = [];
        this.state.vectorMapping.forEach((value, i) => tokens.push(<Token key={i} index={i} text={value["token"]} score={this.getScore(value["vector"])} /*score={scores[i]}*/ parentShow={this.show} parentHide={this.hide} setTargetToken={this.setTargetToken}/>))
        
        const dropDownOptions: any = []
        
        if (this.state.loading)
            document.body.style.cursor = 'wait';
        else
            document.body.style.cursor = 'auto';

        for (const option of DROP_DOWN_OPTIONS)
            dropDownOptions.push(<DropdownItem className="drop-down-item" onClick={() => this.setState({selectedModel: option})}>{option}</DropdownItem>)


        return(
            <div className="attention-visualizer">
                <div>
                    <FormGroup>
                        <Label for="inputText">Attention Visualizer</Label>
                        <Input type="textarea" name="inputText" id="inputText" value={this.state.inputText}
                            onChange={this.handleChange}/>
                    </FormGroup>
                    <FormGroup>
                        <Dropdown isOpen={this.state.dropDownOpen} toggle={this.toggle}>
                            <DropdownToggle caret>{this.state.selectedModel}</DropdownToggle>
                            <DropdownMenu className="drop-down-menu">
                                {dropDownOptions}
                            </DropdownMenu>
                        </Dropdown>
                    </FormGroup>
                    <FormGroup className="submit">
                        <Button color="primary" type="submit" onClick={this.handleSubmit}>Submit</Button>
                    </FormGroup>
                </div>

                { this.state.loading &&
                    <p className="loading">Loading...</p>
                }

                <div className="text-container">
                    <p className="text">{tokens}</p>
                </div>

                <div className="info">
                    <this.InfoBox/>
                </div>

                { this.state.showModal &&
                    <TokenModal text={this.state.modalText} score={this.state.modalScore}/>
                }
            </div>
        )
    }
}