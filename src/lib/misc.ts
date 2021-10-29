Array.prototype.move = function (oldIndex: number, newIndex: number) {
	if (newIndex >= this.length) {
		var k = newIndex - this.length + 1;
		while (k--) {
			this.push(undefined as any);
		}
	}
	this.splice(newIndex, 0, this.splice(oldIndex, 1)[0]);
	return this;
};

Array.prototype.shuffle = function () {
	let currentIndex = this.length,
		randomIndex;

	// While there remain elements to shuffle...
	while (currentIndex != 0) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[this[currentIndex], this[randomIndex]] = [this[randomIndex], this[currentIndex]];
	}

	return this;
};
