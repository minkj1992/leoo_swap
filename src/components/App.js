import React, { Component } from 'react';
import Web3 from 'web3';
import Token from '../abis/LoveToken.json';
import LeooSwap from '../abis/LeooSwap.json';
import Main from './Main';
import Navbar from './Navbar';
import './App.css';

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  constructor(props) {
    super(props);
    this.state = {
      account: '',
      token: {},
      leooSwap: {},
      ethBalance: '0',
      tokenBalance: '0',
      loading: true
    };
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    this.setState({ account: accounts[0] });

    const ethBalance = await web3.eth.getBalance(this.state.account);
    this.setState({ ethBalance });

    const networkId = await web3.eth.net.getId();
    const tokenData = Token.networks[networkId];
    if (tokenData) {
      const token = new web3.eth.Contract(Token.abi, tokenData.address);
      this.setState({ token });

      let tokenBalance = await token.methods
        .balanceOf(this.state.account)
        .call();

      this.setState({ tokenBalance: tokenBalance.toString() });
    } else {
      window.alert('Love Token contract not deployed to detected network.');
    }

    const leooSwapData = LeooSwap.networks[networkId];
    if (leooSwapData) {
      const leooSwap = new web3.eth.Contract(
        LeooSwap.abi,
        leooSwapData.address
      );
      this.setState({ leooSwap });
    } else {
      window.alert('LeooSwap contract not deployed to detected network.');
    }
    this.setState({ loading: false });
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      );
    }
  }

  buyTokens = etherAmount => {
    this.setState({ loading: true });
    this.state.leooSwap.methods
      .buyTokens()
      .send({ value: etherAmount, from: this.state.account })
      .on('transactionHash', hash => {
        this.setState({ loading: false });
      });
  };

  render() {
    let content;
    if (this.state.loading) {
      content = (
        <p id="loader" className="text-center">
          Loading...
        </p>
      );
    } else {
      content = (
        <Main
          ethBalance={this.state.ethBalance}
          tokenBalance={this.state.tokenBalance}
          buyTokens={this.buyTokens}
        />
      );
    }

    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main
              role="main"
              className="col-lg-12 ml-auto mr-auto"
              style={{ maxWidth: '600px' }}
            >
              <div className="content mr-auto ml-auto">
                <a href="https://minkj1992.github.io" target="_blank"></a>
                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
