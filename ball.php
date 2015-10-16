<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>

	<!-- To do:
		
		make minimaps work again,
		redirect IE users to Chrome Frame or another browser,
		
	-->

	<head>
		
		<!-- The Chrome Frame tag. -->
		<meta http-equiv="X-UA-Compatible" content="chrome=1">
		
		<title>Ball Improved</title>

		<script type="text/javascript" src="js/protoclass.js"></script>
		<script type="text/javascript" src="js/box2d.js"></script>
		<script type="text/javascript" src="js/main.js"></script>
		<script type="text/javascript" src="particle/particle.js"></script>
		<script type="text/javascript" src="lib/general.js"></script>
		<script type="text/javascript" src="lib/functional.js"></script>
		
		<style type="text/css">
		
		body
		{
		overflow-x:hidden;
		overflow-y:hidden;
		margin:0px;
		padding:0px;
		}
		
		div
		{
		display:inline-block;
		}
		
		#hud
		{
		z-index:100;
		position:fixed;
		color:lime;
		font-family:"Lucida Console", monospace;
		font-size:30px;
		}
		
		#ammopic
		{
		width:40px;
		height:40px;
		vertical-align:middle;
		}
		
		#key
		{
		position:relative;
		float:right;
		}
		
		#keypic
		{
		width:40px;
		height:40px;
		vertical-align:middle;
		}
		
		</style>
		
	</head>

	<body>
		
		<div id="hud">
			
			<div id="ammo">
				
				<div id="ammopic"></div>
				<div id="ammocount"></div>
				
			</div>
			
			<div id="key">
				
				<div id="keycount"></div>
				<div id="keypic"></div>
				
			</div>
			
		</div>
		
		<canvas id="canvas" style="background-color:black;"></canvas>
		
		<script type="text/javascript">
			
			var canvas = $("canvas");
			
			// Presentational
			
			canvas.width = document.documentElement.clientWidth;
			canvas.height = document.documentElement.clientHeight;
			
			$("hud").style.width = document.documentElement.clientWidth + "px";
			
			// End Presentational
			
			<?php
				
				// Read level options.
				$options_file = "levels/" . $_SERVER["QUERY_STRING"] . "/options.txt";
				if (file_exists($options_file)) {$options = file_get_contents($options_file);}
				else {$options = "{}";}
				echo "options = $options;\n\n";
				
				// Get level file.
				$level_file = "levels/" . $_SERVER["QUERY_STRING"] . "/level.js";
				$level = file_get_contents($level_file);
				echo "$level\n\n";
				
				// Check for a local charMap.
				if (file_exists("../ball2canvas/levels/" . $_SERVER["QUERY_STRING"] . "/charMap.js")) {
					
					echo "var localMap = true;\n\n";
					
				}
				
				else {
					
					echo "var localMap = false;\n\n";
					
				}
				
				// Get level name.
				echo "var levelName = '" . $_SERVER["QUERY_STRING"] . "';\n\n";
				
			?>
			
			if (!(localMap)) {loadScript("charMap.js", init_world);}
			else {loadScript("../ball2canvas/levels/" + levelName + "/charMap.js", init_world)};
			
		</script>

	</body>

</html>