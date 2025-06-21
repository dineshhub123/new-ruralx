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
 if ($request != '') {    
 $loginUserFirstname = mysqli_real_escape_string($conn, trim($request->login_u_firstname));
 $loginUserLastname = mysqli_real_escape_string($conn, trim($request->login_u_lastname));
 $loginUserEmail = mysqli_real_escape_string($conn, trim($request->login_u_email));
 $loginUserPhone = mysqli_real_escape_string($conn, trim($request->login_u_phone));
 $loginUserPass = mysqli_real_escape_string($conn, trim($request->login_u_password));

 $shipmentFullname = mysqli_real_escape_string($conn, trim($request->shipment_fullname));
 $shipmentStreetAddress = mysqli_real_escape_string($conn, trim($request->shipment_streetAddress));
 $shipmentCity = mysqli_real_escape_string($conn, trim($request->shipment_city));
 $shipmentState = mysqli_real_escape_string($conn, trim($request->shipment_state));
 $shipmentZipcode = mysqli_real_escape_string($conn, trim($request->shipment_zipcode));
 $shipmentCountry = mysqli_real_escape_string($conn, trim($request->shipment_country));
 $shipmentMobile = mysqli_real_escape_string($conn, trim($request->shipment_mobile));
 $shipmentAdditonalNote = mysqli_real_escape_string($conn, trim($request->shipment_additonalNote));


 $sql = "INSERT INTO shipment_address(login_user_first_name,login_user_last_name,login_user_email,login_user_mobile,login_user_password,shipment_fullname,shipment_streetAddress,shipment_city,shipment_state,shipment_zipcode,shipment_country,shipment_mobile,shipment_additonalNote)
  VALUES ('$loginUserFirstname','$loginUserLastname','$loginUserEmail','$loginUserPhone','$loginUserPass','$shipmentFullname','$shipmentStreetAddress','$shipmentCity','$shipmentState','$shipmentZipcode','$shipmentCountry','$shipmentMobile','$shipmentAdditonalNote')";

  }

$result = mysqli_query($conn,$sql); 
if ($result) {
    
    echo "Form submitted Successfully";
 
} 
else 
{
    echo "Form not submitted";
}
 
?>