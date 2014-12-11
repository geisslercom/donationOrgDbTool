<?php session_start();
	
	
/*===================================================
=            Abhänfigkeiten & Prüfungen             =
===================================================*/
	

	if (!class_exists("db_handler")) {
		include 'class_db.php';
	}
	
/*-----  End of Abhänigkeiten  ------*/
	
	
	//Baut die Datenbank-Verbindung auf
	$dbh = new db_handler();


	if (isset($_GET['func'])){
		// $isMethode = method_exists($dbh,$_GET['func']);

		// call_user_method_array($_GET['func'],$dbh,function(){
		// 												$gets=$_GET;
		// 												unset($gets["func"]);
		// 												return $gets;});

		switch ($_GET['func']) {
			case 'search':
				$dbh 	->searchInTable 			($_GET['table']		,$_GET['param']);
				break;
			case 'autocomplete':
				$dbh 	->autocomplete			 	($_GET['column']	,$_GET['tablename'], $_GET['term']);
				break;
			case 'baseSelection':
				$dbh 	->baseSelection 			($_GET['tablename']	,$_GET['statement']);
				break;
			case 'advancedSearch':
				$dbh	->advancedSearch			($_GET['formdata']	,$_GET['sqlstatementname']);
				break;
			case 'insertData':
				$dbh	->insertData				($_GET['formdata']	,$_GET['table']);
				break;
			case 'saveUpdate':
				$dbh	->saveUpdate				($_GET["info"]		,$_GET["getparameter"]);
				break;
			case 'toolTipData':
				$dbh	->toolTipData				($_GET["fkcolumn"]	,$_GET["value"]);
				break;
			case 'getAnrede':
				$dbh	->getAnrede					($_GET['table']);
				break;

	}
}

?>

