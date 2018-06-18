<?php

    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type, Content-Range, Content-Disposition, Content-Description');

    require('./php/loader.php');
    $classToLoad = Load::load('classToLoad');

    echo $classToLoad->connect($_POST['usernameProp'],$_POST['passwordProp']);
    

    
?>