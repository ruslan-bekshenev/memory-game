import React, {Component} from 'react';
import "../css/game.css"
import shirt from "../cards/shirt.png";
import Stopwatcher from "../components/Stopwatcher";

class Main extends Component {
    state = {
        size: 4,
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
        const {cards, size} = this.state
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
    clickHandler = async (card) => {
        const newCards = [...this.state.cards]
        if (!this.state.firstCard || !this.state.secondCard) {
            await newCards.map( cardRow => {
                const selectedCard = cardRow.find(cardItem => cardItem.index === card.index);
                if (!!selectedCard) {
                    selectedCard.rotate = true;
                    this.setState({
                        firstCard: !this.state.firstCard ? {...card} : this.state.firstCard,
                        secondCard: !this.state.secondCard && this.state.firstCard && this.state.firstCard.index !== card.index ? {...card} : this.state.secondCard
                    })
                }
            } );
        }
        if (this.state.firstCard && this.state.secondCard) {
            const modifierCards = await this.state.firstCard.number === this.state.secondCard.number ?
                [...this.state.cards.map( cardRow => cardRow.map( cardItem =>
                    (cardItem.index === this.state.firstCard.index || cardItem.index === this.state.secondCard.index) ?
                        {...cardItem, rotate: true, retired: true} : cardItem )
                )] : [...this.state.cards]

            this.setState({
                cards: [...modifierCards],
            })



            this.checkFinish();
        }
        console.log(this.state.firstCard, this.state.secondCard);
        if (!this.state.secondCard) {
            setTimeout(() => {
                this.setState({
                    firstCard: null,
                    secondCard: null,
                    cards: [...this.state.cards.map( cardRow => cardRow.map( cardItem => !cardItem.retired ?
                        {...cardItem, rotate: false} :
                        {...cardItem, rotate: true} )
                    )]
                })
            }, 2000)
        }

    }
    checkFinish = async () => {
        const {cards, size} = this.state;
        let count = 0;
        cards.map( cardRow => {
            cardRow.map( cardItem => cardItem.retired ? count++ : count  )
        } )
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
        console.log(this.props.location.state.nick)
        const {isFinished, timeResult} = this.state
        return (
            <div className="container">
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
                        {this.props.location.state.nick}, your result: {timeResult}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default Main;