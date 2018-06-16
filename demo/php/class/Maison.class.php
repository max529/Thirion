<?
	class Maison{
		var $conn;
		public function __construct(){
			$this->conn=Load::load('Connection');
		}
		public function addMaison($Nom){
			$conn = $this->conn;
			$sql="INSERT INTO maison(Nom) VALUES (:Nom)";
			$stat = $conn->prepare($sql);
			$stat->bindParam(":Nom",$Nom);
			$stat->execute();
		}
		public function updateMaison($id,$Nom){
			$conn = $this->conn;
			$sql="UPDATE maison SET Nom=:Nom WHERE id=:id";
			$stat = $conn->prepare($sql);
			$stat->bindParam(":id",$id);$stat->bindParam(":Nom",$Nom);
			$stat->execute();
		}
		public function deleteMaison($id){
			$conn = $this->conn;
			$sql="DELETE FROM maison WHERE id=:id";
			$stat = $conn->prepare($sql);
			$stat->bindParam(":id",$id);
			$conn->execute();
		}
	}
?>