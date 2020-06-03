import React, {Component} from 'react';
import "../css/game.css"
import shirt from "../cards/shirt.png";

class Main extends Component {
    state = {
        size: 6,
        table: [],
        cards: [],
        firstCard: {},
        secondCard: {},
        selectedcards: []
    }
    shuffle = (arr) => arr.sort(() => Math.random() - 0.5);
    initCards = () => {
        const {size} = this.state;
        const cards = [];
        // for (let i = 1; i <= Math.pow(size, 2) / 2; i++) {
        //     for (let j = 0; j < 2; j++) {
        //         const index = j > 0 ? i+1 : i;
        //         // console.log(index)
        //         cards.push({
        //             index: index,
        //             number: i,
        //             rotate: false,
        //             retired: false,
        //             img: require(`../cards/front/${i}.png`)
        //         });
        //     }
        // }
        for (let i = 1; i <= Math.pow(size, 2); i+=2) {
            console.log(i % 2 === 0 ? i : i - 1)
            // cards.push({
            //     index: i % 2 === 0 ? i : i,
            //     number: i,
            //     rotate: false,
            //     retired: false,
            //     img: require(`../cards/front/${i+1}.png`)
            // });
        }
        const cardsShuffle = this.shuffle(cards);
        const matrixCards = [];
        cardsShuffle.forEach( (item, index, cardsShuffle) => {
            matrixCards.push(cardsShuffle.splice(0, size));
        })
        this.setState({
            cards: matrixCards
        })
        
    }
    renderTable = () => {
        const {cards, size} = this.state
        return cards.map( (cardsRows, index) => (
            <div className="row" key={index}>
                {
                    cardsRows.map( (card, childIndex) => (
                        <div key={index+childIndex} style={ { width: `${(100 / size)}%`} } className="cell">
                            <button style={{width: "100%", height: "120px"}} className="cell-btn" onClick={ () => this.clickHandler(card) }>
                                <div className={card.rotate ? "btn-container flip-card" : "btn-container"}>
                                    <div className="card card-shirt">
                                        <img src={shirt} alt=""/>
                                    </div>
                                    <div className="card card-face">
                                        <img src={card.img} alt=""/>
                                    </div>
                                </div>
                            </button>
                        </div>
                    ) )
                }
            </div>
        ))
    }
    clickHandler = (card) => {
        const {firstCard, secondCard, cards} = this.state;
        const newCards = cards.map( cardsRow => [...cardsRow] )
        newCards.map( cardsRow => cardsRow.find( cardItem => cardItem.number  ) )
        if (firstCard) {
            this.setState({
                firstCard: card,
            })
        } 
        else if (secondCard) {
            this.setState({
                secondCard: card,
            })
        }
        this.setState({
            cards: cards 
        })
       setTimeout(() => {
            if (firstCard.number === secondCard.number) {
                this.setState({

                })
            }
            this.setState({
                firstCard: {},
                secondCard: {},
                cards: cards
            })
       }, 5000)
    }
    componentDidMount() {
        this.initCards();
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