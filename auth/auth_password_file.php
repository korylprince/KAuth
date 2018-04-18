<?php
  //Uses options password_file_location
  //users.list should contain a json encoded list of username/password pairs : {{"User5":"$2y$10$fizPKFBd89xrC98W5gGoTO0xkXrrZKxulgFrf/GHUpTFot3NVBpVG","noPassword":["User6"]}
  //Passwords should be hashed with the password_hash function
  //if an entry contains noPassword:[array of users] then a password is not required for those users and a flag is returned.
  function password_file_auth($username, $password, $options)
  {
      //Check for require password_file_location
      if (!isset($options['password_file_location'])) {
          return array('Login' => 'Fail', 'errorCode' => 1);
      }
      $json = file_get_contents($options['password_file_location']);
      //Check that file exists and has data
      if ($json == false) {
          return array('Login' => 'Fail', 'errorCode' => 2);
      }
      $list = json_decode($json);
      //Check if contents is really json
      if ($list == null) {
          return array('Login' => 'Fail', 'errorCode' => 3);
      }
      $list = get_object_vars($list);
      //If user is in noPassword array authenticate
      if (isset($list['noPassword'])) {
          if (in_array($username, $list['noPassword'])) {
              return array('Login' => 'True', 'flags' => array('noPassword'));
          }
      }
      //Check if username is in list
      if (!isset($list[$username])) {
          return array('Login' => 'None');
      }
      //Check if passwords match
      if (password_verify($password, $list[$username])) {
          return array('Login' => 'True');
      } else {
          return array('Login' => 'None');
      }
  }
?>
