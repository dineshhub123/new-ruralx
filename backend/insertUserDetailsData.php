<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Credentials: true');
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Content-Type: application/json; charset=UTF-8");
$servername = "localhost";
$username   = "root";
$password   = "";
$dbname     = "userdatabase";
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 
 $postdata = file_get_contents("php://input",true);
 $request = json_decode($postdata);
 $firstname = mysqli_real_escape_string($conn, trim($request->u_firstname));
 $lastname = mysqli_real_escape_string($conn, trim($request->u_lastname));
 $email = mysqli_real_escape_string($conn, trim($request->u_email));
 $phone = mysqli_real_escape_string($conn, trim($request->u_phone));
 $password = mysqli_real_escape_string($conn, trim($request->u_password));
 $address = mysqli_real_escape_string($conn, trim($request->u_address));
 $pincode = mysqli_real_escape_string($conn, trim($request->u_pincode));
//$imgTop = addcslashes(file_get_contents($_FILES["image_top"]["tmp_name"]));

 $sql = "INSERT INTO userDetails_data(user_first_name,user_last_name,user_email,user_phone,user_password,user_address,user_pincode)
  VALUES ('$firstname','$lastname','$email','$phone','$password','$address','$pincode')";
 
    // $authdata = [
    // 'name' => $name,
    // 'price' => $price,
    // ];
    // echo json_encode($authdata);

$result = mysqli_query($conn,$sql); 
if ($result) {
    
    echo "Form submitted Successfully";
 
} 
else 
{
    echo "Form not submitted";
}
 
?>