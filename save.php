<?php
	
	if (!is_dir('levels/' . $_POST['filename'])) {
		
		mkdir('levels/' . $_POST['filename']);
		
	}
	file_put_contents('levels/' . $_POST['filename'] . '/level.js',
	'var worldData = ' . $_POST['worldData'] . ';');
	echo 'Save successful.';

?>