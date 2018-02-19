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
    this.seed = null,
    this.assetList = {
        owner_name: "",
        owner_create_date: "",
        hashes: []
    };

    var bs_service = this;


    this.getOwnerName = function() {
        if (bs_service.assetList.owner_name===null) {
            return '';
        }
        return bs_service.assetList.owner_name;
    };



    this.checkTransaction = function (poll_transaction) {
        return (bs_service.web3.eth.getTransactionReceipt(poll_transaction));
    },

        this.createWallet = function (password, res) {
            var random_value = Math.random().toString(36),
                my_random_seed = lightwallet.keystore.generateRandomSeed(random_value);

            lightwallet.keystore.deriveKeyFromPassword(password, function (err, pwDerivedKey) {
                err ? res(err, null) : bs_service.initWallet(password, my_random_seed, pwDerivedKey, res)
            })
        },


        this.restoreWalletFromLocalStorage = function (res) {
            var my_keystore = localStorage.getItem("my_wallet");
            bs_service.global_keystore = lightwallet.keystore.deserialize(my_keystore);
            var pwd = prompt("Enter Password to open your Keystore, stored in the browser", "Password");
            pwd && lightwallet.keystore.deriveKeyFromPassword(pwd, function (err, pwDerivedKey) {
                if (err)
                    res(err, null);
                else {
                    bs_service.global_keystore.generateNewAddress(pwDerivedKey, 1);
                    var a = bs_service.global_keystore.getAddresses();
                    bs_service.address = a[0];
                    bs_service.seed = bs_service.global_keystore.getSeed(pwDerivedKey);
                    var l = new HookedWeb3Provider({
                        host: host,
                        transaction_signer: bs_service.global_keystore
                    });
                    bs_service.web3.setProvider(l);
                    res(null, bs_service.address);
                }
            });

        },

        this.restoreWallet = function (res) {
            var pwd = prompt("Enter Password to encrypt your seed", "Password");
            pwd && lightwallet.keystore.deriveKeyFromPassword(pwd, function (err, pwDerivedKey) {
                if (err)
                    res(err, null);
                else {
                    var my_seed = prompt("Enter Seed to re  store your wallet", "Seed");
                    if (!my_seed)
                        return;
                    bs_service.initWallet(pwd, my_seed, pwDerivedKey, res)
                }
            })
        }
        ,

        this.initWallet = function (password, my_seed, pwDerivedKey, res) {
            bs_service.global_keystore = new lightwallet.keystore(my_seed, pwDerivedKey);
            bs_service.global_keystore.generateNewAddress(pwDerivedKey, 1);
            bs_service.ownername = '';
            var a = bs_service.global_keystore.getAddresses();
            bs_service.address = a[0], bs_service.seed = my_seed;
            var l = new HookedWeb3Provider({
                host: host,
                transaction_signer: bs_service.global_keystore
            });
            bs_service.web3.setProvider(l);
            res(null, bs_service.address);

            localStorage.setItem("my_wallet", bs_service.global_keystore.serialize());
            localStorage.setItem("my_address", bs_service.address);
            ;


            bs_service.RegisterEvents(function (events) {
                console.log("Register for Events");
                events.watch(function (error, event) {
                    if (!error)
                        console.log(event);
                });

            })

        }
        ,

        this.deleteWallet = function (res) {
            bs_service.global_keystore = null,
                bs_service.address = null,
                bs_service.seed = null,
                bs_service.ownername = null,

                localStorage.clear();
            res(null);
        }
        ,

        this.RegisterEvents = function (res) {

            var hash_contract = bs_service.web3.eth.contract(bs_service.assetVerifier.ABI).at(bs_service.assetVerifier.address); //get access to the hash-contract

            var events = hash_contract.allEvents();

// watch for changes
            res(events);


        },

        this.showOwnerDetails = function (owner_address, res) {

            var hash_contract = bs_service.web3.eth.contract(bs_service.assetVerifier.ABI).at(bs_service.assetVerifier.address); //get access to the hash-contract

            var i = 0, result;

            bs_service.assetList.owner_name = null;
            bs_service.assetList.hashes = [];
            bs_service.owner_found=false;
            bs_service.owner=null;

            do {

                result = hash_contract.getHashesbyOwner(i, {from: "0x" + owner_address});
                // asset.owner,owner.name, owner.createDate, asset.checksum, asset.description, asset.createDate);

                console.log("Check for Hashes:" + i);

                if (result[3] > 2) {

                    if (i === 0) {
                        bs_service.assetList.owner_name = bs_service.web3.toAscii(result[1]);

                        if (bs_service.assetList.owner_name === '') {
                            bs_service.assetList.owner_name = null;
                        }

                        bs_service.assetList.owner_create_date = Date(result[2].toNumber(0));

                    }

                    bs_service.assetList.hashes.push({
                            checksum: bs_service.web3.toAscii(result[3]),
                            description: bs_service.web3.toAscii(result[4]),
                            create_date: Date(result[5].toNumber(0))

                        }
                    );


                    i++;
                }
                else {
                    break;
                }

            } while (true); //contracts return 01 and 02 for hash not found

            res(null, bs_service.assetList);
        },


        this.buildRegisterAssetTx = function (owner, ownername, checksum, creation_date, description, i) {
            var a = lightwallet.txutils
                , my_nonce = bs_service.web3.eth.getTransactionCount(owner)
                , gas_price = bs_service.web3.eth.gasPrice
                , d = {
                    gas: 271057,
                    gasPrice: Number(gas_price),
                    gasLimit: 312200,
                    to: bs_service.assetVerifier.address,
                    input: "0x",
                    nonce: my_nonce,
                    value: 0,
                    contract: !1
                }
                ,
                u = a.functionTx(bs_service.assetVerifier.ABI, "createAsset", [checksum, ownername, description, creation_date], d);
            this.singTransaction(u, function (e, t) {
                i(e, t)
            })
        }
        ,
        this.singTransaction = function (e, t) {
            var r = prompt("Enter Password to sign your transaction", "Password");
            if (r) {
                var n = lightwallet.signing;
                lightwallet.keystore.deriveKeyFromPassword(r, function (r, i) {
                    if (r)
                        t(r, null);
                    else {
                        var a = n.signTx(bs_service.global_keystore, i, e, bs_service.address);
                        t(null, a)
                    }
                })
            }
        }
        ,
        this.verifyOwner = function (checksum, res) {


            if (bs_service.currentProvider==null) {
                var l = new HookedWeb3Provider({
                    host: host,
                    transaction_signer: bs_service.global_keystore
                });
                bs_service.web3.setProvider(l);
            }

            var hash_contract = bs_service.web3.eth.contract(bs_service.assetVerifier.ABI).at(bs_service.assetVerifier.address);     //get access to the hash-contract


            hash_contract.getAssetbyHash(checksum, function (err, asset) {
                function check_zero(pos, res) {
                    return 0 === asset[pos] || "0x" === asset[pos] ? "None" : res(asset[pos])
                }

                function convert_to_asci(e) {
                    return bs_service.web3.toAscii(e)
                }

                if (err)
                    res(err, null);
                else {
                    var resultVerfiy = {
                        asset_found: (check_zero(0, function (res) {
                            return res
                        }) !== '0x0000000000000000000000000000000000000000'),
                        owner: check_zero(0, function (res) {
                            return res
                        }),
                        owner_name: check_zero(1, convert_to_asci),

                        date: check_zero(2, function (res) {
                            return new Date(res.toNumber(0));
                        }),
                        hash: check_zero(3, convert_to_asci),
                        message: check_zero(4, convert_to_asci),
                        asset_date: check_zero(5, function (res) {
                            return new Date(res.toNumber(0));
                        })
                    };
                    res(null, resultVerfiy);
                }
            })
        }
}

angular.module("BlockChainDemo").service("BlockChainService", ["ABI", "HC_ADDRESS", "HOST", BlockChainService]);

