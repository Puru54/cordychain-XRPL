const Product = require('../models/product');
const RippleAPI = require('ripple-lib').RippleAPI;
const { deriveKeypair } = require('ripple-keypairs'); // Import deriveKeypair function

exports.registerProduct = async (req, res) => {
    try {
        const { name, description } = req.body;

        // Connect to XRPL
        const api = new RippleAPI({ server: 'wss://s.altnet.rippletest.net:51233/' });
        await api.connect();

        // Construct XRPL transaction to register product
        const keypair = deriveKeypair('sEdVQxpp3iyFGFbLs9Cg11JeVaES5r6'); // Derive keypair using secret key
        console.log(keypair)
        const transaction = {
            TransactionType: 'Payment',
            Account: "rB37sfuuRQtq5YEAF8uMKhUPHTtuqGe8YA", // Include the Account property with the address derived from the secret key
            Amount: '0', // Set to 0 XRP
            Destination: "rB37sfuuRQtq5YEAF8uMKhUPHTtuqGe8YA", // Send XRP to yourself
            Memos: [
                {
                    Memo: {
                        MemoType: 'ProductRegistration',
                        MemoData: JSON.stringify({ name, description }) // Convert product details to string
                    }
                }
            ]
        };
        const privateKey= 'ED1D0392082B79E4AE23BC49780186E025508E0C5FA4DA2ED832A3A262515E435C'
        
        // Prepare and sign transaction
        const preparedTx = await api.prepareTransaction(transaction, { maxLedgerVersionOffset: 5 });
        const signedTx = api.sign(preparedTx.txJSON,privateKey); // Sign the transaction with private key

        // Submit the signed transaction
        const txResponse = await api.submit(signedTx.signedTransaction);

        // Handle XRPL registration response
        console.log('XRPL Registration Response:', txResponse);

        // Disconnect from XRPL
        await api.disconnect();

        res.json({ message: 'Product registered successfully' });
    } catch (error) {
        console.error('Error registering product on XRPL:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.retrieveProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        // Connect to XRPL
        const api = new RippleAPI({ server: 'wss://s.altnet.rippletest.net:51233/' });
        await api.connect();

        // Retrieve product details from XRPL using productId
        const transactions = await api.request('account_tx', {
            account: 'rB37sfuuRQtq5YEAF8uMKhUPHTtuqGe8YA',
            ledger_index_min: -1,
            ledger_index_max: -1,
            binary: false,
            limit: 100, // Adjust as needed
            forward: false,
            filter: {
                memos: [
                    {
                        memo: {
                            MemoType: 'ProductRegistration',
                            MemoData: productId // Search for transactions with specified productId in memo
                        }
                    }
                ]
            }
        });

        // Handle XRPL retrieval response
        // For simplicity, let's just log the transactions
        console.log('XRPL Retrieval Response:', transactions);

        // Disconnect from XRPL
        await api.disconnect();

        // Process product details if needed
        const productDetails = transactions.transactions.map(tx => JSON.parse(tx.specification.memos[0].memo.MemoData));

        res.json(productDetails);
    } catch (error) {
        console.error('Error retrieving product from XRPL:', error);
        res.status(500).json({ error: error.message });
    }
};
