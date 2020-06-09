import React, {Component} from 'react';

class Stopwatcher extends Component{

    constructor(props) {
        super(props)


        this.tick = null;

        this.state = {
            seconds: 0,
            hours: 0,
            minutes: 0
        }
    }



    componentDidMount() {
        if (!this.props.stopWatch) {
            this.tick = setInterval( () => {
                this.setState({
                    seconds: this.state.seconds < 59 ? this.state.seconds + 1 : 0,
                    minutes: this.state.seconds >= 59 ? this.state.minutes + 1 :
                             this.state.minutes > 59 ? 0 : this.state.minutes,
                    hours: this.state.minutes > 59 ? this.state.hours + 1 : this.state.hours
                })
            }, 1000 )
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.stopWatch !== this.props.stopWatch) {
            const seconds = this.state.seconds > 9 ? this.state.seconds : `0${this.state.seconds}`
            const minutes = this.state.minutes > 9 ? this.state.minutes : `0${this.state.minutes}`
            const hours = this.state.hours > 9 ? this.state.hours : `0${this.state.hours}`
            this.props.setTimeResult(`${hours}:${minutes}:${seconds}`)
            this.setState({
                seconds: 0,
                minutes: 0,
                hours: 0
            })
            clearInterval(this.tick);
        }
    }

    render() {
        const seconds = this.state.seconds > 9 ? this.state.seconds : `0${this.state.seconds}`
        const minutes = this.state.minutes > 9 ? this.state.minutes : `0${this.state.minutes}`
        const hours = this.state.hours > 9 ? this.state.hours : `0${this.state.hours}`
        return (
            <h3>
                {`Time: ${hours}:${minutes}:${seconds}`}
            </h3>
        )
    }
}

export default Stopwatcher;