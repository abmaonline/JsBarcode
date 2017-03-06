// Encoding documentation:
// https://nl.wikipedia.org/wiki/KIX-code

import base3 from './base3.js';

class KIX extends base3{
	valid(){
		return this.data.search(/^[0-9]{4}[A-Z]{2}[0-9]{1,5}(X[0-9A-Z]{1,6})?$/) !== -1;
	}
}

export default KIX;
