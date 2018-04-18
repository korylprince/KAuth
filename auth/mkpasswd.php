<?php
if( php_sapi_name() != 'cli' ) die('');
print password_hash($argv[1], PASSWORD_BCRYPT)."\n";
?>
