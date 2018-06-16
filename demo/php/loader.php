<?php
	class Load{
		public static function load($a){
			if($a == "Connection"){
				require('conn.php');
				$a = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
				$a->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
				return $a;
			}
			else{
			$chemin = substr(__FILE__,0,strrpos(__FILE__,'/')+1);
			$chemin .= "class/".$a.".class.php";
				if(is_file($chemin)){
					require $chemin;
					//if(!class_exists($a, false)){
						return new $a; 
					//}
				}
				else{
					throw new RuntimeException('La classe <strong>' . $a . '</strong> n\'a pu être trouvée !');
				}
			}
		}
		public function __construct(){
			
		}
	}
?>