<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Credentials: true');
header("Access-Control-Allow-Methods:POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Content-Type: application/json; charset=UTF-8");

// Database connection
$servername = "localhost";
$username   = "root";
$password   = "";
$dbname     = "userdatabase";
 
$conn = new mysqli($servername, $username, $password, $dbname);
 
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$postdata = file_get_contents("php://input",true);
$decoded = json_decode($postdata);
// Insert data
$sql = $conn->prepare("INSERT INTO userbuyer_data (user_first_name,user_last_name, user_email, user_phone,user_password,user_address,user_pincode,product_name,product_price,product_mrp_price,product_discount,delivery_date,img_front,category) VALUES (?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?,?)");
$sql->bind_param("ssssssssssssss",$fname,$lname,$email,$phone,$pass,$address,$pincode,$pname,$pprice,$pmrp,$pdiscount,$pdeliverydate,$pimgfront,$pcategory);

$inserted = 0;
foreach ($decoded as $item) {
 print_r($item);
 $fname =  $conn->real_escape_string($item->u_firstname);
 $lname =  $conn->real_escape_string($item->u_lastname);
 $email = $conn->real_escape_string($item->u_email);
 $phone = $conn->real_escape_string($item->u_phone);
 $pass = $conn->real_escape_string($item->u_password);
 $address = $conn->real_escape_string($item->u_address);
 $pincode = $conn->real_escape_string($item->u_pincode);
 $pname = $conn->real_escape_string($item->p_name);
 $pprice = $conn->real_escape_string($item->p_price);
 $pmrp = $conn->real_escape_string($item->p_mrp);
 $pdiscount = $conn->real_escape_string($item->p_discount);
 $pdeliverydate = $conn->real_escape_string($item->delivery_date);
 $pimgfront = $conn->real_escape_string($item->image_front);
 $pcategory = $conn->real_escape_string($item->p_category);

 if ($sql->execute()) {
    $inserted++;
}
   //$sql = "INSERT INTO userbuyer_data (user_first_name, user_email, user_phone) VALUES ('$name', '$email', $phone)";
}

//$result = mysqli_query($conn,$sql); 

$sql->close();
$conn->close();

echo json_encode([
    "success" => true,
    "message" => "$inserted records inserted successfully"
]);
 
?>