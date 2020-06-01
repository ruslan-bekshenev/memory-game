import React, {Component} from 'react';
import "../css/game.css"
class Main extends Component {

    constructor(props) {
        super(props);

        this.state = {
            size: 6,
            table: [],
            numbers: [],
            firstCard: 0,
            secondCard: 0,
            selectedCards: []
        }
    }
    shuffle = (arr) => arr.sort(() => Math.random() - 0.5);
    initNumbers = () => {
        let numbers = [];
        for (let i = 0; i < Math.pow(this.state.size, 2) / 2; i++) {
            for (let j = 0; j < 2; j++) {
                numbers.push(i+1);
            }
        }
        const number_shuffle = this.shuffle(numbers);
        let matrix = [];
        while(number_shuffle.length) matrix.push(number_shuffle.splice(0,this.state.size));
        this.setState({
            numbers: [...matrix]
        })
        
    }
    renderTable = () => {
        return this.state.numbers.map( (item, index) => (
            <div className="row" key={index}>
                {
                    item.map( (childItem, childIndex) => (
                        <div key={index+childIndex} style={ { width: 100 / this.state.size + "%"} } className="cell">
                            <button style={{width: "100%", height: "120px"}} onClick={ () => this.selectItem(childItem) }>
                                {childItem}
                            </button>
                        </div>
                    ) )
                }
            </div>
        ))
    }
    selectItem = async (childItem) => {
        this.setState({
            firstCard: childItem
        })
        await setTimeout(() => {
            this.setState({
                firstCard: 0
            })
            console.log(this.state.firstCard);
        }, 5000)
    }
    componentDidMount() {
        this.initNumbers();
    }

    render() {
        return (
            <div className="game-container">
                <div className="game-block">
                    <div className="game-container__header">
                        <h2>Game "Memory"</h2>
                    </div>
                    <div className="game-container__body">
                        <div className="table">
                            {this.renderTable()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default Main;