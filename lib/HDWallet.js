'use strict';

var bitcore = require('bitcore-lib-dash');

module.exports = {

    /**
     * Convert an Electrum-DASH Master Public Key to
     * a compatible HDPublicKey.
     *
     * This is needed due to different xpubkey versions used
     * in Electrum version = 'xpub'.
     *
     * @arg
     * @network
     */
    ImportElectrumPubKey: function (arg, network) {

        // deserialize
        var decoded = bitcore.encoding.Base58Check.decode(arg);

        // rebuild buffers
        var buffers = {
            //replace the version buffer
            version: bitcore.util.buffer.integerAsBuffer(
                network ? network.xpubkey : bitcore.Networks.mainnet.xpubkey
            ),
            depth: decoded.slice(bitcore.HDPublicKey.DepthStart, bitcore.HDPublicKey.DepthEnd),
            parentFingerPrint: decoded.slice(bitcore.HDPublicKey.ParentFingerPrintStart,
                bitcore.HDPublicKey.ParentFingerPrintEnd),
            childIndex: decoded.slice(bitcore.HDPublicKey.ChildIndexStart, bitcore.HDPublicKey.ChildIndexEnd),
            chainCode: decoded.slice(bitcore.HDPublicKey.ChainCodeStart, bitcore.HDPublicKey.ChainCodeEnd),
            publicKey: decoded.slice(bitcore.HDPublicKey.PublicKeyStart, bitcore.HDPublicKey.PublicKeyEnd),
            checksum: decoded.slice(bitcore.HDPublicKey.ChecksumStart, bitcore.HDPublicKey.ChecksumEnd),
            xpubkey: arg
        };
        return new bitcore.HDPublicKey(buffers);
    },

    /**
     * Get an address by deriving the index m/0/i from
     * the supplied master public key
     *
     * @masterPubkey
     * @index
     */
    GetAddress: function (masterPubkey, index) {
        var masterPubKey = new bitcore.HDPublicKey(masterPubkey);
        var userPubKey = masterPubKey.derive(0).derive(index).publicKey;
        return new bitcore.Address(userPubKey);
    },

    /**
     * Helper for analyzing Bitcore key/address objects
     *
     * @key
     * @label
     * @verbose
     */
    debugKey: function (key, label, verbose) {
        if (label) {
            console.log(label + '\n');
        }
        if (!key) {
            console.log('No key provided');
        } else if (key.privateKey) {
            console.log('  Private Key: ' + key.privateKey);
            if (verbose) {
                console.log('  XPrivate Key: ' + key.xprivkey);
            }
        } else if (key.publicKey) {
            console.log('  Public Key: ' + key.publicKey);
            if (verbose) {
                console.log('  XPublic Key: ' + key.xpubkey);
                console.log('  Address: ' + new bitcore.Address(key.publicKey));
            }
        } else {
            if (bitcore.HDPublicKey.isValidSerialized(key, network)) {
                console.log('  Serialized XPublic Key: ' + key);
            } else if (bitcore.Address.isValid(key)) {
                console.log('Address: ' + key);
            } else {
                console.log('Invalid key');
            }
        }
        if (verbose) {
            console.log('  childIndex: ' + key.childIndex);
            console.log('  depth: ' + key.depth + '\n');
        }
    }
};