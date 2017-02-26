// Encoding documentation:
// https://nl.wikipedia.org/wiki/KIX-code

import Barcode from "../Barcode.js";

class KIX extends Barcode {
	constructor(data, options){
		data = data.toUpperCase();

		super(data, options);
	}

	encode(){
		var result = "";

		// Take every character and add the binary representation to the result
		for(let i = 0; i < this.data.length; i++){
			result += getEncoding(this.data[i]);
		}

		return {
			data: result,
			text: this.text
		};
	}

	valid(){
		return this.data.search(/^[0-9A-Z]+$/) !== -1;
	}
}






// All characters. The position in the array is the (checksum) value
var characters = [
	"0", "1", "2", "3",
	"4", "5", "6", "7",
	"8", "9", "A", "B",
	"C", "D", "E", "F",
	"G", "H", "I", "J",
	"K", "L", "M", "N",
	"O", "P", "Q", "R",
	"S", "T", "U", "V",
	"W", "X", "Y", "Z"
];

// The decimal representation of the characters, is converted to the
// corresponding binary with the getEncoding function
var encodings = [
	"00001111", "00011011", "00011110", "01001011",
	"01001110", "01011010", "00100111", "00110011",
	"00110110", "01100011", "01100110", "01110010",
	"00101101", "00111001", "00111100", "01101001",
	"01101100", "01111000", "10000111", "10010011",
	"10010110", "11000011", "11000110", "11010010",
	"10001101", "10011001", "10011100", "11001001",
	"11001100", "11011000", "10100101", "10110001",
	"10110100", "11100001", "11100100", "11110000"
];

// Get the binary representation of a character by converting the encodings
// from decimal to binary
function getEncoding(character){
	return encodings[characterValue(character)];
}

function characterValue(character){
	return characters.indexOf(character);
}

export {KIX};
