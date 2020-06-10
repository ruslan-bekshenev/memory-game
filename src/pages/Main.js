import React, { Component } from 'react'
import '../scss/game.scss'
import shirt from '../cards/shirt.png'
import Stopwatcher from '../components/Stopwatcher'
import cn from 'classnames'
import { debounce } from '../utils/debounce'
import Firebase from "firebase";
import config from "../config";
/**
 * Время переворота карточек
 */

Firebase.initializeApp(config);

const TIME_OF_REVERCE = 2000

class Main extends Component {
    state = {
        size: 4,
        table: [],
        cards: [],
        firstCard: null,
        secondCard: null,
        isFinished: false,
        retiredCount: 0,
        timeResult: null,
        // Свойство, необходимое для продления открытия первой карты после открытия второй карты
        prolongate: false,
    }

    /**
     * Поле под таймаут
     */
    timeout = null

    /**
     * @param arr [] - Массив всех кард
     * @returns [] - Возвращает новый массив состоящий из тех же карт но перемешаный. Не мутирует.
     */
    shuffle = (arr) => arr.sort(() => Math.random() - 0.5)

    initCards = () => {
        const { size } = this.state
        const cards = []
        for (let i = 1; i <= Math.pow(size, 2); i++) {
            // Число, по которому будем сразвнивать карты
            const valCard = i % 2 === 0 ? i / 2 : (i + 1) / 2
            cards.push({
                index: i,
                number: valCard,
                retired: false,
                img: require(`../cards/front/${valCard}.png`),
            })
        }
        const cardsShuffle = this.shuffle(cards)
        const matrixCards = []
        cardsShuffle.forEach((item, index, cardsShuffle) => {
            matrixCards.push(cardsShuffle.splice(0, size))
        })
        this.setState({
            cards: matrixCards,
        })
    }

    /**
     * Метод который проверяет, перевернута эта карта или нет
     * @param Object card
     * @returns boolean
     */
    checkIfRotated = (card) => {
        const { firstCard, secondCard } = this.state
        const output =
            (firstCard && firstCard.index === card.index) ||
            (secondCard && secondCard.index === card.index) ||
            card.retired
        return output
    }

    /**
     * рендерит таблицу с картами
     */
    renderTable = () => {
        const { checkIfRotated } = this
        const { cards, size } = this.state
        return cards.map((cardsRows, index) => (
            <div className="row" key={index}>
                {cardsRows.map((card, childIndex) => (
                    <div
                        key={index + childIndex}
                        style={{ width: `${100 / size}%` }}
                        className="cell"
                    >
                        <button
                            style={{ width: '100%', height: '120px' }}
                            className={cn('cell-btn', {
                                retired: !card.retired,
                            })}
                            onClick={() => this.clickHandler(card)}
                        >
                            <div
                                className={cn('btn-container', {
                                    'flip-card': checkIfRotated(card),
                                })}
                            >
                                <div className="card card-shirt">
                                    <img src={shirt} alt="" />
                                </div>
                                <div className="card card-face">
                                    <img src={card.img} alt="" />
                                </div>
                            </div>
                        </button>
                    </div>
                ))}
            </div>
        ))
    }

    /**
     *
     */
    clickHandler = async (card) => {
        const newCards = [...this.state.cards]
        const { state, timeout } = this
        let { firstCard, secondCard, cards } = state

        if (!firstCard || !secondCard) {
            if (!firstCard) {
                firstCard = card
            } else {
                // Экранируем даблклик по карточке
                if (card.index === firstCard.index) return
                secondCard = card
            }

            newCards.forEach((cardRow) => {
                const selectedCard = cardRow.find(
                    (cardItem) => cardItem.index === card.index
                )
                if (selectedCard) {
                    this.setState({
                        prolongate: true,
                        firstCard: firstCard,
                        secondCard: secondCard,
                    })
                }
            })
        }

        if (firstCard && secondCard) {
            const success = firstCard.number === secondCard.number

            if (success && timeout) {
                clearTimeout(timeout)

                this.setState(
                    {
                        firstCard: null,
                        secondCard: null,
                        cards: [
                            ...cards.map((cardRow) =>
                                cardRow.map((cardItem) =>
                                    cardItem.index === firstCard.index ||
                                    cardItem.index === secondCard.index
                                        ? {
                                            ...cardItem,
                                            retired: true,
                                        }
                                        : cardItem
                                )
                            ),
                        ],
                    },
                    this.checkFinish
                )
            }
        }

        if (!secondCard) {
            this.resetCards()
        }
    }

    /**
     * Перевернуть все карты обратно рубашкой вверх. Метод задекорировать под Debounce
     */
    resetCards = debounce(() => {
        const { prolongate } = this.state

        this.timeout = setTimeout(() => {
            if (prolongate) {
                this.setState({ prolongate: false })
                this.resetCards()
                return
            }
            this.setState({
                firstCard: null,
                secondCard: null,
            })
        }, TIME_OF_REVERCE)
    }, TIME_OF_REVERCE)

    checkFinish = () => {
        const { size, cards } = this.state
        let count = 0
        cards.forEach((cardRow) => {
            cardRow.forEach((cardItem) => {
                if (cardItem.retired) {
                    count++
                }
            })
        })

        this.setState({
            isFinished: Math.pow(size, 2) === count,
        })
    }
    setTimeResult = (time) => {
        this.setState({
            timeResult: time,
        })
    }
    componentDidMount() {
        this.initCards()
    }
    
    writeUserData = () => {
        Firebase.database()
          .ref("/")
          .set(this.state);
        console.log("DATA SAVED");
      };
    
    render() {
        const { isFinished, timeResult } = this.state
        const { location } = this.props

        return (
            <div className="container">
                <div className="game-block">
                    <div className="container__header">
                        <div className={'space-between'}>
                            <h2>Memory game</h2>
                            <Stopwatcher
                                stopWatch={isFinished}
                                setTimeResult={this.setTimeResult}
                            />
                        </div>
                    </div>
                    <div className="container__body">
                        <div className="table">{this.renderTable()}</div>
                        <div className={isFinished ? 'finish' : 'hidden'}>
                            {location.state.nick}, your result: {timeResult}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Main
