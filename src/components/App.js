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

  async loadTokenAndSwap() {
    const networkId = await window.web3.eth.net.getId();
    const tokenData = Token.networks[networkId];
    if (tokenData) {
      const token = new window.web3.eth.Contract(Token.abi, tokenData.address);
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
      const leooSwap = new window.web3.eth.Contract(
        LeooSwap.abi,
        leooSwapData.address
      );
      this.setState({ leooSwap });
    } else {
      window.alert('LeooSwap contract not deployed to detected network.');
    }
    this.setState({ loading: false });
  }

  async loadBlockchainData() {
    const accounts = await window.web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const ethBalance = await window.web3.eth.getBalance(this.state.account);
    this.setState({ ethBalance });

    await this.loadTokenAndSwap();
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

  sellTokens = amount => {
    function delayedCallback(obj, hash) {
      console.log('in delay', obj.state.account);
      window.setTimeout(() => {
        console.log('approval', hash);
        obj.state.leooSwap.methods
          .sellTokens(amount)
          .send({ from: obj.state.account })
          .on('error', (error, receipt) => {
            console.error(error);
          })
          .on('transactionHash', hash => {
            obj.setState({ loading: false });
          });
      }, 1000);
    }

    this.setState({ loading: true });
    this.state.token.methods
      .approve(this.state.leooSwap.address, amount)
      .send({ from: this.state.account })
      .on('error', (error, receipt) => {
        console.error(error);
      })
      .on('transactionHash', hash => delayedCallback(this, hash));
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
          sellTokens={this.sellTokens}
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
