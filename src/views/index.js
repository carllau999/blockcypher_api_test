import axios from 'axios';

var token = "1959c05210554390b060086b1a35f414" // BlockCypher Token
var my_hex_private_key = "b347f602e4e88807a7572ed3f8c182fe7aaa11cbff75114ae7d2f2176c0ae7cf" // user1's private key
var bitcoin = require("bitcoinjs-lib");
var bigi = require("bigi");
var buffer = require('buffer');
var keys = new bitcoin.ECPair(bigi.fromHex(my_hex_private_key));
/**
 * Returns the balance of an address using BlockCypher's test faucet
 * @param  {string} address [Address of the query]
 * @return {JSON}         [JSON containing the unconfirmed_balance and final_balance]
 */
async function getBalance(address) {
	try {
		let result = await axios.get(`https://api.blockcypher.com/v1/bcy/test/addrs/${address}/balance`)

		return result.data
	} catch (error) {
		console.log('error', error) // catch errors
		return {
			errors: error
		}

	}
}

/**
 * Returns the tx_ref and funds the input address with the amount
 * @param  {string} address [Address of the query]
 * @param  {int} amount  [The quantity of the transaction]
 * @return {JSON}         [JSON containing the tx_ref]
 */
async function fundAccount(address, amount) {
	try {
		let data = {
			"address": address,
			"amount": amount
		}
		let result = await axios.post(`https://api.blockcypher.com/v1/bcy/test/faucet?token=${token}`, JSON.stringify(data))
		return result.data
	} catch (error) {
		console.log('error', error) // catch errors
		return {
			errors: error
		}
	}
}


/**
 * Returns tx object and creates a transaction of the input amount from address1 to address2
 * @param  {string} address1 [Address of the creator of transaction]
 * @param  {string} address2 [Address of the recipient of the transaction]
 * @param  {int} amount   [Amount to be transfered]
 * @return {JSON}          [JSON of the TX object]
 */
async function makePayment(address1, address2, amount) {
	try {
		// transaction data in the required format
		let data = {
			"inputs": [{
				"addresses": [address1]
			}],
			"outputs": [{
				"addresses": [address2],
				"value": amount
			}]
		}
		let tmptx = await axios.post(`https://api.blockcypher.com/v1/bcy/test/txs/new?token=${token}`, JSON.stringify(data))
		tmptx = tmptx.data
		tmptx.pubkeys = []
		// signing data from the returned tosign array
		tmptx.signatures = tmptx.tosign.map(function(tosign, n) {
			tmptx.pubkeys.push(keys.getPublicKeyBuffer().toString("hex"));
			return keys.sign(new buffer.Buffer(tosign, "hex")).toDER().toString("hex");
		});
		// sending signed data to complete transaction
		let final_tx = await axios.post(`https://api.blockcypher.com/v1/bcy/test/txs/send?token=${token}`, JSON.stringify(tmptx))
		return final_tx.data.tx.hash
	} catch (error) {
		console.log('error', error)
		return {
			errors: error
		}
	}
}
export {
	getBalance,
	fundAccount,
	makePayment
}