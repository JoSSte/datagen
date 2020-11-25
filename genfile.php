<?php

/**
 * Generates a file of arbritary size
 */

define("TYPE_TEXT", "text/plain");
define("TYPE_BINARY", "application/octet-stream");

$gettype = filter_input(INPUT_GET, 'type', FILTER_SANITIZE_STRING);
$length = filter_input(INPUT_GET, 'length', FILTER_VALIDATE_INT, array("options" => array(
    "default" => 0
)));

if (ini_set('memory_limit', -1) === false) {
    error_log("cannot set memory limit");
  }

//$memlimit = ini_get('memory_limit');
//if ($length > $memlimit) {
//    http_response_code(404);
//    header("Content-Type: " . TYPE_TEXT);
//    die("Memory limit of $memlimit exceeded. Please adjust parameters");
//}

switch ($gettype) {
    default:
        die( "This file generates files or arbritary sizes. Provide GET parameters type(text/binary) & length to customize");
        break;
    case 'text':
        header("Content-Type: text/plain");
        header("Content-Length: $length");
        header("Content-Disposition: attachment; filename=\"randomtext$length.bin\"");
        ob_end_flush();
        for ($i = 0; $i < $length; $i++) {
            //echo chr(random_int(65, 122));
            echo "0";
        }
        break;
    case 'binary':
        TYPE_BINARY;
        header("Content-Type: application/octet-stream");
        header("Content-Length: $length");
        header("Content-Disposition: attachment; filename=\"randomdata$length.bin\"");
        echo random_bytes($length);
        break;
}



