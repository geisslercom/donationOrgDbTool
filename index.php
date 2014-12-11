<!DOCTYPE HTML>
<html debug="true">
<head>
<meta charset="utf-8">
<title> projektDB</title>

<!-- Liste von backend -->
<!-- TODO: Wird bei Auslagerung der drawMenuItems-Funktion nicht mehr gebraucht -->
	<?php 
	try {
        include 'backend/class_notice.php';
        include 'backend/class_db.php';
        include 'backend/controller.php';
    } catch (Exception $e) {
         $error_notice = $e;
    }
       
	 ?>

<link rel="stylesheet" href="css/style.css" />
<link rel="stylesheet" href="css/jquery-ui.css">
<link rel="stylesheet" href="css/jquery-ui.theme.css"/>
<link rel="stylesheet" href="css/jquery-ui.structure.css">
<!-- jquery einbinden -->
<script src="js/jquery-1.11.1.min.js"></script>
<script src="js/jquery-ui.js"></script>
<script src="js/jquery.tablesorter.js"></script>
<script src="js/jquery.idTabs.min.js"></script>
<script src="js/design.js"></script>

<script src="js/flyandhelplib.js"></script>

<?php
try{
	$db_handler = new db_handler();

}catch (Exception $e) {
    $error_notice = $e;
}


?>
</head>
<body>
<div id="container"> 
 <div id="header"><div id="text_left">Tabellenname</div><div id="header_logo"></div><div id="text_right">FirmaXYZ | Verwaltung</div>  </div>
    <div id="main">
        <div id="column_left">
            <div id="left_nav" class="whiteBorder">
                    <div class="gradient headerback">Tabellen:</div>
                    <div class="inlineBorder">
                        <ul>
                        <?php $db_handler->drawMenuItems(); ?> <!-- TODO: Wird in JS ausgelagert -->
                        </ul>
                    </div>
            </div>
            <div id="user_info" class="whiteBorder"><div class="gradient headerback">User:</div>
                <div id="userInput" class="inlineBorder">
                    <ul>
                        <li><div class="userName">Admin<img src="images/usericon.png" height="16" width="16" alt=""></div></li>
                        <li><div class="logOut">Logout<img src="images/logout.png" height="16" width="16" alt=""></div></li>
                    </ul>
                </div>
            </div>
        </div>

        <div id="column_right">
            
        </div>
    </div>
    <div id="notice" title="Fehler:">
        <?php isset($error_notice) ? new Notice($error_notice) : "" ?>
    </div>
<a href="#" onclick="$('html').attr('debug','true')">Debug anschalten</a>
<a href="#" onclick="$('html').attr('debug','false')">Debug anschalten</a>
</div>
</body>
</html>