const prompt = require('prompt');
const { randomBytes } = require('crypto')
const ethutil = require('ethereumjs-util');
const secp256k1 = require('secp256k1');

prompt.start();

prompt.get(['publicAddress', 'privateKey'], function (err, result) {
	const privateKeyBuffer = new Buffer(result.privateKey, 'hex');
	const publicKeyBuffer = ethutil.privateToPublic(privateKeyBuffer);

	// verify private key
	console.log('Private key legal: ' + ethutil.isValidPrivate(privateKeyBuffer));

	// verify public address
	console.log('Wallet address matches public address derived from private key: ' + (ethutil.bufferToHex(ethutil.pubToAddress(publicKeyBuffer)).toUpperCase() === result.publicAddress.toUpperCase()));

	// generate message to sign
	const msg = randomBytes(32);

	// sign the message
	const sigObj = secp256k1.sign(msg, privateKeyBuffer);

	// verify the signature
	console.log('Signature verified: ' + secp256k1.verify(msg, sigObj.signature, Buffer.concat([ Buffer.from([4]), publicKeyBuffer ])));
});