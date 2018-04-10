/**
 * Created by psyfreak on 09.04.2018.
 */
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';


//var myContractInstance = SimpleStorage.new({data: SimpleStorage.bytecode, gas: 30000});

/**
 * creates contract either with user identified by userAdr or if not defined by web3.eth.accounts[0].
 * @param userAdr
 * @returns {Promise}
 */
createContract = function(userAdr) {
    let abi = getContractObject().abi,
        byteCode = getContractObject().bytecode,
        contract = web3.eth.contract(abi),
        user = userAdr || this.getUser(),
        gas = 3000000,
        params = {
            from: user,
            gas: gas,
            data: byteCode
        };
    console.log("create Contract: ", byteCode, contract, user);

    return new Promise( ( resolve, reject ) => {

        contract.new(params, ( error, response ) => {
            if ( error ) {
                reject( error.reason );
            } else {
                // contract deployment runs twice, first w/o address and when deployed successfully with address
                if(response.address) {
                    console.log( "Contract deployed!", response );
                    // add sender, currently no clue where
                    response.owner = params.from;
                    resolve( response );
                }
                else {
                    console.log( "Contract submitted!", response );
                }
            }
        });

    });
};

testContract = function(address) {
    console.log("test get/set for user: ", address);
    let curUser = getUser(),
        curContract = getContract(),
        val = curContract.get().toNumber();
        console.log("val", val);
    val+= 3;
        curContract.set(val, {from: address});
    val = curContract.get().toNumber();
    console.log("val after set", val);
};

/**
 * Not used atm.
 * Code for creating a contact with code and abi manually given by value instead of automated compilation of solitdity file.
 */
initializeContractByCode = function() {
    console.log("method initializeContract");
    // ABI description (JSON)
    let abi = [{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}],// EVM hex-bytecode
        code = "0x6060604052341561000f57600080fd5b60bb8061001d6000396000f30060606040526004361060485763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166360fe47b18114604d5780636d4ce63c146062575b600080fd5b3415605757600080fd5b60606004356084565b005b3415606c57600080fd5b60726089565b60405190815260200160405180910390f35b600055565b600054905600a165627a7a723058207dcd11756e0d762b7bd57c0a5911bcc81cc59adafc423b85b4a4a1085b80ce690029",
        contract = web3.eth.contract(abi), // define contract with abi
        account = web3.eth.accounts[0], //web3.eth.defaultAccount));
        balance = web3.eth.getBalance(account),
        userAddress = "";

    console.log("Deploying the contract, Account balance: " + balance);
    let deployedContract = contract.new("TEstBitch", {from: account, gas: 3000000, data: code});
    // wait for block to be mined
    async function waitBlock() { //JavaScript-style sleep: http://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
        while (true) {
            let receipt = web3.eth.getTransactionReceipt(deployedContract.transactionHash);
            if (receipt && receipt.contractAddress) {
                console.log("Your contract has been deployed at " + receipt.contractAddress);
                userAddress = receipt.contractAddress;
                break;
            }
            console.log("Waiting for block containing the contract to be mined... currently in block #" + web3.eth.blockNumber);
            await sleep(4000);
        }
    }
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    waitBlock();
};

/**
 * return js object automtically compiled file identified by name of storage.
 * Currently statically defined with "SimpleStorage.sol" in folder /client/contracts.
 * @returns {*}
 */
getContractObject = function() {
    if(SimpleStorage) {
        // console.log("ContractStorage", SimpleStorage);
        return SimpleStorage;
    }
    else {
        console.log("ContractStorage n/a");
        return null;
    }
};

/**
 * Returns a particular contract given by an address and an optional specific contractAbi
 * or if not defined then the abi of the currently defined contract obj.
 * @param contractAddress
 * @returns {*}
 */
getContract = function(contractAddress, contractAbi ) {
    let contrAbi = contractAbi || getContractObject().abi,
        foundContract = web3.eth.contract(contrAbi).at(contractAddress);
    return foundContract;
};

/**
 * Return first user => web3.eth.accounts[0]
 * @returns {*}
 */
getUser = function(){
    let currentAccount = web3.eth.accounts[0];
    console.log("currentAccount", currentAccount);
    return currentAccount;
};

getBalance = function() {
    return web3.eth.getBalance(this.getUser()).toNumber();
};



solcShizzle = function() {
    //web3.eth.defaultAccount));

    let code2 = SimpleStorage.bytecode,
        contract2 = web3.eth.contract(SimpleStorage.abi),
        account2 = web3.eth.accounts[0],
        deployedContract2 = contract2.new({from: getUser(), gas: 3000000, data: code2});
    // let receipt = web3.eth.getTransactionReceipt(deployedContract2.transactionHash);
    //var con = web3.eth.contract(SimpleStorage.abi).at(deployedContract2.address);
    con.get().toNumber();
    con.set(6, {from: account2});
}

/*
testContract() {
    // ABI description (JSON)
    let abi = [{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}];// EVM hex-bytecode
    let code = "0x6060604052341561000f57600080fd5b60bb8061001d6000396000f30060606040526004361060485763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166360fe47b18114604d5780636d4ce63c146062575b600080fd5b3415605757600080fd5b60606004356084565b005b3415606c57600080fd5b60726089565b60405190815260200160405180910390f35b600055565b600054905600a165627a7a723058207dcd11756e0d762b7bd57c0a5911bcc81cc59adafc423b85b4a4a1085b80ce690029",
        contract = web3.eth.contract(abi),
        account = web3.eth.accounts[0], //web3.eth.defaultAccount));
        balance = web3.eth.getBalance(account);
    console.log("Deploying the contract, Account balance: " + balance);
    let deployedContract = contract.new("TEstBitch", {from: account, gas: 3000000, data: code});
    // wait for block to be mined
    async function waitBlock() { //JavaScript-style sleep: http://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
        while (true) {
            let receipt = web3.eth.getTransactionReceipt(deployedContract.transactionHash);
            if (receipt && receipt.contractAddress) {
                console.log("Your contract has been deployed at " + receipt.contractAddress);
                break;
            }
            console.log("Waiting for block containing the contract to be mined... currently in block #" + web3.eth.blockNumber);
            await sleep(4000);
        }
    }
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    waitBlock();
}
*/

/*
var batch = web3.createBatch();
batch.add(web3.eth.getBalance.request('0x0000000000000000000000000000000000000000', 'latest', callback));
batch.add(web3.eth.Contract(abi).at(address).balance.request(address, callback2));
batch.execute();
 */


