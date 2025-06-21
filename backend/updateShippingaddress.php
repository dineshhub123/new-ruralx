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
 $id = mysqli_real_escape_string($conn, trim($request->shipment_id));
 $shipmentFullname = mysqli_real_escape_string($conn, trim($request->shipment_fullname));
 $shipmentStreetAddress = mysqli_real_escape_string($conn, trim($request->shipment_streetAddress));
 $shipmentCity = mysqli_real_escape_string($conn, trim($request->shipment_city));
 $shipmentState = mysqli_real_escape_string($conn, trim($request->shipment_state));
 $shipmentZipcode = mysqli_real_escape_string($conn, trim($request->shipment_zipcode));
 $shipmentCountry = mysqli_real_escape_string($conn, trim($request->shipment_country));
 $shipmentMobile = mysqli_real_escape_string($conn, trim($request->shipment_mobile));
 $shipmentAdditonalNote = mysqli_real_escape_string($conn, trim($request->shipment_additonalNote));

 $sql = "UPDATE shipment_address SET 
          shipment_fullname='$shipmentFullname', 
          shipment_streetAddress='$shipmentStreetAddress',
          shipment_city='$shipmentCity',
          shipment_state='$shipmentState',
          shipment_zipcode='$shipmentZipcode',
          shipment_country='$shipmentCountry',
          shipment_mobile='$shipmentMobile',
          shipment_additonalNote='$shipmentAdditonalNote'
          WHERE id=$id";
  }

$result = mysqli_query($conn,$sql); 
if ($result) {
        echo json_encode(["status" => "success", "message" => "Form submitted successfully"]);
    } 
    else {
        echo json_encode(["status" => "error", "message" => "Query failed: " . mysqli_error($conn)]);
    }
 
?>