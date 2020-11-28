<?php

/**
 * Generates a file of arbritary size
 */
$gettype = filter_input(INPUT_GET, 'type', FILTER_SANITIZE_STRING);
$length = filter_input(INPUT_GET, 'length', FILTER_VALIDATE_INT, array("options" => array(
    "default" => 0
)));

if (ini_set('memory_limit', -1) === false) {
    error_log("cannot set memory limit");
  }

switch ($gettype) {
    default:
        die( "This file generates files or arbritary sizes. Provide GET parameters type(text/binary) & length to customize");
        break;
    case 'text':
        header("Content-Type: text/plain");
        header("Content-Disposition: attachment; filename=\"randomtext$length.txt\"");
        $data = "";
        $start = microtime(1);
        $data = substr(base64_encode(random_bytes($length)),0,$length);     
        break;
    case 'binary':
        header("Content-Type: application/octet-stream");
        header("Content-Disposition: attachment; filename=\"randomdata$length.bin\"");
        $start = microtime(1);
        $data = random_bytes($length);
        break;
}

header("Content-Length: $length");
header("Server-Timing: gen;dur=" . (round(microtime(1) - $start, 5)) );
echo $data;

