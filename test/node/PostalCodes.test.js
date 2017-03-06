const assert = require('assert');
const JsBarcode = require('../../bin/JsBarcode.js');

describe('Postal Codes', function () {
    describe('base3', function () {
        it('should be able to include the encoder(s)', function () {
            base3 = JsBarcode.getModule("base3");
        });

        it('should be able to encode normal text', function () {
            const enc = new base3("AB12", {height: 100});
            const expectedResult = [
                {"start": 0.37, "end": 1},
                0,
                {"start": 0, "end": 0.63},
                0,
                {"start": 0.37, "end": 1},
                0,
                {"start": 0, "end": 0.63},
                0,
                {"start": 0.37, "end": 1},
                0,
                {"start": 0, "end": 1},
                0,
                {"start": 0.37, "end": 0.63},
                0,
                {"start": 0, "end": 0.63},
                0,
                {"start": 0.37, "end": 0.63},
                0,
                {"start": 0.37, "end": 1},
                0,
                {"start": 0, "end": 0.63},
                0,
                {"start": 0, "end": 1},
                0,
                {"start": 0.37, "end": 0.63},
                0,
                {"start": 0.37, "end": 1},
                0,
                {"start": 0, "end": 1},
                0,
                {"start": 0, "end": 0.63}
            ];
            assert.deepEqual(expectedResult, enc.encode().data);
        });

        it('should accept valid combinations of characters', function () {
            let enc = new base3("1", {});
            assert.equal(true, enc.valid());

            enc = new base3("A", {});
            assert.equal(true, enc.valid());

            enc = new base3("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", {});
            assert.equal(true, enc.valid());

            // Support RM4SCC start/stop chars in base3
            enc = new base3("(ABC)", {});
            assert.equal(true, enc.valid());

            enc = new base3("[ABC]", {});
            assert.equal(true, enc.valid());

            // Allow different beginning and end, since same result
            enc = new base3("[ABC)", {});
            assert.equal(true, enc.valid());

            enc = new base3("AB(C)", {});
            assert.equal(false, enc.valid());
        });

        it('should warn with invalid text', function () {
            const enc = new base3("AB!12", {});
            assert.equal(false, enc.valid());
        });

        it('should make lowercase to uppercase', function () {
            const enc = new base3("abc123ABC", {});
            assert.equal("ABC123ABC", enc.encode().text);
        });

        it('should work with text option', function () {
            const enc = new base3("AB12", {text: "THISISTEXT"});
            assert.equal("THISISTEXT", enc.encode().text);
        });
    });

    describe('KIX', function () {
        it('should be able to include the encoder(s)', function () {
            KIX = JsBarcode.getModule("KIX");
        });

        it('should accept correct Dutch postal codes', function () {
            let enc = new KIX("1234", {});
            assert.equal(false, enc.valid());

            enc = new KIX("1234AB", {});
            assert.equal(false, enc.valid());

            // Accept postal code with house number
            enc = new KIX("1234AB1", {});
            assert.equal(true, enc.valid());

            // Accept postal code with house number (max chars)
            enc = new KIX("1234AB10000", {});
            assert.equal(true, enc.valid());

            enc = new KIX("1234AB100000", {});
            assert.equal(false, enc.valid());

            enc = new KIX("1234AB10000X", {});
            assert.equal(false, enc.valid());

            // Accept postal code with house number and extension
            enc = new KIX("1234AB10000XA", {});
            assert.equal(true, enc.valid());

            // Accept postal code with house number and extension (lower case)
            enc = new KIX("1234ab10000Xa", {});
            assert.equal(true, enc.valid());

            // Accept postal code with house number and extension (max chars)
            enc = new KIX("1234AB10000XA12345", {});
            assert.equal(true, enc.valid());

            enc = new KIX("1234AB10000XA123456", {});
            assert.equal(false, enc.valid());
        });

        it('should warn with invalid text', function () {
            const enc = new KIX("1234AB1!", {});
            assert.equal(false, enc.valid());
        });

        it('should make lowercase to uppercase', function () {
            const enc = new KIX("1234ab1Xa", {});
            assert.equal("1234AB1XA", enc.encode().text);
        });
    });
});

