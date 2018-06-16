<?
	class Personne{
		var $conn;
		public function __construct(){
			$this->conn=Load::load('Connection');
		}
		public function addPersonne($Name,$Description){
			$conn = $this->conn;
			$sql="INSERT INTO personne(Name,Description) VALUES (:Name,:Description)";
			$stat = $conn->prepare($sql);
			$stat->bindParam(":Name",$Name);$stat->bindParam(":Description",$Description);
			$stat->execute();
		}
		public function updatePersonne($id,$Name,$Description){
			$conn = $this->conn;
			$sql="UPDATE personne SET Name=:Name,Description=:Description WHERE id=:id";
			$stat = $conn->prepare($sql);
			$stat->bindParam(":id",$id);$stat->bindParam(":Name",$Name);$stat->bindParam(":Description",$Description);
			$stat->execute();
		}
		public function deletePersonne($id){
			$conn = $this->conn;
			$sql="DELETE FROM personne WHERE id=:id";
			$stat = $conn->prepare($sql);
			$stat->bindParam(":id",$id);
			$conn->execute();
		}
	}
?>