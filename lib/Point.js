function Point(x, y) {
	this.x = x;
	this.y = y;
	this.add = function(point) {
		return new Point(this.x + point.x, this.y + point.y);
	}
	this.subtract = function(point) {
		return new Point(this.x - point.x, this.y - point.y);
	}
	this.multiply = function(scalar) {
		return new Point(this.x * scalar, this.y * scalar);
	}
	this.abs = function() {
		return new Point(Math.abs(this.x), Math.abs(this.y));
	}
	this.ratio = function() {
		if (!this.x && !this.y) {return new Point(0, 0);}
		return new Point(this.x / Math.max(this.abs().x, this.abs().y), this.y / Math.max(this.abs().x, this.abs().y));
	}
	this.sum = function() {
		return this.x + this.y;
	}
	this.to_slope = function() {
		return this.y / this.x;
	}
	this.equals = function(point) {
		return this.x == point.x && this.y == point.y;
	}
	this.copy = function() {
		return new Point(this.x, this.y);
	}
}