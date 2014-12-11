<?php 

/**
*  Erstellt eine notice Box
*/
class Notice 
{
	
	function __construct($msg)
	{
			echo "<script>	
			$('#notice').dialog('open');
			</script>";
			echo $msg;
	}
}


?>