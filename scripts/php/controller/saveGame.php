<?php
	require_once '../modele/hackenbushGame.php';

	HackenBush::getInstance()->saveGame($_POST['name'], $_POST['data'], $_POST['imageData']);
?>