import React, {Component} from 'react';

class Auth extends Component {

    constructor(props) {
        super(props);

        this.state = {
            nick: ""
        }
    }
    componentDidMount() {
        console.log(this.props)
    }
    nickHandle = (event) => {
        console.log(event.target.value)
        this.setState({
            nick: event.target.value
        })
    }

    render() {
        return (
            <div className={"container"}>
                <div className="game-block">
                    <div className="container__header">
                        <h2>Settings</h2>
                    </div>
                    <div className="container__body">
                        <form action="" className={"form"}>
                            <label htmlFor="nick" className={"form__label"}>Your nickname:</label>
                            <input type="text" id="nick" className={"form__input"} onChange={this.nickHandle }/>
                            <div className="center">
                                <button className="form__submit" onClick={() => this.props.history.push('/main', {
                                    nick: this.state.nick
                                })}>Submit</button>   
                            </div>  
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}


export default Auth;