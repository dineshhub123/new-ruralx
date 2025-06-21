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
 $id = mysqli_real_escape_string($conn, trim($request->delete_id));
  $sql = "DELETE FROM shipment_address WHERE id = $id";
 }

 $result = mysqli_query($conn,$sql); 
if ($result) {
        echo json_encode(["status" => "success", "message" => "Address Deleted successfully"]);
    } 
    else {
        echo json_encode(["status" => "error", "message" => "Query failed: " . mysqli_error($conn)]);
    }
 
?>