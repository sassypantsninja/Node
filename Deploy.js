const Web3 = require('web3');
const fs = require('fs');
require('dotenv').config();

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_URL));

const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);

const bytecode = 'YOUR_CONTRACT_BYTECODE';
const abi = JSON.parse(fs.readFileSync('SimpleStorage.json', 'utf8'));

(async () => {
    const contract = new web3.eth.Contract(abi);
    const deployTx = contract.deploy({ data: bytecode });

    const gas = await deployTx.estimateGas();
    const gasPrice = await web3.eth.getGasPrice();

    const deploy = await deployTx.send({
        from: account.address,
        gas,
        gasPrice,
    });

    console.log('Contract deployed at address:', deploy.options.address);
})();
