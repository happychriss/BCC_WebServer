////// SERVICES  *********************************************************************
// Services are used to share code in your app
// 1st: Define Function
// 2nd: Register the Function as service available in the module
function BlockChainService(my_ABI, address, host) {
    this.assetVerifier = {
        ABI: my_ABI,
        address: address
    },
    this.web3 = new Web3,
    this.address = null,
    this.global_keystore = null,
    this.seed = null;
    var my_scope = this;

    this.checkTransaction = function (poll_transaction) {
        return (my_scope.web3.eth.getTransactionReceipt(poll_transaction))
    },

    this.createWallet = function(password, res) {
        var random_value = Math.random().toString(36),
            my_random_seed = lightwallet.keystore.generateRandomSeed(random_value);

        lightwallet.keystore.deriveKeyFromPassword(password, function(err, pwDerivedKey) {
            err ? res(err, null) : my_scope.initWallet(password, my_random_seed, pwDerivedKey, res)
        })
    }
    ,

    this.restoreWalletFromLocalStorage = function (res) {
        var  my_keystore=localStorage.getItem("my_wallet");
        my_scope.global_keystore=lightwallet.keystore.deserialize(my_keystore);
        var pwd = prompt("Enter Password to open your Keystore, stored in the browser", "Password");
        pwd && lightwallet.keystore.deriveKeyFromPassword(pwd, function(err, pwDerivedKey) {
                if (err)
                    res(err, null);
                else {
                    my_scope.global_keystore.generateNewAddress(pwDerivedKey, 1);
                    var a = my_scope.global_keystore.getAddresses();
                    my_scope.address = a[0];
                    my_scope.seed=my_scope.global_keystore  .getSeed(pwDerivedKey);
                    var l = new HookedWeb3Provider({
                        host: host,
                        transaction_signer: my_scope.global_keystore
                    });
                    my_scope.web3.setProvider(l);
                    res(null);
                }
        })

    },

    this.restoreWallet = function(res) {
        var pwd = prompt("Enter Password to encrypt your seed", "Password");
        pwd && lightwallet.keystore.deriveKeyFromPassword(pwd, function(err, pwDerivedKey) {
            if (err)
                res(err, null);
            else {
                var my_seed = prompt("Enter Seed to restore your wallet", "Seed");
                if (!my_seed)
                    return;
                my_scope.initWallet(pwd, my_seed, pwDerivedKey, res)
            }
        })
    }
    ,

    this.initWallet = function(password, my_seed, pwDerivedKey, res) {
        my_scope.global_keystore = new lightwallet.keystore(my_seed,pwDerivedKey);
        my_scope.global_keystore.generateNewAddress(pwDerivedKey, 1);
        var a = my_scope.global_keystore.getAddresses();
        my_scope.address = a[0], my_scope.seed = my_seed;
        var l = new HookedWeb3Provider({
            host: host,
            transaction_signer: my_scope.global_keystore
        });
        my_scope.web3.setProvider(l);
        res(null, my_scope.address);

        localStorage.setItem("my_wallet", my_scope.global_keystore.serialize());
        localStorage.setItem("my_address", my_scope.address);

    }
    ,

    this.deleteWallet = function(res) {
        my_scope.global_keystore = null,
        my_scope.address = null,
        my_scope.seed = null,
        localStorage.clear();
        res(null)
    }
    ,

    this.buildRegisterAssetTx = function(e, t, r, n, i) {
        var a = lightwallet.txutils
            , my_nonce = my_scope.web3.eth.getTransactionCount(e)
            , gas_price = my_scope.web3.eth.gasPrice
            , d = {
            gas: 271057,
            gasPrice: Number(gas_price),
            gasLimit: 312200,
            to: my_scope.assetVerifier.address,
            input: "0x",
            nonce: my_nonce,
            value: 0,
            contract: !1
        }
            , u = a.functionTx(my_scope.assetVerifier.ABI, "createAsset", [t, n, r], d);
        this.singTransaction(u, function(e, t) {
            i(e, t)
        })
    }
    ,
    this.singTransaction = function(e, t) {
        var r = prompt("Enter Password to sign your transaction", "Password");
        if (r) {
            var n = lightwallet.signing;
            lightwallet.keystore.deriveKeyFromPassword(r, function(r, i) {
                if (r)
                    t(r, null);
                else {
                    var a = n.signTx(my_scope.global_keystore, i, e, my_scope.address);
                    t(null, a)
                }
            })
        }
    }
    ,
    this.verifyOwner = function(e) {
        var hash_contract = my_scope.web3.eth.contract(my_scope.assetVerifier.ABI).at(my_scope.assetVerifier.address);     //get access to the hash-contract


        hash_contract.getAsset({
            from: "0x" + my_scope.address
        }, function(t, r) {
            function n(e, t) {
                return 0 === r[e] || "0x" === r[e] ? "None" : t(r[e])
            }
            function i(e) {
                return my_scope.web3.toAscii(e)
            }
            if (t)
                e(t, null);
            else {
                var a = {
                    owner: n(0, function(e) {
                        return e
                    }),
                    hash: n(1, i),
                    message: n(2, i),
                    date: n(3, function(e) {
                        return Date.parse(e.toFixed(0))
                    })
                };
                e(null, a)
            }
        })
        }
}
angular.module("BlockChainDemo").service("BlockChainService", ["ABI", "HC_ADDRESS", "HOST", BlockChainService]);

