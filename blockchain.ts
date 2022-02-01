import * as crypto from 'crypto-js';

const generateBlock = (message: string): Block => new Block(message);

class Block {
  static index = 0;
  private nonce = 0;
  private timestamp;
  private data;
  public previousHash = '';
  public hash: any;

  constructor(private message: string) {
    Block.index++;
    this.timestamp = new Date().toDateString();
    this.data = Block.index + this.timestamp + this.message + this.previousHash;
  }

  createHash = () =>
    crypto.HmacSHA256(this.data, this.nonce.toString()).toString();

  // Do Proof-Of-Work
  mining = (zeroes: number = 2) => {
    let hash;
    let nonce = 0;
    while (true) {
      this.key++;
      hash = this.createHash();
    }
    console.log(hash);
  };
}

class Blockchain {
  static previousHash = '';
  public chain: Array<Block> = [];

  addBlock = (block: Block) => {
    if (this.isValid() === false) throw Error('block does not valid exception');

    block.previousHash = Blockchain.previousHash;
    block.hash = block.createHash();
    Blockchain.previousHash = block.hash;
    this.chain.push(block);
  };

  isValid = () => {
    const n = this.chain.length;
    if (n <= 1) {
      return true;
    }

    for (let i = 1; i < n; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  };

  print = () => {
    this.chain.forEach(block => console.log(block));
  };
}

function main() {
  const blockchain = new Blockchain();

  const genesis = new Block('I am Genesis');
  blockchain.addBlock(genesis);

  const secondCoin = generateBlock('2nd coin');
  blockchain.addBlock(secondCoin);
  secondCoin.mining();

  const thirdCoin = generateBlock('3rd coin');
  blockchain.addBlock(thirdCoin);
  thirdCoin.mining();

  const fourthCoin = generateBlock('4th coin');
  blockchain.addBlock(fourthCoin);
  fourthCoin.mining();

  blockchain.print();
}

main();
