<?php

/**
*
* Klasse: table
*
**/

class table{
	
	private $result;
	private $keys = ["pk"=>"","fk"=>[]];
	private $columns;
	private $col_names = [];
	private $col_info = [];
	private $data;

	/**
	 * [__construct description]
	 * @param [type] $result [description]
	 */
	public function __construct($result){
		$this->result = $result;
		$this->columns = $result->columnCount();
		$this->getColumnData();
		$this->data = $this->fetchDataFromPDO();
	}

	/**
	 * Description
	 * @return type
	 */
	public function getColumnData()
	{
		$this->col_names = [];
		for ($i=0; $i < $this->columns; $i++)
		{
			$meta = $this->result->getColumnMeta($i);
			$this->col_names[] = $meta['name'];
			$this->col_info[] = [$meta['name'],$meta['len'],$meta['native_type']];

			$is_pk = in_array("primary_key", $meta["flags"]);
			$is_fk = in_array("multiple_key", $meta["flags"]);
			$flag = ($is_pk) ? $this->setPrimaryKey($this->col_names[$i]) : 
					(($is_fk) ? $this->setForeignKey($this->col_names[$i]) : "") ;
		}

		
	}

	/**
	 * Erzeugt ein Array mit dem Ergebnis der vorhergenden Suche
	 * @return [array] [Keyinformationen und Datenwerte aus der Datenbankabfrage]
	 */
	public function fetchDataFromPDO()
	{
		$data= [];
		$row = 0;
		foreach ($this->result as $zeile) 
		{
			for ($i=0; $i < $this->columns; $i++) 
			{
				$data[$row][$this->result->getColumnMeta($i)["name"]] = $zeile[$i];
			}
		$row++;

		}
		return $data;
	}

	private function setPrimaryKey($column){
		$this->keys["pk"] = $column;
	}
	private function setForeignKey($column){
		$this->keys["fk"][] = $column;
	}
	public function getKeys()
	{
		return $this->keys;
	}
	public function getColumnNames()
	{
		return $this->col_names;
	}
	public function getColumnInfos()
	{
		return $this->col_info;
	}
	public function getTableData()
	{
		return $this->data;
	}
}