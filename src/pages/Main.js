import React, {Component} from 'react';
import "../css/game.css"
import shirt from "../cards/shirt.png";
import Stopwatcher from "../components/Stopwatcher";

class Main extends Component {
    state = {
        size: 2,
        table: [],
        cards: [],
        firstCard: null,
        secondCard: null,
        isFinished: false,
        retiredCount: 0,
        timeResult: null
    }
    shuffle = (arr) => arr.sort(() => Math.random() - 0.5);
    initCards = () => {
        const {size} = this.state;
        const cards = [];
        for (let i = 1; i <= Math.pow(size, 2); i++) {
            const valCard = i % 2 === 0 ? i / 2 : (i + 1) / 2;
            cards.push({
                index: i % 2 === 0 ? i : i,
                number: valCard,
                rotate: false,
                retired: false,
                img: require(`../cards/front/${valCard}.png`)
            });
        }
        const cardsShuffle = this.shuffle(cards);
        const matrixCards = [];
        cardsShuffle.forEach((item, index, cardsShuffle) => {
            matrixCards.push(cardsShuffle.splice(0, size));
        })
        this.setState({
            cards: matrixCards
        })

    }
    renderTable = () => {
        const {cards, size, isFinished} = this.state
        return cards.map((cardsRows, index) => (
            <div className="row" key={index}>
                {
                    cardsRows.map((card, childIndex) => (
                        <div key={index + childIndex} style={{width: `${(100 / size)}%`}} className="cell">
                            <button style={{width: "100%", height: "120px"}} className={!card.retired ? "cell-btn" : "cell-btn retired"}
                                    onClick={() => this.clickHandler(card)}>
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
                    ))
                }

            </div>
        ))
    }
    clickHandler = (card) => {
        const {firstCard, secondCard, cards} = this.state;
        const newCards = [...cards]

        if (!firstCard || !secondCard) {
            newCards.map( cardRow => {
                const selectedCard = cardRow.find(cardItem => cardItem.index === card.index);
                if (!!selectedCard) {
                    selectedCard.rotate = true;

                    this.setState({
                        firstCard: !firstCard ? {...card} : firstCard,
                        secondCard: !secondCard && firstCard ? {...card} : secondCard,
                    })
                }
            })
        }
        setTimeout(() => {
            const {firstCard, secondCard, cards} = this.state;
            this.checkFinish();
            if (firstCard && secondCard) {
                const modifierCards = firstCard.number === secondCard.number ? [...cards.map( cardRow =>
                    cardRow.map( cardItem =>
                        cardItem.index === firstCard.index || cardItem.index === secondCard.index ?
                            {...cardItem, rotate: true, retired: true} : cardItem )
                )] : [...cards]

                this.setState({
                    firstCard: null,
                    secondCard: null,
                    cards: [...modifierCards],

                })
            }
            else {
                this.setState({
                    firstCard: null,
                    secondCard: null,
                    cards: [...cards.map( cardRow => cardRow.map( cardItem => !cardItem.retired ?
                        {...cardItem, rotate: false} :
                        {...cardItem, rotate: true} )
                    )]
                })
            }
        }, 5000)
    }
    checkFinish = async () => {
        const {cards, size, retiredCount} = this.state;
        let count = 0;
        cards.map( cardRow => {
            cardRow.map( cardItem => cardItem.retired ? count++ : count  )
        } )
        console.log(Math.pow(size, 2), count);
        this.setState({
            isFinished: Math.pow(size, 2) === count
        })
    }
    setTimeResult = (time) => {
        this.setState({
            timeResult: time
        })
    }
    componentDidMount() {
        this.initCards();
    }

    render() {
        const {isFinished, timeResult} = this.state
        return (
            <div className="game-container">
                <div className="game-block">
                    <div className="game-container__header">
                        <div className={"space-between"}>
                            <h2>Memory game</h2>
                            <Stopwatcher stopWatch={isFinished} setTimeResult={this.setTimeResult}/>
                        </div>
                    </div>
                    <div className="game-container__body">
                        <div className="table">
                            {this.renderTable()}
                        </div>
                        <div className={isFinished ? "finish" : "hidden"}>
                            Your result: {timeResult}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default Main;