/**
*
* Java Skript Biblithek für das Projekt Fly-and-Help
* Authoren: Denny Stark, Benjamin van Zetten, Benjamin Geißler
*
**/
/*=================================
=            Variablen            =
=================================*/

var pathToPHP = "backend/controller.php";

/*-----  End of Variablen  ------*/




/*=======================================
=            Document Events            =
=======================================*/

	/**
     * [description] Wenn die Seitegeladen ist wird die Größe angepasst
     */
    $(document).ready(function(){
    	$("#column_right").load("views/tableView.html");

    	$("#edit_field ul").idTabs();
    	$("#notice").dialog({autoOpen:false});
        design.setSize();



        $('#edit_field a').click(function(){
            design.setSize();
        	});
        $('#notice').click(function(element){
        	$(element).dialog("close");
        });
    });

    /**
     * [description] Wenn die Seitengröße geändert wird, wird die Größe angepasst
     */
    $(window).resize(function() {
        design.setSize();
    });

/*-----  End of Document Events  ------*/
    

/*=============================================
=            Table Functions          		 =
=============================================*/
        
	/*==========  Zeichnung der Datenbankdaten  ==========*/
	
    /**
     * [show_table description] Zeichnet eine Tabelle aus dem Menüpunkten
     * 							Führt intern die drawEntireTable Funktion aus
     * 							Setzt die Größen des Fensters
     * @param  {[string]} table   	[description] 	Der Tabellename
     * @param  {[string]} statement [description]	Das Statement
     */
    function show_table(table, statement){
    	$("#headline").length ? console.log("headline vorhanden") : $("#column_right").hide("slide",function(){$("#column_right").load("tableView.html").show();});

        $.get(pathToPHP,{func:"baseSelection",tablename:table,statement:statement})
        	.done(function (data) {
        	
		        	logInDebugMode("refresh"+table+statement);
		        	
		        	drawEntireTable(data);
		        	
		            $("#text_left").html(table);
		            
		            design.setSize();
           
        	});
	}
	
	/**
	 * Setzt aus den Typen der Eingabefelder entsprechende Eingabefelder zusammen und hängt dise an die Headline an
	 * @param  {[objekt]} searchline [description] 
	 */
	function getSearchFields (data) {
		$("#searchline").html("<td>"+
                                "<input type='button' onclick='runSearch()' name='search_submit' value='Suchen' />"+
                           	"</td>");
			for (var col in data.searchline) {
        		
					title  = data.searchline[col][0];
					length = data.searchline[col][1];
					typ    = data.searchline[col][2];

	        		var inputB = new inputbuilder(title,length,"searchlinefield");

	        		switch(typ){
	        			case "LONG": 
	        				$("#searchline").append(inputB.getInputForLong);
	        				break;
	        			case "VAR_STRING": case "BLOB":
		        			switch(title){
			    					case "Anrede":
			        					$("#searchline").append(inputB.getDropDownBox(getTableName));
			        					break;
			        				case "Wochentag":
			        					$("#searchline").append(inputB.getDDBWochentag);
			        					break;
		        					default:
	        							$("#searchline").append(inputB.getInputForVarchar);
	        							break;
			        				}
	        				break;
	        			case "DATE":
	        				$("#searchline").append(inputB.getInputForDate);
	        				break;
	        			case "TINY":
	        				$("#searchline").append(inputB.getInputForTiny);
	        				break;
	        			default:
	        				$("#searchline").append(inputB.getInputForLong);
	        				break;
        			};

        	}
        	$(".searchlinefield").change(runSearch);
	}
	
	/**
	 * [drawValueFields description] Zeichnet die Tabellendataen in den Tbody
	 * @param  {[objekt]} data [description]
	 */
	function drawValueFields (data) {
		$("#tbl_sort tbody").html("");

		for(var zeile in data.valueFields){
        		//Neue Zeile
        		$("#tbl_sort tbody").append("<tr id='row_"+zeile+"'></tr>");
        		//Erstes Feld mit dem Bearbeiten Icon füllen & OnClickListener setzen
        		$("#tbl_sort tbody #row_"+zeile)
        			.append("<td><a href='#' id='index_"+zeile+"' onclick='toggleEditmode(this);' name='"+(getTableName)+"' ><span class='ui-icon ui-icon-pencil'></span></a></td>")
        			.click(setActiveLine(this));

        		col=0;
        		for(var spalte in data.valueFields[zeile]){
        			
        			flag = 	(data.keys.pk == data.searchline[col][0]) ? "pk" :
        					(($.inArray(data.searchline[col][0],data.keys.fk)>=0) ? "fk" : "") ;
        			//Datenfeld anhängen
        			
        			$("#tbl_sort tbody #row_"+zeile)
        				.append("<td fkcolumn='"+$("#headline .col_name:nth-child("+(col+2)+")").html()+"' key='"+flag+"'>"+data.valueFields[zeile][spalte]+"</td>")
        			 $("#headline .col_name:nth-child("+(col+2)+")")
        			 .attr('key', flag).attr("fk_column",$("#headline .col_name:nth-child("+(col+2)+")").html());
        			col++;
        			//TODO: Primaray Keys als Attribut auf entsprechendes Feld setzen data.valueFields[primarykey] 
        		}

        	}
	}
	
	/**	
	 * [setInsertFields description] Zeichnet die Inputfelder im "Eintrag bearbeiten"-Tab
	 * @param {[objekt]} data [description]	Daten aus den GET Request
	 */
	function setInsertFields(data) {
		$("#tab1").html("<form id='insert_form'><div id='insert_type_text'></div><div id='checkboxes'></div><input class='ui-button ui-widget ui-button-text-only'type='button' onClick='newEntry(this)' value='Abschicken'>");
			for (var col in data.searchline) {
				title = data.searchline[col][0];
				length = data.searchline[col][1];
	    		typ = data.searchline[col][2];
		
				var insertBuilder = new inputbuilder(title,length,"insert");

				switch(typ){
					case "LONG":
					$("#insert_type_text").append(insertBuilder.getInputForLong);
					break;
					case "VAR_STRING": case "BLOB":
							switch(title){
								case "Anrede":
									$("#insert_type_text").append(insertBuilder.getDropDownBox(getTableName));
									break;
								case "Wochentag":
		        					$("#insert_type_text").append(insertBuilder.getDDBWochentag);
		        					break;
								default:
			        				$("#insert_type_text").append(insertBuilder.getInputForVarchar);
			        				break;
							}
							break;
				case "DATE":
					$("#insert_type_text").append(insertBuilder.getInputForDate);
					break;
				case "TINY":
					$("#checkboxes").append(insertBuilder.getInputForTiny);
					break;
				default:
					$("#insert_type_text").append(insertBuilder.getInputForLong);
					break;
				}
			}
			$(".insert[type='text']").focus(function(){ $(".insert").tooltip(); });
		}

	/**	
	 * [sketchCheckboxes description] 
	 * Wandelt die 1 und 0 in den TD Felder innerhalb des Tbody in Checkboxen um
	 */
 	function sketchCheckboxes(){
		 
		 $("#searchline td").each(function(index, el) {
			 
			 if ($(el).children("input").attr('type') == "checkbox") {
		 			
		 			if ($(el).children('input[type="checkbox"]')) {
 						
 						$("#tbl_sort tbody tr").each(function(index1, el) {
		 						
		 						var isCheck = $("#tbl_sort tbody tr:nth-child("+(index1+1)+") td:nth-child("+(index+1)+")")
		 						.html() == "1" ? "checked" : "";
								
								$("#tbl_sort tbody tr:nth-child("+(index1+1)+") td:nth-child("+(index+1)+")")
								.html("<input disabled='disabled' type='checkbox' "+isCheck+">");				
						});
					}
			}});}

	/**
	 * [drawEntireTable description] Zeichnet die gesamte Tabelle und ruft die anderen Methoden
	 * getSearchFields, drawValueFields, sketchCheckboxes, setInsertFields
	 * +Setzt die Klassen Elemente von .datepicker in eine jquery funktion
	 * @param {[objekt]} data [description] Daten aus den GET Request
	 * @return {[type]} [description]
	 */
	function drawEntireTable (data) {

		

		 try{
			 data = $.parseJSON(data);
		 }catch(e){
		 	alert(e);
		 	logInDebugMode(data);
		 }


		 //zeichnet die Tabellenköpfe
		 $("#headline").html("<th></th>");

		 for(var col in data.tableheader){
			$("#headline").append("<th class='col_name'>"+data.tableheader[col]+"</th>");
		 }

		 //Zeichnet die Suchfelder
		 getSearchFields(data);

		 //Zeichnung der Daten
		 drawValueFields(data);
		 $("#tbl_sort").tablesorter();
		 // setToolTips();
		 sketchCheckboxes();

		 setInsertFields(data);

		 $( ".datepicker" ).datepicker({ dateFormat: "yy-mm-dd" });

	}

	/*==========  Grund Funktionen  ==========*/

	/**
	 * [setAdvSearch description] 
	 * Nimmt sich das Übergebene Element, sucht sich das Elternteil (Eine Form aus dem Erweiterte Suche Tab) und serialisiert es
	 * Schick es an den Server und zeichnet das Response mit drawEntireTable in den Tbody
	 * @param {[DOM]} element [description] Kind der Eletern-Form
	 * @param {[string]} sqlname [description] Name der Statementfunktion in der PHP_SQL_Statement Klasse ohne "get_"
	 */
	function setAdvSearch(element,sqlname){
	 var form = $(element).parent().serializeArray();

	 $.get(pathToPHP,{func:"advancedSearch",formdata:form,sqlstatementname:sqlname}).done(function(data) {
	 		logInDebugMode(data);
	 		drawEntireTable(data);
	 	});
	}

	/**	
	 * [newEntry description] 
	 * Fügt ein neuen Datensatz der Tabelle hinzu. Holt sich dafür das Eltern-Form-Element serialisiert es,
	 *  schickt es an die Datenbank und refresht den Tbody Inhalt 
	 * @param  {[DOM]} element [description] Der "Button" der die Form abschickt
	 */
	function newEntry(element) {
		form = $(element).parent().serializeArray();
		
		$.get(pathToPHP,{func:"insertData",formdata:form,table:getTableName})
			.done(function(data){
				logInDebugMode(data);
			});

		show_table(getTableName(),"sql_select");

		}

	/**
	 * [runSearch description] 
	 * Sendet per Ajax eine Datenbank Abfrage an die controller.php
	 * und zeichnet dann den Response in den Tbody
	 */
	function runSearch(){
	    console.log("do search");
	    var suchfelderArray = $("#table_form").serializeArray();
	    // $('#table_form input[type="checkbox"]').map(function() { 
	    // 										suchfelderArray.push({ name: this.title, value: this.checked ? "1" : "" });
	    // 									});
	   
	   console.dir(suchfelderArray);
	    $.get(pathToPHP,{
	    		func:"search",
	    		table:getTableName,
	    		param:suchfelderArray})

	    .done(function(data){
	        logInDebugMode(data);
	        try{
	            data = $.parseJSON(data);
	           logInDebugMode(data);
	        }catch(e){
	            alert(e);
	            logInDebugMode(data);
	        }

	        //Zeichnung der Daten
	        drawValueFields(data);

	        sketchCheckboxes();
	        $("#tbl_sort").tablesorter();
	        design.setSize();
	        setToolTips();
	    });
	}
	
	/*==========  Erweiterte Funktionen  ==========*/
	
	/**
	 * [toggleEditmode description] 
	 * Setzt die Makierte Zeile in den Editmode
	 * Aus updatebaren Textelementen werden Input Felder die beschrieben werden können
	 * und bei einem Klick auf "save" in die Datenbank übertragen werden.
	 * @param  {[DOM]} element [description] Die TR der Zeile die es betrifft
	 */
	function toggleEditmode(element) {
		
	    var parameter = {
	    	func: 'saveUpdate',
	        info: {
	            table: getTableName,
	            primary_column_name: ($(".col_name[key='pk']").html()),
	            primary_column_value: ($(element).parent().siblings("[key='pk']").html())
	        },
	        getparameter: {}

	    };


	    logInDebugMode(parameter);
	    //besorgt sich das Eltern Teil der TD
	    var editline = $(element).parent();

	    //Hängt an das TD ein Button mit "save" an
	    $(element).after('<a id="saveupdate" ><span class="ui-button-text">save</span></a> ');
	    $(element).hide();

	    //zieht sich die anderen td's in der Zeile
	    var td_fields = $(editline).siblings();

	    //Jedes TD wird ausgelesen und der Wert in eine Input als Value umgeschrieben wenn es kein Schlüssel ist
	    $(td_fields).each(function(index, el) {
	        if (    !($(el).attr("key") == "pk" || $(el).attr("key") == "fk")   ) {
	            val = $(el).html();
	            $(el).html("<input class='editmodeField' col='" + ( $($(".col_name")[index]).html() ) + "' type='text' value='" + val + "' />");
	        };
	    });


	    //Beim Click auf save wird jede TD in das Objekt paras geschrieben und per GET an saveupdate.php geschickt
	    $("#saveupdate").click(function(event) {

	        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	        //Für jedes input mit der class editmodeField wird der value ausgelesen und in das paras object gespeichert //
	        //Dann wird das Input Feld durch Plain HTML mit dem eingegebenen Wert beschrieben //
	        //////////////////////////////////////////////////////////////////////////////////////
	        $(".editmodeField").each(function(index, element) {
	            el = $(element).parent();
	            if (    !(  $(el).attr("key") == "pk" || $(el).attr("key") == "fk"  )   ) {
	                logInDebugMode(el);
	                inputvalue = $(element).val();
	                paras.getparameter[$(element).attr("col")] = inputvalue;
	                $($(element).parent()).html(inputvalue);
	            }
	        });

	        //TODO: .change einarbeiten damit nur geänderte Werte abgeschickt werden.

	        //Entfernt ungültige Properties
	        delete paras.undefined;

	        //Feuert die GET mit den paras Object als Wert ab //.done nur zum debuggen
	        $.get(pathToPHP, paras).done(function(data) {
	            logInDebugMode(data);
	        });

	        //Entfernt den Anchor "save" wieder
	        $("#saveupdate").remove();

	        //Lässt das bearbeiten Symbol wieder erscheinen
	        $(element).show();
	    });
	}

	/**
	 * [setToolTips description] 
	 * Belegt die Felder die Foreign Keys sind mit einem Tooltip welches die Ersten 3 Spalten der Datenbanktabelle des Foreign-Key enthält.
	 * Nimmt sich dabei jedes TD mit dem Attribut Key und dem Wert "fk" und fragt die Datenbank wo es hingehört
	 */
	function setToolTips(){

	    //Für jedes td mit dem Key=FK (Selbst erstelltes HTML Attribut)
	    $("td[key='fk']").each(function(index,element){
	        
	        //holt sich den Fremdschlüssel
	        var foreignkey  = $(element).html();

	        //Setzt ein leeres Title Atribut damit der Tooltip funktioniert // Ohne Title Kein Tooltip
	        $(element).attr("title" , "");
	        
	            //Für GET an getCustomerName.php welches den Vor- und Nachnamen zurückgibt
	            $.get(pathToPHP,{
	            		func:"toolTipData",
	            		table:getTableName(),
	            		value:foreignkey,
						fkcolumn:$(element).attr("fkcolumn")})

	                //Bei Erfolg wird das Element mit einem Tooltip des Ergebnisses belegt
	                .done(function(data){
	                            // logInDebugMode(data);
	                    $(element).tooltip({content:function(){
	                                if (data != "0") {
	                                    return data;
	                                };
	                                                            }
	                    });
	                })

	                //Bei einem Fehler wird das auch ausgegeben
	                .fail(function(){
	                    return "Ein Fehler ist aufgetreten.";
	                });
	            

	        });
	}

	/**
	 * Schickt per GET den Spaltenname und den bereits eingegebenen Wert an die Datenbank und holt sich ähnliche Wert für das autocomplete
	 * @param column - Spaltenname
	 * @param element - Das DOM Element das den Event triggert
	 */
	function suchvorschlage(column,element){

		logInDebugMode("suchvorschlage mit paras:"+column+" "+element+" "+getTableName());
	    $(element).autocomplete(
	        {
	            source: function( request, response ) {
							logInDebugMode(request.term);
						$.ajax({
								url: pathToPHP,
								method:'get',
								dataType: "json",
								data: {
										func:"autocomplete",
										term: request.term,
										tablename: getTableName(),
										"column": column
								},
								success: function( data ) {
												response( data );
												logInDebugMode(data);
											
								},
								always: function() {
										alert( "complete" );
								},
								fail: function( data ) {
												
												logInDebugMode("error");
											}
										}
								)
				},minLength:2

	        });

	    // $.get(pathToPHP,{func:"autocomplete","column":column,"tablename":getTableName(),term:"blub"}).done(function(data){
	    // 	logInDebugMode(data);
	    // });

	}

	/**
	 * [runLiveSearch description] 
	 * Not implemtiert 
	 * Soll Anstatt die Suche jedes mal an den Server zuschicken die lokalen TD durchforsten
	 * .hide()
	 * @param  {[DOM]} element [description]
	 */
	function runLiveSearch(element){
		logInDebugMode("live search");
		logInDebugMode("not implementet jet");
	}

	

/*-----  End of Table Functions  ------*/


/*=====================================
=            CSS Functions            =
=====================================*/
	
	/**
	 * [setActiveLine description] 
	 * Ändert die Hintergrund Farbe der Zeile bei Klick in die Zeile
	 * @param {[DOM]} el [description] Das DOM Element in dem Falle eine TR
	 */
	function setActiveLine(element){

		//Entfernt alle geklickten Linies
		$(".activeLine").removeClass("activeLine");

		//Setzt die Klasse auf das geklickte Element
		$(element).toggleClass("activeLine");
	}

   /**	
	 * [toggleElementClass description] 
	 * Entfernt die Klassen von allen Elementen auf den es aktive ist 
	 * und setzt sie auf das geklickte element neu
	 * 
	 * @param  {[DOMelement]} el [description] element das die Funktion ausführt
	 */
    function toggleElementClass(element){
        $(".active").removeClass("active");
        $(element).toggleClass("active");
    }
/*-----  End of CSS Functions  ------*/


/*======================================
=            Misc Funktions            =
======================================*/
	/**
	 * [setTitle description]
	 * Setzt den Fenstertitel entsprechent des parameters
	 * @param {[string]} table [description] Gedacht für die Tabellenname aber im Prinzip nur ein String
	 */
	function setTitle (table) {
		$("title").html(table);
	}
	/**
	 * [show_error description] 
	 * Lässt die Notification Box erscheinen
	 */
	function show_error()
    {
        $('#notice').show();
    }
    /**
     * [hide_error description] 
     * Lässt die Notification verschwinden
     */
    function hide_error()
    {
        $('#notice').hide();
    }
    /**
     * [getTableName description] 
     * Holt sich den Tabellenamen aus der Überschrift und gibt ihm wieder
     * @return {[string]} [description] Tabellenname
     */
    function getTableName(){
    	return $("#text_left").html();
    }
    
    /**
     * [logInDebugMode description] 
     * Log die Übergabe nur wenn im HTML TAG das Attribut "debug" auf "true" ist
     * @param  {[mixed]} str [description] Übergebene Informationen die auch logbar wären
     */
    function logInDebugMode(str){
    	$("html").attr("debug") == "true" ? console.log(str) : "";
    	//
    }

      function getCreateDataView() {
      		console.log("DataView");
    		$("#column_right").hide("slide",function(){$("#column_right").load("views/dataView.html").show("slide");})
    }
/*-----  End of Misc Functions  ------*/


/*===============================
=            Classes            =
===============================*/

	/**
	 * [inputbuilder description] 
	 * Generiert Input-Felder mit den entsprechenden Methoden aber derbe Redunant
	 * Für jeden SQL Datentyp gibts eine Methode die entsprechenden Input baut
	 * 
	 * @param  {[string]} title  -> spaltenname
	 * @param  {[int]} length -> Länge der Maximal Länge des Feldes == SQL Field Größe
	 * @param  {[string]} -> CSS Klasse zur Unterscheidung der Art von Input Felder
	 *
	 * TODO: Umbau das die Methoden direkt ein DOM Objekt wiedergeben
	 */
	var inputbuilder = function(title,length,cssclass){
		var title=title, length=length, cssclass=cssclass; 

		td_beginn = (cssclass=="searchlinefield") ? "<td>" : "";
		td_end = (cssclass=="searchlinefield") ? "</td>" : "";
		focusF = "onfocus=suchvorschlage('"+title+"',this)";

		this.getInputForVarchar	= function(){
								var inputString = 
									td_beginn+
									"<input "+focusF+" class='"+cssclass+"' title='"+title+"' type='text' name='"+title+"' placeholder='"+title+"'>"+
									td_end;
								return inputString;
							};
		this.getInputForLong 	= function(){
								var inputString = 
									td_beginn+
									"<input class='"+cssclass+"' title='"+title+"' type='text' pattern='[0-9]{1,"+length+"}' title='nur Zahlen' name='"+title+"' placeholder='"+title+"'>"+
									td_end;
								return inputString;
							};


		this.getInputForDate 	= function(){
								var inputString = 
								td_beginn+
								"<input class='"+cssclass+" datepicker' type='date' name='"+title+"' placeholder='"+title+"'>"+
								td_end;
								return inputString;
							};


		this.getInputForTiny 	=	function(){
								var inputString = 
								td_beginn+
								"<label for='"+title+"'>"+title+"</label>"+
								"<input class='"+cssclass+"' type='checkbox' name='"+title+"' placeholder='"+title+"'>"+
								td_end;
								return inputString;
							};

		this.getDropDownBox		=	function(table) {
								
								var inputString = "<select name='"+title+"'><option value=''>Auswahl</option>";
								var data_values;

								$.get(pathToPHP,{func:"getAnrede","table":table}).done(function(data) {
										data=$.parseJSON(data);
										logInDebugMode(data);
										for(var key in data){
											inputString += "<option value='"+data[key].Anrede+"'>"+data[key].Anrede+"</option>";
										}
										inputString += "</select>";
								});
								return inputString;

							},
		this.getDDBWochentag	=	function() {
								var wochentag = ["Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag","Sonntag"];

								var inputString = td_beginn+"<select name='"+title+"'><option value=''>Wochentag</option>";
								
										for(var tag in wochentag){
											inputString += "<option value='"+wochentag[tag]+"'>"+wochentag[tag]+"</option>";
										}
										inputString += "</select>"+td_end;
								return inputString;

							}
	}

//TODO: Die Methoden zum zeichnen der Tabellen könnte eigentlich auch in eine Klasse gepackt werden

/*-----  End of Classes  ------*/





