"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _merge = require("../help/merge.js");

var _merge2 = _interopRequireDefault(_merge);

var _shared = require("./shared.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CanvasRenderer = function () {
	function CanvasRenderer(canvas, encodings, options) {
		_classCallCheck(this, CanvasRenderer);

		this.canvas = canvas;
		this.encodings = encodings;
		this.options = options;
	}

	CanvasRenderer.prototype.render = function render() {
		// Abort if the browser does not support HTML5 canvas
		if (!this.canvas.getContext) {
			throw new Error('The browser does not support canvas.');
		}

		this.prepareCanvas();
		for (var i = 0; i < this.encodings.length; i++) {
			var encodingOptions = (0, _merge2.default)(this.options, this.encodings[i].options);

			this.drawCanvasBarcode(encodingOptions, this.encodings[i]);
			this.drawCanvasText(encodingOptions, this.encodings[i]);

			this.moveCanvasDrawing(this.encodings[i]);
		}

		this.restoreCanvas();
	};

	CanvasRenderer.prototype.prepareCanvas = function prepareCanvas() {
		// Get the canvas context
		var ctx = this.canvas.getContext("2d");

		ctx.save();

		(0, _shared.calculateEncodingAttributes)(this.encodings, this.options, ctx);
		var totalWidth = (0, _shared.getTotalWidthOfEncodings)(this.encodings);
		var maxHeight = (0, _shared.getMaximumHeightOfEncodings)(this.encodings);

		this.canvas.width = totalWidth + this.options.marginLeft + this.options.marginRight;

		this.canvas.height = maxHeight;

		// Paint the canvas
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		if (this.options.background) {
			ctx.fillStyle = this.options.background;
			ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		}

		ctx.translate(this.options.marginLeft, 0);
	};

	CanvasRenderer.prototype.drawCanvasBarcode = function drawCanvasBarcode(options, encoding) {
		// Get the canvas context
		var ctx = this.canvas.getContext("2d");

		var binary = encoding.data;

		// Creates the barcode out of the encoded binary
		var yFrom;
		if (options.textPosition == "top") {
			yFrom = options.marginTop + options.fontSize + options.textMargin;
		} else {
			yFrom = options.marginTop;
		}

		ctx.fillStyle = options.lineColor;

		if (options.format !== "KIX") {
			for (var b = 0; b < binary.length; b++) {
				var x = b * options.width + encoding.barcodePadding;

				if (binary[b] === "1") {
					ctx.fillRect(x, yFrom, options.width, options.height);
				} else if (binary[b]) {
					ctx.fillRect(x, yFrom, options.width, options.height * binary[b]);
				}
			}
		} else {
			var barRel = 1.9;
			var syncRel = 1.3;
			var full = 2 * barRel + syncRel;

			var ratio = options.height / full;
			var barAbs = Math.round(barRel * ratio);
			var syncAbs = Math.round(syncRel * ratio);

			for (var b = 0; b < binary.length; b += 2) {
				// Don't divide by 2, since we need spacing in between bars
				x = b * options.width + encoding.barcodePadding;
				var barWidth = 1;
				var height = syncAbs;
				var y = yFrom;

				// Check upper bit
				if (binary[b] === "1") {
					height += barAbs;
				} else {
					y += barAbs;
				}

				// Check lower bit
				if (binary[b + 1] === "1") {
					height += barAbs;
				}

				ctx.fillRect(x - options.width * barWidth, y, options.width * barWidth, height);
			}
		}
	};

	CanvasRenderer.prototype.drawCanvasText = function drawCanvasText(options, encoding) {
		// Get the canvas context
		var ctx = this.canvas.getContext("2d");

		var font = options.fontOptions + " " + options.fontSize + "px " + options.font;

		// Draw the text if displayValue is set
		if (options.displayValue) {
			var x, y;

			if (options.textPosition == "top") {
				y = options.marginTop + options.fontSize - options.textMargin;
			} else {
				y = options.height + options.textMargin + options.marginTop + options.fontSize;
			}

			ctx.font = font;

			// Draw the text in the correct X depending on the textAlign option
			if (options.textAlign == "left" || encoding.barcodePadding > 0) {
				x = 0;
				ctx.textAlign = 'left';
			} else if (options.textAlign == "right") {
				x = encoding.width - 1;
				ctx.textAlign = 'right';
			}
			// In all other cases, center the text
			else {
					x = encoding.width / 2;
					ctx.textAlign = 'center';
				}

			ctx.fillText(encoding.text, x, y);
		}
	};

	CanvasRenderer.prototype.moveCanvasDrawing = function moveCanvasDrawing(encoding) {
		var ctx = this.canvas.getContext("2d");

		ctx.translate(encoding.width, 0);
	};

	CanvasRenderer.prototype.restoreCanvas = function restoreCanvas() {
		// Get the canvas context
		var ctx = this.canvas.getContext("2d");

		ctx.restore();
	};

	return CanvasRenderer;
}();

exports.default = CanvasRenderer;