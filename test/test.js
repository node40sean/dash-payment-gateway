var bitcore = require('bitcore-lib-dash');
var should = require('chai').should();
var HDWallet = require('../lib/HDWallet');
var network = bitcore.Networks.mainnet;

// test vectors
var vector1_m0_0_public = 'Xix1vKJ1ZNETUpv3PqoF28C534zybQ4Fdd',
    vector1_m0_1_public = 'Xd5BoAkmf7eGwbEXFqtJQP1BnZ8mwGiBfn',
    vector1_m0_2_public = 'XbZLT9KueMubC8o2YMtreWAXYMgEm6r3VK',
    vector1_m0_3_public = 'XkTREwfhxxPavMCn3pcEDXfqJSGnaj4ZJW',
    vector1_m0_4_public = 'XfFCKysPdNSgXn9hg5rgC7yfT8nqxEsJoX',
    vector1_m_public = 'xpub661MyMwAqRbcEorCw5Bqik47NhE4RCgCgxqvM3DqfpUvVo7dEk7HL5BmqLJCT4EvBUK2pTewJjpd4Z64nXDTaqQuAhuYH4PFdTenCkHzuQa',
    vector1_m_public_imported = 'drkvjJe5sJgqomjLmy9nzfXS6CG4bUZ5U84jAhfXW3kcERJDd8uMkqieiPnZkWApue8XKmTdsg15Xyh7CQfcAs3PeHXR44AdBeFSHF2gjViFqVR';
var vector2_m0_0_public = 'XhM44X96iMeXkLMs63seaaGz4jnChsrq4C',
    vector2_m0_1_public = 'XqLx3m68ShywBbZH94fdPjAMpGdqYc4y3G',
    vector2_m0_2_public = 'XtEGrb6vz5tkKtTX4ZxvjXS52RW2nAWdaq',
    vector2_m0_3_public = 'XuR3EHMQ4edXbdftaRJWYKKadydxFhYfjb',
    vector2_m0_4_public = 'XjJmyrynmxgCZ41GDgkrXSWSBPpecFSdYu',
    vector2_m_private = 'drkpRsmwKURS9g8uDwS7QBVL6a2scyyHE9Hubm26c3CgPFB2WAMsAnN3V3DCNrxgSSTkoTYDxYhx9KGZ2SpcjShJqHqiJidFs8LPnsxqjJLDRia',
    vector2_m_public = 'drkvjJe5sJgqomjLo9QN1bF9pVRaNjtpWRpLmJk3wq2vGQsCkT3ErLcwKcQ8gqUrQm61yCSEHdcwxFEPXnCLjzsAynVbcoifSJJeo5bSCQjibsV';

describe('HD Wallet', function () {

    describe('Electrum-DASH pubkey import and user address derivation', function () {

        it('Import an Electrum-DASH master public key', function () {
            HDWallet.ImportElectrumPubKey(vector1_m_public, network).xpubkey.should.equal(vector1_m_public_imported)
        });
        it('Derive User #1 Address (m/0/0)', function () {
            HDWallet.GetAddress(vector1_m_public_imported, 0).toString().should.equal(vector1_m0_0_public);
        });
        it('Derive User #2 Address (m/0/1)', function () {
            HDWallet.GetAddress(vector1_m_public_imported, 1).toString().should.equal(vector1_m0_1_public);
        });
        it('Derive User #3 Address (m/0/2)', function () {
            HDWallet.GetAddress(vector1_m_public_imported, 2).toString().should.equal(vector1_m0_2_public);
        });
        it('Derive User #4 Address (m/0/3)', function () {
            HDWallet.GetAddress(vector1_m_public_imported, 3).toString().should.equal(vector1_m0_3_public);
        });
        it('Derive User #5 Address (m/0/4)', function () {
            HDWallet.GetAddress(vector1_m_public_imported, 4).toString().should.equal(vector1_m0_4_public);
        });
    });

    describe('Dash BIP32 pubkey import and user address derivation', function () {
        var m = new bitcore.HDPrivateKey(vector2_m_private).hdPublicKey.xpubkey;
        it('Generate a BIP32 master public key', function () {
            m.should.equal(vector2_m_public);
        });
        it('Derive User #1 Address (m/0/0)', function () {
            HDWallet.GetAddress(m, 0).toString().should.equal(vector2_m0_0_public);
        });
        it('Derive User #2 Address (m/0/1)', function () {
            HDWallet.GetAddress(m, 1).toString().should.equal(vector2_m0_1_public);
        });
        it('Derive User #3 Address (m/0/2)', function () {
            HDWallet.GetAddress(m, 2).toString().should.equal(vector2_m0_2_public);
        });
        it('Derive User #4 Address (m/0/3)', function () {
            HDWallet.GetAddress(m, 3).toString().should.equal(vector2_m0_3_public);
        });
        it('Derive User #5 Address (m/0/4)', function () {
            HDWallet.GetAddress(m, 4).toString().should.equal(vector2_m0_4_public);
        });
    });
});
