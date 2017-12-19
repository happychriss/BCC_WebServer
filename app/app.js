'use strict';

angular.module("BlockChainDemo", ["ui.bootstrap", "ngCookies", "ljungmann.fileMd5", "ngFileUpload"]).run(["$http", "$uibModal",  function(my_http, t, my_user_service) {

}
]);

////// Components *********************************************************************
// angular.module("BlockChainDemo").component("assetsUploadInfo", {controller: function() {},               templateUrl: "templates/assets-upload-info.html"});
angular.module("BlockChainDemo").component("assetsUpload", {    controller: "AssetsUploadController",    templateUrl: "templates/assets-upload.html"});
angular.module("BlockChainDemo").component("assetsVerify", {    controller: "AssetsVerifyController",    templateUrl: "templates/assets-verify.html"});
angular.module("BlockChainDemo").component("introComponent", {  controller: function() {},               templateUrl: "templates/intro.html"});
angular.module("BlockChainDemo").component("walletComponent", { controller: "WalletController",          templateUrl: "templates/wallet.html"});
    angular.module("BlockChainDemo").constant("HOST", "https://rinkeby.infura.io/NPDWCn9k71RH5knG9aPt").constant("HC_ADDRESS", "B943F922bD561A269283D73Ba3d5F5069dD6c9bd").constant("ABI", [{
    constant: !0,
    inputs: [{
        name: "",
        type: "address"
    }],
    name: "owners",
    outputs: [{
        name: "",
        type: "bytes32"
    }],
    payable: !1,
    type: "function"
}, {
    constant: !1,
    inputs: [{
        name: "_owner",
        type: "address"
    }],
    name: "setOwner",
    outputs: [],
    payable: !1,
    type: "function"
}, {
    constant: !0,
    inputs: [],
    name: "getAsset",
    outputs: [{
        name: "",
        type: "address"
    }, {
        name: "",
        type: "bytes32"
    }, {
        name: "",
        type: "bytes32"
    }, {
        name: "",
        type: "uint256"
    }],
    payable: !1,
    type: "function"
}, {
    constant: !1,
    inputs: [],
    name: "destroy",
    outputs: [],
    payable: !1,
    type: "function"
}, {
    constant: !0,
    inputs: [],
    name: "owner",
    outputs: [{
        name: "",
        type: "address"
    }],
    payable: !1,
    type: "function"
}, {
    constant: !0,
    inputs: [{
        name: "",
        type: "bytes32"
    }],
    name: "assets",
    outputs: [{
        name: "owner",
        type: "address"
    }, {
        name: "checksum",
        type: "bytes32"
    }, {
        name: "description",
        type: "bytes32"
    }, {
        name: "createDate",
        type: "uint256"
    }],
    payable: !1,
    type: "function"
}, {
    constant: !1,
    inputs: [],
    name: "deleteAsset",
    outputs: [{
        name: "",
        type: "uint256"
    }],
    payable: !1,
    type: "function"
}, {
    constant: !0,
    inputs: [{
        name: "owner",
        type: "address"
    }],
    name: "getAssetFor",
    outputs: [{
        name: "",
        type: "address"
    }, {
        name: "",
        type: "bytes32"
    }, {
        name: "",
        type: "bytes32"
    }, {
        name: "",
        type: "uint256"
    }],
    payable: !1,
    type: "function"
}, {
    constant: !1,
    inputs: [{
        name: "_checksum",
        type: "bytes32"
    }, {
        name: "_description",
        type: "bytes32"
    }, {
        name: "_createDate",
        type: "uint256"
    }],
    name: "createAsset",
    outputs: [{
        name: "",
        type: "uint256"
    }],
    payable: !1,
    type: "function"
}, {
    payable: !1,
    type: "fallback"
}, {
    anonymous: !1,
    inputs: [{
        indexed: !0,
        name: "owner",
        type: "address"
    }, {
        indexed: !0,
        name: "_checksum",
        type: "bytes32"
    }, {
        indexed: !1,
        name: "_createDate",
        type: "uint256"
    }],
    name: "AssetCreated",
    type: "event"
}, {
    anonymous: !1,
    inputs: [{
        indexed: !0,
        name: "sender",
        type: "address"
    }, {
        indexed: !1,
        name: "errorCode",
        type: "uint256"
    }],
    name: "Error",
    type: "event"
}]);

////// Controllers and function  *********************************************************************

function assetsUpload(scope, $timeout, my_http, o, my_log, blockchainService, md5service, my_api_bc_ignore) {
    var my_scope = scope;

    const STEP_1_SENT_MONEY=1;
    const STEP_2_POLL_MONEY=2;
    const STEP_3_POLL_CONTRACT=3;
    const STEP_4_CONTRACT_DONE=4;
    const ERROR=6;

    var loadTime = 3000, //Load the data every second
        errorCount = 0, //Counter for the server errors
        loadPromise, //Pointer to the promise created by the Angular $timout service
        status = 0,
        contract_tx,
        poll_transaction,
        timer_counter,


     SentAndPollData = function(status_in,tx) {
         status = status_in;
         contract_tx = tx;
         PollData();
         my_scope.timer_count=0;
         my_scope.status=status;
     },

     PollData=function () {
        var my_api_bc=BC_FUELSERVER_URL;

         my_log.log("SendAndPollData with status:"+status); my_scope.timer_count=my_scope.timer_count+3;

         switch (status) {
             case STEP_1_SENT_MONEY:
                 my_scope.status_text="Step-1: We put some ether to your contract, so he can work!";
                 my_http.post(my_api_bc + "1", contract_tx, null).success(function (req, res) {
                     my_log.log("success : " + req + ":" + res);
                     status = STEP_2_POLL_MONEY;

                     errorCount = 0;
                     poll_transaction=req;
                     nextLoad();
                 }).error(function (req, res) {
                     my_log.log("error : " + req + ":" + res);
                     status = ERROR;
                 })
                 break;

             case STEP_2_POLL_MONEY:
                 my_scope.status_text="Step-2: We need to wait some seconds (up to 30) until the money is confirmed to be sent.";

                 var tresult= blockchainService.checkTransaction(poll_transaction);

                 if (tresult === null) {
                     nextLoad();
                 } else {
                     my_log.log("Mining Done - send Asset");
                     my_scope.timer_count=0;
                     my_scope.status_text="Step-3: Money is at your contract, you can check by clicking tx-1. Now sending your hash!!";

                     my_http.post(my_api_bc + "2", contract_tx, null).success(function (req, res) {
                         my_log.log("Contract Created, results : " + req + ":" + res);
                         status = STEP_3_POLL_CONTRACT;
                         poll_transaction=req;
                         nextLoad();
                     }).error(function (req, res) {
                         my_log.log("Contract creation, error : " + req + ":" + res);
                         status = ERROR;
                     })
                 }

                 break;

             case STEP_3_POLL_CONTRACT:

                 my_scope.status_text="Step-3: We need to wait some seconds (up to 30) until your transaction is confirmed.";

                 tresult= blockchainService.checkTransaction(poll_transaction);

                 if (tresult === null) {
                     nextLoad();
                 } else {
                    my_log.log("Polling Done");
                    status = STEP_4_CONTRACT_DONE;
                 }
                 errorCount = 0; nextLoad();
                 break;

             case STEP_4_CONTRACT_DONE:

                 my_scope.status_text="Step-4: DONE - Your hash in on the Blockchain. Never to be deleted.";
                 my_log.log("MISSION Completed");
                 my_scope.status_completed=true;
                 cancelNextLoad();
                 break;

             case ERROR:
                 my_log.log("ERROR");
                 cancelNextLoad();
                 break;

         }
         my_scope.status=status;
    },

    cancelNextLoad = function() {
        $timeout.cancel(loadPromise);
    },

    nextLoad = function(mill,new_status) {

        mill = mill || loadTime;
        status = status || new_status;
        timer_counter++;

        //Always make sure the last timeout is cleared before starting a new one
        cancelNextLoad();
        loadPromise = $timeout(PollData, mill);
    };

    //***********************************************************************

    my_scope.uploadPic = function(e) {
            md5service.md5(e).progress(function(uploaded_file) {
                my_log.log("Hashed " + uploaded_file.loaded + " B out of " + uploaded_file.total + " B")
            }).error(function(e) {
                my_log.log("Error calculating md5: %o", e)
            }).success(function(s) {
                my_log.log("MD5 for " + e.name + " is " + s),
                    my_scope.sendHash(s)
            })
    },

    my_scope.sendHash = function(my_hash) {
        my_scope.asset = {
            hash: my_hash,
            owner: blockchainService.address,
            date: new Date,
            message: my_scope.additionalMessage
        },
            blockchainService.buildRegisterAssetTx("0x" + my_scope.asset.owner.toLowerCase(), my_scope.asset.hash, my_scope.asset.date.getTime(), my_scope.asset.message, function(e, raw_transaction) {
                if (e)
                    my_log.log("Failed to send transaction: " + e);
                else {
                    var t = {
                        tx: raw_transaction,
                        token: localStorage.getItem("token")
                    };
                    SentAndPollData(STEP_1_SENT_MONEY,t);
                }
            })
    }
    ,
    my_scope.hasOwner = function() {
        return blockchainService.address && blockchainService.seed
    }
}
angular.module("BlockChainDemo").controller("AssetsUploadController", ["$scope","$timeout", "$http", "$window", "$log", "BlockChainService", "fileMd5Service",  assetsUpload]);


function assetsVerifyController(scope, win, console, bc_service, md5_service) {
    var my_scope = scope;

    // commma means a list of declaration, I am declaring functions here. executed during initialization
    my_scope.owner = null,
    my_scope.asset = bc_service.assetVerifier,
    

    my_scope.verify = function(e) {
            md5_service.md5(e).progress(function(e) {
                console.log("Hashed " + e.loaded + " B out of " + e.total + " B")
            }).error(function(e) {
                console.log("Error calculating md5: %o", e)
            }).success(function(s) {
                console.log("MD5 for " + e.name + " is " + s),
                    my_scope.asset.filehash = s;
                var contract_address = my_scope.asset.address; //smart contract address
                bc_service.verifyOwner(function(file_handle, asset) {
                    file_handle ? (my_scope.noresult(),
                        console.log("Failed to verity owner: " + file_handle)) : (my_scope.asset = asset,
                        my_scope.asset.filehash = s,
                        my_scope.asset.address = contract_address,
                        my_scope.accountAddress = bc_service.address,
                        my_scope.$apply())
                })
            })
    }
}
angular.module("BlockChainDemo").controller("AssetsVerifyController", ["$scope", "$window", "$log", "BlockChainService", "fileMd5Service", assetsVerifyController]);


function BlockchainController(o, r, e) {
    function a() {
        t.addClass("error-popup-show"),
            e(function() {
                t.removeClass("error-popup-show")
            }, 3e3)
    }
    var n = r
        , s = o.find("global-loader")
        , t = o.find("error-popup");
    n.$on("startGlobalLoading", function() {
        s.addClass("ion-show")
    }),
        n.$on("finishGlobalLoading", function() {
            s.removeClass("ion-show")
        }),
        n.$on("showErrorResponse", function(o, r) {
            n.error = r,
                s.removeClass("ion-show"),
                n.$watch(function() {
                    return n.error
                }, function(o) {
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
    my_scope.enter = function(e) {
        var email = e.email.$viewValue;
        form.enter(email, function() {
            my_scope.$close()
        })
    }
}
angular.module("BlockChainDemo").controller("EnterController", ["$scope", "UserService", EnterController]);


function WalletController(scope, window, bc_service) {
    var my_scope = scope;

    my_scope.deleteWallet= function () {
        var isConfirmed = confirm("Are you sure to delete your wallet ?");
        if(isConfirmed){
            bc_service.deleteWallet(function(e){
                my_scope.refresh(e);
        })}
    },

    my_scope.checkWallet = function () {
      return localStorage.getItem("my_wallet")!==null;
         
    },

    my_scope.restoreWalletFromLocalStorage = function() {
        bc_service.restoreWalletFromLocalStorage(function(e) {
            my_scope.refresh(e);
        });
    },

    my_scope.createWallet = function(form) {
        var mypwd = form.password.$viewValue;
        bc_service.createWallet(mypwd, function(e) {
            my_scope.refresh(e);
        });
    }
        ,
    my_scope.restoreWallet = function() {
        bc_service.restoreWallet(function(e) {
            my_scope.refresh(e)
        })
    }
    ,
    my_scope.deleteWallet = function() {
        bc_service.deleteWallet(function(e) {
        })
        my_scope.accountAddress=null;
        my_scope.seed=null;
    }
    ,
    my_scope.printResult = function(text_id) {
        var l = document.getElementById(text_id).innerHTML
            , n = window.open("", "_blank");
        n.document.open(),
        n.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/print.css" /></head><body onload="window.print()">' + l + "</body></html>"),
        n.document.close()
    }
    ,
    my_scope.refresh = function(e) {
        e ? alert(e) : my_scope.$apply(function() {
            my_scope.accountAddress = bc_service.address,
            my_scope.seed = bc_service.seed
        })
    }
}
angular.module("BlockChainDemo").controller("WalletController", ["$scope", "$window", "BlockChainService", WalletController]);



////// Directives *********************************************************************

function compareTo() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(o, e, r, a) {
            a.$validators.compareTo = function(e) {
                return e == o.otherModelValue
            }
                ,
                o.$watch("otherModelValue", function() {
                    a.$validate()
                })
        }
    }
}
angular.module("BlockChainDemo").directive("compareTo", compareTo);
angular.module("BlockChainDemo").directive("errorPopup", function() {
    return {
        restrict: "EA",
        templateUrl: "/templates/error-popup.html",
        controller: "BlockchainController"
    }
});
angular.module("BlockChainDemo").directive("globalLoader", function() {
    return {
        restrict: "EA",
        templateUrl: "/templates/loading.html"
    }
});
angular.module("BlockChainDemo").factory("httpLoadingInterceptor", ["$q", "$rootScope", function(r, o) {
    var n = 0;
    return {
        request: function(t) {
            return n++,
                o.$broadcast("startGlobalLoading"),
            t || r.when(t)
        },
        response: function(t) {
            return 0 === --n && o.$broadcast("finishGlobalLoading"),
            t || r.when(t)
        },
        responseError: function(t) {
            return o.$broadcast("showErrorResponse", t),
                n--,
                r.when(t)
        }
    }
}
]).config(["$httpProvider", function(r) {
    r.interceptors.push("httpLoadingInterceptor")
}
]);

