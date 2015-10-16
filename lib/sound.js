var instruments = ["drums", "voice", "bee_long", "woody", "8bit_stab", "bziaou", "syntklocka_stab", "bassdist"];
var notes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

function playNote(instrument, num) {
	
	var audioElement = document.createElement('audio');
	audioElement.setAttribute('src', "../lib/sounds/" + instrument + "/" + instrument + "_" + num + ".ogg");
	audioElement.play();
	
}