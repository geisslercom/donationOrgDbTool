<?php

/**
* 
*/
class SQLStatements extends PDOStatement
{
	
	/**
	 * Holt Datenbank Informationen aus dem View sum_Spende
	 * @return [type] [description]
	 */
	public function get_sql_spendenhöhe_gesamt(){
		return "SELECT SUM(summe) AS 'Gesamte Spendensumme' FROM Spendeneingang";
	}

	public function get_sql_select($table){
		return "SELECT * FROM $table";
	}

	public function get_sql_spendenhöhe_pp($sum){
		return "SELECT * FROM
						 (SELECT Stammdaten.Kundennummer, Firma, Anrede, Vorname, Nachname, Strasse, PLZ, Ort, Telefon, Email, Spender, Dauerspender, Sponsor, Reise, Hubschrauber, MVS, Gala_teilnehmer, Pressekontakt, Prospekt, Hubschrauber_newsletter, Stammdaten.Bemerkung, sum(summe) as Gesamtsumme
						 FROM Stammdaten, Spendeneingang
						 WHERE Stammdaten.kundennummer = Spendeneingang.kundennummer
						 GROUP BY Stammdaten.Kundennummer) AS result
						 WHERE result.Gesamtsumme > $sum";
	}

	public function get_sql_spendeneingang_tim($from,$till){
		return "SELECT * FROM Spendeneingang WHERE spendendatum BETWEEN '$from' AND '$till'	";
	}

	public function get_sql_stammdaten_sel_asc($kd_id){
		return "SELECT sd.Kundennummer, Firma, Anrede, Vorname, Nachname, Strasse, PLZ, Ort, Dauerspender, Spendeneingangsnummer, Spendendatum, Betreff, Summe, Betrag_in_Worten, Art_der_Zuwendung, Konto, Code, sd.Bemerkung
				 FROM Stammdaten sd, Spendeneingang se
				 WHERE sd.kundennummer = se.kundennummer
				 AND sd.kundennummer = '$kd_id'
				 ORDER BY Spendendatum";
	}

	public function get_Anreden($table)
	{
		return "SELECT DISTINCT `Anrede` FROM `$table` WHERE `Anrede` != '' ";
	}
}
/**

	TODO:
	- PDOStatement Class benutzen

**/


?>