import React, { Component } from 'react';
import { BuyForm, SellForm } from './Forms';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentForm: 'buy'
    };
  }

  render() {
    const content =
      this.state.currentForm === 'buy' ? (
        <BuyForm
          ethBalance={this.props.ethBalance}
          tokenBalance={this.props.tokenBalance}
          buyTokens={this.props.buyTokens}
        />
      ) : (
        <SellForm
          ethBalance={this.props.ethBalance}
          tokenBalance={this.props.tokenBalance}
          sellTokens={this.props.sellTokens}
        />
      );

    return (
      <div id="content" className="mt-3">
        <div className="d-flex justify-content-between mb-3">
          <button
            className="btn btn-success"
            onClick={event => {
              this.setState({ currentForm: 'buy' });
            }}
          >
            Buy
          </button>
          <span className="text-muted">
            &lt; {this.state.currentForm.toUpperCase()} &gt;
          </span>
          <button
            className="btn btn-danger"
            onClick={event => {
              this.setState({ currentForm: 'sell' });
            }}
          >
            Sell
          </button>
        </div>
        <div className="card mb-4">
          <div className="card-body">{content}</div>
        </div>
      </div>
    );
  }
}

export default Main;
