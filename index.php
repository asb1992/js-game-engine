<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>

	<head>
		
		<title>Levels</title>
		
		<link rel="shortcut icon" href="favicon.ico" />
		<link rel="stylesheet" type="text/css" href="../home.css" />
		
		<script type="text/javascript" src="charMap.js"></script>
		
		<style type="text/css">
			
			body
			{
			text-align:center;
			}
			
			canvas
			{
			display:block;
			margin-left:auto;
			margin-right:auto;
			}
			
		</style>
		
	</head>
	
	<body>
		
		<h1>Levels</h1>
			
			<?php
				
				// For each level directory...
				$dir = scandir('levels');
				foreach($dir as $dir_name) {
					
					if ($dir_name != "." and $dir_name != "..") {
						
						// Create a link to the level.
						echo "<a href='ball.php?" . $dir_name . "'>" .
							 $dir_name . "</a><br /><br />\n";
						
						// Create a JS variable containing the level map.
						$level_file = "../ball2canvas/levels/" . $dir_name . "/level.js";
						$level = file_get_contents($level_file);
						$level = str_replace("var worldData = ", "", $level);
						echo "<script type='text/javascript'>var " .
							 $dir_name . " = $level;</script>\n\n";
						
					}
					
				}
				
			?>
			
			<script type="text/javascript">
				
				var links = document.getElementsByTagName('a');
				var levels = [];
				
				for (var i = 0; i < links.length; i++) {
					
					levels.push(window[links[i].innerHTML]);
					
				}
				
				// Needed to determine canvas size.
				function findLevelDimensions(level) {
					
					var maxLevelWidth = 0;
					var levelRows = level.join().replace(/,/g, '').split('\n');
					var height = levelRows.length;
					
					for (var i = 0; i < levelRows.length; i++) {
						
						maxLevelWidth = (levelRows[i].length > maxLevelWidth
							           ? levelRows[i].length : maxLevelWidth)
						
					}
					
					return [maxLevelWidth, height];
					
				}
				
				// Creates a minimap and inserts it above the proper link.
				// Doesn't look in local charMap for colors. Needs to.
				function createMinimap(level, link) {
					
					var size = 5;
					var row = 0;
					var col = 0;
					var canvas = document.createElement('canvas');
					var levelDimensions = findLevelDimensions(level);
					canvas.height = levelDimensions[1] * size;
					canvas.width  = levelDimensions[0] * size;
					var ctx = canvas.getContext('2d');

					for (var i = 0; i < level.length; i++) {
						
						if (level[i] == " ") {
							
							row += size;
							
						}
						
						else if (level[i] == "\n"){
							
							row = 0;
							col += size;
							
						}
						
						else if (level[i] in charMap) {
							
							ctx.fillStyle = charMap[level[i]].color;
							
							if (charMap[level[i]].shape == "square" ||
							  !(charMap[level[i]].shape)) {
								
								ctx.fillRect(row, col, size, size);
								
							}
							
							else if (charMap[level[i]].shape == "circle") {
								
								ctx.beginPath();
								ctx.arc(row + size / 2, col + size / 2,
										size / 2, 0, Math.PI * 2, true);
								ctx.fill();
								ctx.closePath();
								
							}
							
							row += size;
							
						}
						
					}
					
					document.body.insertBefore(canvas, link);
					
				}
				
				for (var i = 0; i < levels.length; i++) {
					
					//createMinimap(levels[i], links[i]);
					
				}
				
			</script>
			
	</body>

</html>