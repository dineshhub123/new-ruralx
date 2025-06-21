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
// $data = json_decode(file_get_contents("php://input"),true);
// $employee_id=$data['1'];
//   //echo "Connected successfully";
//  $sql = "SELECT * FROM product WHERE product_id = {$employee_id}";

$postdata = file_get_contents("php://input",true);
$request = json_decode($postdata);
$name = mysqli_real_escape_string($conn, trim($request->mobileData ));
//$sql = "SELECT * FROM product_data where name like '$name'";

 $sql = "SELECT * FROM product_data WHERE category  = '$name'";
$result = mysqli_query($conn,$sql); 
$myArray = array();
if ($result->num_rows > 0) {
// output data of each row
    while($row = $result->fetch_assoc()) {
        $myArray[] = $row; 
    }
    print json_encode($myArray);
} 
else 
{
    echo "Sorry ,Your search product is not available...!! ";
}
?>