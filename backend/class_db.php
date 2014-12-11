<?php

/*=========================================
=            DB Handler Klasse            =
=========================================*/

class db_handler extends PDO{

	private $DatabaseInformation  = 'mysql:host=localhost;dbname=databasename;charset=utf8';
	private $DatabaseUser = 'user';
	private $DatabasePW   = 'password';

	/**
	 * Erstellt bei Erstellung des PDO Objekts eine Datenbankverdinung
	 */
	public function __construct(){
		try{
			parent::__construct($this->DatabaseInformation, $this->DatabaseUser, $this->DatabasePW);
			$this->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
		}catch(PDOException $e){
			print "Error!: " . $e->getMessage() . "<br/>";
   			die();
		}
	}

	/**
	 * [drawMenuItems description] 
	 * Gibt den HTML Code für die Menü-Elemente wieder
	 * TODO: Umbau -> Return JSON only Values
	 */
	public function drawMenuItems(){
		try{
				$tablenames = $this->query("show tables"); //Methode des PDO Objekts
				foreach ($tablenames as $row)
				{
					$tablearr[] = $row[0];
				}

				asort($tablearr);
				foreach ($tablearr as $row)
				{
					echo "<li><a onClick='show_table(this.innerHTML,".'"sql_select"'."); toggleElementClass(this);' href='#'>$row</a></li>";
				}


			}
			catch (PDOException $e)
			{
			   print "Error!: " . $e->getMessage() . "<br/>";
			   die();
			}
	}

	/**
	 * Holt sich aus der Klasse SQLStatements den entsprechenden String
	 * @param  [string] $table [description] Tabellenname
	 * @return [PDO-Objekt] Das PDO Objekt enthält dann das Ergebniss der Query
	 */
	public function getAnrede($table){
		$sql = new SQLStatements;
		$result = $this->query($sql->get_Anreden($table));
		echo json_encode($result->fetchAll());
	}

	/**	
	 * [searchInTable description]
	 * Die Suchanfragen aus der searchline werden hier bearbeitet und mithilfe der table Klasse in Verknüpftiges Format gebracht
	 * @param  [type] $table     [description] der Tabellenname
	 * @param  [type] $parameter [description] die Suchparameter aus der Form
	 */
	public function searchInTable($table,$parameter){
				require 'class_table.php';

				$whereStr= "";

				foreach ($parameter as $key => $value) {
					$whereStr .= 	($value["value"]!="") ? 
										$value["name"]." LIKE '%".$value["value"]."%'" . (($key != count($parameter)) ? " AND " : "") : "";
				}

				$whereStr = rtrim($whereStr,"AND ");
				$whereStr = str_replace("*","%",$whereStr);
				$sql  = ($whereStr != "") ? "SELECT * FROM $table WHERE $whereStr" : "SELECT * FROM $table";
				
				try{
					$tableObject = new table($this->query($sql));
					$data = [	
						"tableheader" 	=> 	$tableObject	->getColumnNames(),
						"searchline" 	=>	$tableObject	->getColumnInfos(),
						"valueFields" 	=>	$tableObject	->getTableData(),
						"keys"			=> 	$tableObject	->getKeys()
							];

					
				}catch(Exception $e){
					echo $e;		
					echo $data;	
				}
			
				try {
					echo json_encode($data);
				} catch (Exception $e) {
					echo $e;			
				}
	}

	/**
	 * [autocomplete description]
	 * Hier werden die Daten aus der suchvorschlage js funktion geholt, formatiert und zurrückgegeben
	 * @param  [string] $column [description] Spaltenname (==Inputname)
	 * @param  [string] $table  [description] Der Tabellenname
	 * @param  [string] $term   [description]
	 */
	public function autocomplete($column,$table,$term){

		$queryst = $this->prepare("SELECT DISTINCT $column FROM $table WHERE $column LIKE '%$term%'");
		$queryst->execute();

		$result  = $queryst->fetchAll(PDO::FETCH_COLUMN,0);

		// $result =  $this->query("SELECT DISTINCT $column FROM $table WHERE $column LIKE '%$term%'",FETCH_COLUMN)

		$json  = json_encode($result);
		echo $json;
	}

	/**
	 * [baseSelection description]
	 * Holt sich die Standard Ansicht der Tabellen und schickt es zurück an die js
	 * @param  [type] $table     [description] Tabellenname
	 * @param  [type] $statement [description] SQL Statement (Quark)
	 */
	public function baseSelection($table,$statement){
		require 'class_table.php';
		//Prüft ob eine Funktion mit dem Statement Short-Cut existiert
		
		if (method_exists("SQLStatements", "get_".$statement)) {
			$statement = call_user_func(	["SQLStatements","get_".$statement] , $table );
		}else{
			$statement = "SELECT * FROM ".$table;
		}

		$sql_result = $this->query($statement);

		//Erstellt ein neues Table Objekt und speichert die Rückgaben der Funktionen 
		//in ein Array welches als JSON zurück an die Seite geht
		
		$tableObject = new table($sql_result);

		$data = [	
					"tableheader" => 	$tableObject	->getColumnNames(),
					"searchline"  =>	$tableObject	->getColumnInfos(),
					"valueFields" =>	$tableObject	->getTableData(),
					"keys"        => 	$tableObject	->getKeys()
				];

		try {
			echo json_encode($data);
		} catch (Exception $e) {
			echo $e;		
			echo $data;	
		}
	}

	/**
	 * [advancedSearch description]
	 * Hier werden die jeweiligen Funktionen aus dem Erweiterten Suchen Tab ausgeführt und wiedergegeben
	 * @param  [type] $formdata         [description] serialisierte Form
	 * @param  [type] $sqlstatementname [description] Statementname kommt im Ursprung aus der HTML wo die Funktion ausgeführt wird
	 */
	public function advancedSearch($formdata,$sqlstatementname){
		require 'class_table.php';
		require 'class_sql_statements.php';
		$para = [];

		$sql = new SQLStatements;

		foreach ($formdata as $param) {
			$para[]=$param["value"];
		}

		try {
			//schaut ob eine Funktion im Obejekt sql existiert und führt sie mit den $para[] aus
			$re = call_user_func_array([$sql,"get_$sqlstatementname"],$para);
		} catch (Exception $e) {
			echo "Funktion gibts nicht";
		}

		$result = $this->query($re);
		//--------------------------------------------
		$tb = new table($result);

		$data = [	
							 "tableheader" 	=> 	$tb	->getColumnNames(),
							 "searchline" 	=>	$tb	->getColumnInfos(),
							 "valueFields" 	=>	$tb	->getTableData(),
							 "keys" 		=> 	$tb ->getKeys()
						];

				try {
					echo json_encode($data);
				} catch (Exception $e) {
					echo $e;			
				}
	}

	/**
	 * [insertData description]
	 * Funktion zum SQL Insert von Data
	 * @param  [type] $formdata [description] serialisierte Form (Tab1)
	 * @param  [type] $table    [description] Tabellenname
	 */
	public function insertData($formdata,$table){
		require 'class_sql_statements.php';

		$parameter = [];
		$columns = "";
		$values  = "";

		foreach ($formdata as $singleparameter) {
			$parameter[] =	$singleparameter["value"];
		}
		
		foreach ($formdata as $key => $value) {
			$columns .= ($value["value"]!="") ? $value["name"]."," : "";
			$values  .= ($value["value"]!="") ? "'".$value["value"]."'," : "";
		}

		$columns = rtrim($columns,","); $values = rtrim($values,",");
		try {
			$sqlst = $this->query("INSERT INTO $table($columns) VALUES ($values)");

			// $this->exec($sql) or die (print_r($this->errorInfo(),true));
			print_r($sqlst);
		} catch (Exception $e) {
			echo "$e";					
		}
	}

	/**
	 * [saveUpdate description]
	 * Speichert die Werte aus dem JS toggleEditmode Kram in die Datenbank
	 * @param  [array] $info      [description] Tabelleninformationen
	 * @param  [array] $parameter [description] Parameter in einem Array aus den einzelnen Input fields 
	 * //TODO: Man könnte auch nen Form um die Tr bauen und serialsieren
	 * @return [string] SQL Statement
	 */
	public function saveUpdate($info,$parameter){
		//Speichert das GET zwischen und erstellt ein Array $key aus den Assotiationen der Werte
		$key 			= array_keys($parameter);
		$tablename 		= $info["table"];
		$pk_col_name 	= $info['primary_column_name'];
		$pk_val 		= $info['primary_column_value'];

		//Der Table-String wird erstellt
		$sql_part_1 	= "UPDATE $tablename SET ";
		$sql_part_2 	= "";
		$sql_part_3 	= " WHERE $pk_col_name = '$pk_val' ";

		//für jeden Schüsselwert im GET Array außer den ersten (table) 
		//und zweiten (id) Wert setzt das SQL Statement zusammen
		$len = count($key);
		foreach ($key as $column_name) {
		        $sql_part_2 .= 
		        	$column_name . "=" . "'" . $parameter[$column_name] . "'" . ",";
				
				//Entfernt den die letzten , und ' und hängt wieder eins dran
				$sql_part_2 = (0 === --$len) ? (rtrim($sql_part_2,",")) : $sql_part_2;
		}

		return $sql_part_1.$sql_part_2.$sql_part_3;
	}

	/**
	 * [toolTipData description]
	 * Holt sich aus der entsprechenden Tabelle ie ersten paar Wert und gibt sie wieder
	 * @param  [string] $foreignkeycolname [description] Fremdschlüssel Spaltenanem
	 * @param  [type] $value [description] Wert aus dem Input
	 */
	public function toolTipData($foreignkeycolname,$value){

		$db_tables    = [];
		$target_table = "";
		$target_cols  = [];

		//Suchalgo für den gleichen FK in der zugehörigen Tabelle (PK)
		foreach ($this->query("show tables") as $table) {
			foreach ($this->query("show columns from $table[0]") as $col) {
				$target_cols[] = $col["Field"];
				if ($col["Field"]==$foreignkeycolname && $col["Key"]=="PRI") {
					
					$target_table = $table[0];
					
				}

			}
			if ($target_table!=""){
				break 1;
			}
			$target_cols = [];
		}

		$sql = "SELECT $target_cols[1], $target_cols[2], $target_cols[3] FROM $target_table WHERE $foreignkeycolname = $value";

		$result = $this->query($sql);

		foreach ($result as $r) {
			echo "$r[0] $r[1] $r[2]";
		}
	}

}





?>