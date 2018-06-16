<?php
	class DefaultClassName{
		var $conn;
		public function __construct(){
			$this->conn=Load::load('Connection');
		}
		public function add(insertPropPhp){
			$conn = $this->conn;
			$sql="insertSentence";
			$stat = $conn->prepare($sql);
			insertPrep
			$stat->execute();
		}
		public function update(updatePropPhp){
			$conn = $this->conn;
			$sql="updateSentence";
			$stat = $conn->prepare($sql);
			updatePrep
			$stat->execute();
		}
		public function delete(deletePropPhp){
			$conn = $this->conn;
			$sql="deleteSentence";
			$stat = $conn->prepare($sql);
			deletePrep
			$stat->execute();
		}
		public function getAll(){
			$conn = $this->conn;
			$sql="selectAllSentence";
			return $conn->query($sql)->fetchAll(PDO::FETCH_ASSOC);
		}
		public function getById(selectByIdPropPhp){
			$conn = $this->conn;
			$sql="selectByIdSentence";
			$stat = $conn->prepare($sql);
			selectByIdPrep
			$stat->execute();
			return $stat->fetch(PDO::FETCH_LAZY);
		}
	}
?>