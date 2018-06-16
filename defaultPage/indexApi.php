<?php
    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type, Content-Range, Content-Disposition, Content-Description');

    require('../php/loader.php');
    

    //var_dump($_POST);

    $pathsTemp = explode('/',$_GET['request']);
    $paths = [];
    foreach($pathsTemp as $pa){
        if($pa!=""){
            $paths[count($paths)] = $pa;
        }
        
    }
    
    $User = Load::load('User');

    $isTokenOk = $User->checkToken($_GET['token']);
    if(!$isTokenOk){
        echo 'token invalide';
        return;
    }

    if($paths[0] == 'User'){
        $temp = $User;
    }else{
        $temp = Load::load($paths[0]);
    }
    
    $res = "";
    if(count($paths) == 1){
        $res = $temp->getAll();
    }else if($paths[1] == 'add'){
        var_dump($_POST);
        $params = loadData($paths[0],'add');
        $res = call_user_func_array(array($temp, "add"), $params);
    }else if($paths[1] == 'update'){
        $params = loadData($paths[0],'update');
        $res = call_user_func_array(array($temp,'update'), $params);
    }else if($paths[1] == 'delete'){
        $res = $temp->delete($paths[2]);
    }else if($paths[1] == 'getById'){
        $res = $temp->getById($paths[2]);
    }else {
        $params = loadData($paths[0],$paths[1]);
        $res = call_user_func_array(array($temp,$paths[1]), $params);
    }

    if($res==""){
        $res = ['ok'];
    }

    echo json_encode($res);


    function loadData($className,$functionName){
        $r = new ReflectionMethod($className, $functionName);
        $params = $r->getParameters();
        $ret = [];
        foreach($params as $param){
            $name = $param->getName();
            $ret[count($ret)] = $_POST[$name];
        }
        return $ret;


    }
?>