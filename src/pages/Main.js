import React, {Component} from 'react';
import "../css/game.css"
import shirt from "../cards/shirt.png";
import img1 from "../cards/front/1.png";

class Main extends Component {

    constructor(props) {
        super(props);

        this.state = {
            size: 6,
            table: [],
            numbers: [],
            firstCard: {},
            secondCard: {},
            selectedCards: []
        }
    }
    shuffle = (arr) => arr.sort(() => Math.random() - 0.5);
    initNumbers = () => {
        let numbers = [];
        for (let i = 0; i < Math.pow(this.state.size, 2) / 2; i++) {
            for (let j = 0; j < 2; j++) {
                const number = i+1;
                numbers.push({
                    number: i+1,
                    rotate: false,
                    retired: false,
                    img: require("../cards/front/"+number+".png")
                });
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
                            <button style={{width: "100%", height: "120px"}} className="cell-btn" onClick={ () => this.selectItem(childItem) }>
                                <div className={childItem.rotate ? "btn-container flip-card" : "btn-container"}>
                                    <div className="card card-shirt">
                                        <img src={shirt} alt=""/>
                                    </div>
                                    <div className="card card-face">
                                        <img src={childItem.img} alt=""/>
                                    </div>
                                </div>
                            </button>
                        </div>
                    ) )
                }
            </div>
        ))
    }
    selectItem = (childItem) => {
        if (Object.keys(this.state.firstCard).length === 0) {
            childItem.rotate = true;
            this.setState({
                firstCard: {...childItem},
                numbers: [...this.state.numbers]
            })
        } 
        else if (Object.keys(this.state.secondCard).length === 0) {
            childItem.rotate = true;
            this.setState({
                secondCard: {...childItem},
                numbers: [...this.state.numbers]
            })
        }
       setTimeout(() => {
            childItem.rotate = false;
            if (this.state.firstCard.number !== this.state.secondCard.number) {
                
            }
            else {
                
            }
            this.setState({
                firstCard: {},
                secondCard: {},
                numbers: [...this.state.numbers]
            })
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