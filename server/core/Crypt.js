const crypto = require("crypto");
const eccrypto = require("eccrypto");
const bs58 = require('bs58')

module.exports = {
  getKeys: () => {
    var private = crypto.randomBytes(32);
    var public = eccrypto.getPublic(private);

    return {
      private: bs58.encode(private),
      public: bs58.encode(public)
    }
  },
  encrypt: () => {
    var private = crypto.randomBytes(32)
    var public = eccrypto.getPublic(private)
    var str = "me";
    var msg = new Buffer(str, "binary")//crypto.createHash("sha256").update(str).digest();//
    console.log({
      str: str,
      msg: msg
    })
    eccrypto.sign(private, msg).then(function(sig) {
      console.log("Signature in DER format:", sig);

      eccrypto.verify(public, msg, sig).then(function(sig2) {
        console.log("Signature is OK", sig2);
      })
      .catch(function() {
        console.log("Signature is BAD");
      });
      // eccrypto.verify(private, msg, sig)//+'f'
      // .then(function() {
      //   console.log("Signature is OK");
      // })
    });
  }
  // var crypto = require("crypto");
  // var eccrypto = require("eccrypto");

  // var privateKey = crypto.randomBytes(32);
  // var publicKey = eccrypto.getPublic(privateKey);

  // const bs58 = require('bs58')

  // const keys = {
  //   privateKey: bs58.encode(privateKey),
  //   publicKey: bs58.encode(publicKey)
  // }

  // console.log(keys)

  // privateKey = bs58.decode(keys.privateKey)
  // publicKey = bs58.decode(keys.publicKey)

  // var str = "message to sign";
  // var msg = crypto.createHash("sha256").update(str).digest();
  
  // eccrypto.sign(privateKey, msg).then(function(sig) {
  //   console.log("Signature in DER format:", sig);
  //   eccrypto.verify(publicKey, msg+'f', sig)
  //   .then(function() {
  //     console.log("Signature is OK");
  //   })
  //   .catch(function() {
  //     console.log("Signature is BAD");
  //   });
  // });
}