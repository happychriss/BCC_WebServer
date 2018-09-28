'use strict';

angular.module("BlockChainDemo",
    ["ui.bootstrap", "ngCookies", "ljungmann.fileMd5", "ngFileUpload"])
    .constant("HOST", "https://rinkeby.infura.io/v3/d89b45652db3453fb6ce55ffb6ec2fae")
    .constant("HC_ADDRESS", "2993adA82373AA0b3A95780E35D21718160Cc974")
    .constant("ABI",

// angular.module("BlockChainDemo").constant("HOST", "http://localhost:9545").constant("HC_ADDRESS", "345ca3e014aaf5dca488057592ee47305d9b3e10").constant("ABI",
        [
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "owners",
                "outputs": [
                    {
                        "name": "name",
                        "type": "bytes32"
                    },
                    {
                        "name": "createDate",
                        "type": "uint256"
                    },
                    {
                        "name": "is_created",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_owner",
                        "type": "address"
                    }
                ],
                "name": "setOwner",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [],
                "name": "destroy",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "getOwner",
                "outputs": [
                    {
                        "name": "",
                        "type": "bytes32"
                    },
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "index",
                        "type": "uint256"
                    }
                ],
                "name": "getHashesbyOwner",
                "outputs": [
                    {
                        "name": "",
                        "type": "address"
                    },
                    {
                        "name": "",
                        "type": "bytes32"
                    },
                    {
                        "name": "",
                        "type": "uint256"
                    },
                    {
                        "name": "",
                        "type": "bytes32"
                    },
                    {
                        "name": "",
                        "type": "bytes32"
                    },
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "owner",
                "outputs": [
                    {
                        "name": "",
                        "type": "address"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "_checksum",
                        "type": "bytes32"
                    }
                ],
                "name": "getAssetbyHash",
                "outputs": [
                    {
                        "name": "",
                        "type": "address"
                    },
                    {
                        "name": "",
                        "type": "bytes32"
                    },
                    {
                        "name": "",
                        "type": "uint256"
                    },
                    {
                        "name": "",
                        "type": "bytes32"
                    },
                    {
                        "name": "",
                        "type": "bytes32"
                    },
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "",
                        "type": "bytes32"
                    }
                ],
                "name": "assets",
                "outputs": [
                    {
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "name": "checksum",
                        "type": "bytes32"
                    },
                    {
                        "name": "description",
                        "type": "bytes32"
                    },
                    {
                        "name": "createDate",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_checksum",
                        "type": "bytes32"
                    },
                    {
                        "name": "_ownerName",
                        "type": "bytes32"
                    },
                    {
                        "name": "_description",
                        "type": "bytes32"
                    },
                    {
                        "name": "_createDate",
                        "type": "uint256"
                    }
                ],
                "name": "createAsset",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "fallback"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "_checksum",
                        "type": "bytes32"
                    },
                    {
                        "indexed": false,
                        "name": "_createDate",
                        "type": "uint256"
                    }
                ],
                "name": "AssetCreated",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "sender",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "errorCode",
                        "type": "uint256"
                    }
                ],
                "name": "Error",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "owner_name",
                        "type": "bytes32"
                    }
                ],
                "name": "OwnerCreated",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "name": "message",
                        "type": "string"
                    }
                ],
                "name": "Log",
                "type": "event"
            }
        ]
    ).run(["$http", "$uibModal","$rootScope", function (my_http, t, $rootScope) {
        $rootScope.ETHERSCAN="https://rinkeby.etherscan.io/";

    }]);

////// Components *********************************************************************
// angular.module("BlockChainDemo").component("assetsUploadInfo", {controller: function() {},               templateUrl: "templates/assets-upload-info.html"});
angular.module("BlockChainDemo").component("assetsUpload", {
    controller: "AssetsUploadController",
    templateUrl: "templates/assets-upload.html"
});
angular.module("BlockChainDemo").component("assetsVerify", {
    controller: "AssetsVerifyController",
    templateUrl: "templates/assets-verify.html"
});
angular.module("BlockChainDemo").component("introComponent", {
    controller: function () {
    }, templateUrl: "templates/intro.html"
});
angular.module("BlockChainDemo").component("walletComponent", {
    controller: "WalletController",
    templateUrl: "templates/wallet.html"
});


////// Controllers and function  *********************************************************************

function assetsUpload(scope, $timeout, my_http, o, my_log, blockchainService, md5service, my_api_bc_ignore) {
    var my_scope = scope;

    my_scope.upload_asset = {
        name: "",
        message: "",
        address: blockchainService.assetVerifier.address
    } ;


    const STEP_1_SENT_MONEY = 1;
    const STEP_2_POLL_MONEY = 2;
    const STEP_3_POLL_CONTRACT = 3;
    const STEP_4_CONTRACT_DONE = 4;
    const ERROR = -1;

    var loadTime = 1000, //Load the data every second
        errorCount = 0, //Counter for the server errors
        loadPromise, //Pointer to the promise created by the Angular $timout service
        status = 0,
        contract_tx,
        poll_transaction,
        timer_counter,


        SentAndPollData = function (status_in, tx) {
            status = status_in;
            contract_tx = tx;
            PollData();
            my_scope.timer_count = 0;
            my_scope.status = status;
        },

        PollData = function () {
            var my_api_bc = BC_FUELSERVER_URL;

            my_log.log("SendAndPollData with status:" + status);
            my_scope.timer_count = my_scope.timer_count + 1;

            switch (status) {
                case STEP_1_SENT_MONEY:
                    my_scope.status_text = "Part-1/4: We put Ether to your public address, to pay for the Blockchain transaction.";
                    my_http.post(my_api_bc + "1", contract_tx, null).success(function (req, res) {
                        my_log.log("success : " + req + ":" + res);
                        status = STEP_2_POLL_MONEY;

                        errorCount = 0;
                        poll_transaction = req;
                        nextLoad();
                    }).error(function (req, res) {
                        my_log.log("error : " + req + ":" + res);
                        status = ERROR;
                    })
                    break;

                case STEP_2_POLL_MONEY:
                    my_scope.status_text = "Part-2/4: We need to wait up to 45 seconds until the transaction is confirmed (mined).";

                    var tresult = blockchainService.checkTransaction(poll_transaction);

                    if (tresult === null) {
                        nextLoad();
                    } else {
                        my_log.log("Mining Done - send Asset");
                        my_scope.timer_count = 0;
                        my_scope.status_text = "Part-3/4: Now the certificates Hash is sent to the Smart Contract!";

                        my_http.post(my_api_bc + "2", contract_tx, null).success(function (req, res) {
                            my_log.log("Contract Created, results : " + req + ":" + res);
                            status = STEP_3_POLL_CONTRACT;
                            poll_transaction = req;
                            nextLoad();
                        }).error(function (req, res) {
                            my_log.log("Contract creation, error : " + req + ":" + res);
                            status = ERROR;
                        })
                    }

                    break;

                case STEP_3_POLL_CONTRACT:

                    my_scope.status_text = "Part -3/4: Certificate Hash was sent to the Smart Contract. We need to wait up to 45 seconds until the transaction is confirmed.";

                    tresult = blockchainService.checkTransaction(poll_transaction);

                    if (tresult === null) {
                        nextLoad();
                    } else {
                        status = STEP_4_CONTRACT_DONE;
                        my_log.log("Polling Done");

                        tresult.logs.forEach(function (log) {
                        //The hash of the signature of the event is one of the topics, in this case for event Error(address indexed sender, uint errorCode);
                          if (log.topics[0]==="0x9cf38cf2dbf9139f5c32639950507b10775fbbe0421f3e168bc2d1bb1ae3208c") {

                              switch (blockchainService.web3.toDecimal(log.data)){
                                  case 1001: my_scope.status_text="Sorry, Hash was already uploaded";break;
                                  default: my_scope.status_text="UNKOWN ERROR-Code:"+blockchainService.web3.toDecimal(log.data);
                            }

                           status = ERROR;
                          }
                        });


                    }
                    errorCount = 0;
                    nextLoad();
                    break;

                case STEP_4_CONTRACT_DONE:

                    my_scope.status_text = "Step-4/4: DONE - Your Hash is in on the Blockchain. Never to be deleted.";
                    my_log.log("MISSION Completed");
                    my_scope.status_completed = true;
                    my_scope.poll_transaction=poll_transaction;


                    blockchainService.showOwnerDetails(blockchainService.address, function (err, asset) {
                       my_scope.hashes = asset.hashes;
                    cancelNextLoad();
                    })

                    break;

                case ERROR:
                    my_log.log("ERROR");
                    cancelNextLoad();
                    break;

            }
            my_scope.status = status;
        },

        cancelNextLoad = function () {
            $timeout.cancel(loadPromise);
        },

        nextLoad = function (mill, new_status) {

            mill = mill || loadTime;
            status = status || new_status;
            timer_counter++;

            //Always make sure the last timeout is cleared before starting a new one
            cancelNextLoad();
            loadPromise = $timeout(PollData, mill);
        };


    my_scope.$watch(function () {
            return blockchainService.getOwnerName();         },
        function (value) {
            my_scope.ownername= value;
        }),

    //***********************************************************************
    /// Upload flow starts from here UploadPic->SendHash->BuilRegisterAsset

    my_scope.uploadPic = function (e) {
        md5service.md5(e).progress(function (uploaded_file) {
            my_log.log("Hashed " + uploaded_file.loaded + " B out of " + uploaded_file.total + " B")
        }).error(function (e) {
            my_log.log("Error calculating md5: %o", e)
        }).success(function (s) {
            my_log.log("MD5 for " + e.name + " is " + s),
                my_scope.sendHash(s)
        })
    },


    //*********** Prepare the transaction, build the contract -to be sent to FuelServer for execution **************
    my_scope.sendHash = function (my_hash) {
        my_scope.asset = {
            filehash: my_hash,
            owner: blockchainService.address,
            name: my_scope.upload_asset.name,
            date: new Date,
            message: my_scope.upload_asset.message
        },
            blockchainService.buildRegisterAssetTx("0x" + my_scope.asset.owner.toLowerCase(), my_scope.asset.name, my_scope.asset.filehash, my_scope.asset.date.getTime(), my_scope.asset.message, function (e, raw_transaction) {
                if (e)
                    my_log.log("Failed to send transaction: " + e);
                else {
                    var t = {
                        tx: raw_transaction,
                        token: localStorage.getItem("token")
                    };
                    SentAndPollData(STEP_1_SENT_MONEY, t);
                }
            })
    }
    ,
    my_scope.hasOwner = function () {
        return blockchainService.address && blockchainService.seed;
    },



    my_scope.isEmpty = function (obj) {
        for (var i in obj) if (obj.hasOwnProperty(i)) return false;
        return true;
    };
}

angular.module("BlockChainDemo").controller("AssetsUploadController", ["$scope", "$timeout", "$http", "$window", "$log", "BlockChainService", "fileMd5Service", assetsUpload]);


function assetsVerifyController(scope, win, console, bc_service, md5_service) {
    var my_scope = scope;

    my_scope.asset = {
        message: '',
        filehash: '',
        accountAddress: '',
        address: bc_service.assetVerifier.address,
        ownername: '',
        uploaded: '',
        asset_found: false
    },

        // commma means a list of declaration, I am declaring functions here. executed during initialization
        my_scope.owner = null;
//    my_scope.asset = bc_service.assetVerifier,


    my_scope.verify = function (file_handle) {
        md5_service.md5(file_handle).progress(function (res) {
            console.log("Hashed " + res.loaded + " B out of " + res.total + " B");
        }).error(function (res) {
            console.log("Error calculating md5: %o", res)
        }).success(function (checksum) {
            console.log("MD5 for " + file_handle.name + " is " + checksum),
                my_scope.asset.filehash = checksum;
            var contract_address = my_scope.asset.address; //smart contract address
            bc_service.verifyOwner(checksum, function (res, verify_result) {
                if (res == null && verify_result.asset_found) {
                    console.log("Found asset with hash:" + checksum);
                    my_scope.asset.message = verify_result.message;
                    my_scope.asset.ownername = verify_result.owner_name;
                    my_scope.asset.owner = verify_result.owner;
                    my_scope.asset.uploaded = verify_result.date;
                    my_scope.asset.filehash = checksum;
                    my_scope.asset.address = contract_address;
                    my_scope.accountAddress = bc_service.address;
                    my_scope.asset.asset_found = true;
                    my_scope.$apply();
                }
                else {
                    console.log("Failed to verity hash: " + res);
                    my_scope.asset.filehash = checksum;
                    my_scope.asset.message = '';
                    my_scope.asset.onwername = '';
                    my_scope.asset.uploaded = '';
                    my_scope.asset.address = contract_address;
                    my_scope.accountAddress = bc_service.address;
                    my_scope.asset.asset_found = false;
                    my_scope.$apply();
                }
            })
        })
    }
}

angular.module("BlockChainDemo").controller("AssetsVerifyController", ["$scope", "$window", "$log", "BlockChainService", "fileMd5Service", assetsVerifyController]);


function BlockchainController(o, r, e) {
    function a() {
        t.addClass("error-popup-show"),
            e(function () {
                t.removeClass("error-popup-show")
            }, 3e3)
    }

    var n = r
        , s = o.find("global-loader")
        , t = o.find("error-popup");
    n.$on("startGlobalLoading", function () {
        s.addClass("ion-show")
    }),
        n.$on("finishGlobalLoading", function () {
            s.removeClass("ion-show")
        }),
        n.$on("showErrorResponse", function (o, r) {
            n.error = r,
                s.removeClass("ion-show"),
                n.$watch(function () {
                    return n.error
                }, function (o) {
                    var r = o && o.data && o.data.error || o.data && o.data.message;
                    r ? (n.errorMessage = o.data.message || o.data.error.message,
                        a()) : (n.errorMessage = "Server Not Found",
                        a())
                })
        })
}

angular.module("BlockChainDemo").controller("BlockchainController", ["$document", "$rootScope", "$timeout", BlockchainController]);


function EnterController(e, form) {
    var my_scope = e;
    my_scope.enter = function (e) {
        var email = e.email.$viewValue;
        form.enter(email, function () {
            my_scope.$close()
        })
    }

}

angular.module("BlockChainDemo").controller("EnterController", ["$scope", "UserService", EnterController]);


function WalletController(scope, window, bc_service) {
    var my_scope = scope;

    my_scope.upload_asset = {
        name: '',
        message: '',
        upload_date:''
    };

    my_scope.ownername='',

    my_scope.deleteWallet = function () {
        var isConfirmed = confirm("Are you sure to delete your wallet ?");
        if (isConfirmed) {
            bc_service.deleteWallet(function (e) {
                my_scope.refresh(e);
            })
        }
    },


        my_scope.checkWallet = function () {
            return localStorage.getItem("my_wallet") !== null;
        },

        my_scope.restoreWalletFromLocalStorage = function () {
            bc_service.restoreWalletFromLocalStorage(function (err, owner_address) {

                if (err == null) {
                    bc_service.showOwnerDetails(owner_address, function (err, asset) {
                        my_scope.upload_asset.name = asset.owner_name;
                        my_scope.upload_asset.upload_date = asset.owner_create_date;
                        my_scope.hashes = asset.hashes;
                        my_scope.refresh(err);
                    })
                }
                my_scope.refresh(err);
            })
        },

        my_scope.createWallet = function (form) {
            var mypwd = form.password.$viewValue;
            bc_service.createWallet(mypwd, function (e) {
                my_scope.refresh(e);
            });
        }
        ,
        my_scope.restoreWallet = function () {
            bc_service.restoreWallet(function (e) {
                my_scope.refresh(e)
            })
        }
        ,
        my_scope.deleteWallet = function () {
            bc_service.deleteWallet(function (e) {
            })
            my_scope.accountAddress = null;
            my_scope.seed = null;
            my_scope.hashes=[];
            my_scope.upload_asset = {
                    name: '',
                    message: '',
                    upload_date:''
            };
        }
        ,
        my_scope.printResult = function (text_id) {
            var l = document.getElementById(text_id).innerHTML
                , n = window.open("", "_blank");
            n.document.open(),
                n.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/print.css" /></head><body onload="window.print()">' + l + "</body></html>"),
                n.document.close()
        }
        ,
        my_scope.refresh = function (e) {
            e ? alert(e) : my_scope.$apply(function () {
                my_scope.accountAddress = bc_service.address,
                    my_scope.seed = bc_service.seed
            })
        }

    ;





}

angular.module("BlockChainDemo").controller("WalletController", ["$scope", "$window", "BlockChainService", WalletController]);


////// Directives *********************************************************************

function compareTo() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function (o, e, r, a) {
            a.$validators.compareTo = function (e) {
                return e == o.otherModelValue
            }
                ,
                o.$watch("otherModelValue", function () {
                    a.$validate()
                })
        }
    }
}



angular.module("BlockChainDemo").directive("compareTo", compareTo);
angular.module("BlockChainDemo").directive("errorPopup", function () {
    return {
        restrict: "EA",
        templateUrl: "/templates/error-popup.html",
        controller: "BlockchainController"
    }
});


angular.module("BlockChainDemo").directive("globalLoader", function () {
    return {
        restrict: "EA",
        templateUrl: "/templates/loading.html"
    }
});
angular.module("BlockChainDemo").factory("httpLoadingInterceptor", ["$q", "$rootScope", function (r, o) {
    var n = 0;
    return {
        request: function (t) {
            return n++,
                o.$broadcast("startGlobalLoading"),
            t || r.when(t)
        },
        response: function (t) {
            return 0 === --n && o.$broadcast("finishGlobalLoading"),
            t || r.when(t)
        },
        responseError: function (t) {
            return o.$broadcast("showErrorResponse", t),
                n--,
                r.when(t)
        }
    }
}
]).config(["$httpProvider", function (r) {
    r.interceptors.push("httpLoadingInterceptor")
}
]);

