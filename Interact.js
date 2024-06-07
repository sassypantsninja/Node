const Web3 = require('web3');
const fs = require('fs');
require('dotenv').config();

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_URL));

const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);

const contractAddress = 'DEPLOYED_CONTRACT_ADDRESS';
const abi = JSON.parse(fs.readFileSync('SimpleStorage.json', 'utf8'));
const contract = new web3.eth.Contract(abi, contractAddress);

(async () => {
    // Set data
    const setDataTx = contract.methods.setData(42);
    const gas = await setDataTx.estimateGas();
    const gasPrice = await web3.eth.getGasPrice();

    await setDataTx.send({
        from: account.address,
        gas,
        gasPrice,
    });

    console.log('Data set to 42');

    // Get data
    const data = await contract.methods.getData().call();
    console.log('Data:', data);
})();
