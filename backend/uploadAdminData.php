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

$conn = new mysqli($servername, $username, $password, $dbname);
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['p_name'];
    $price = $_POST['p_price'];
    $mrp = $_POST['p_mrp'];
    $discount = $_POST['p_discount'];
    $deliveryDate = $_POST['delivery_date'];
    $p_category = $_POST['p_category'];
    $p_description = $_POST['p_description'];
	//$img = $_POST['p_name'];

    // Handle file uploads
    $image_front = $_FILES['image_front'];
    $image_back = $_FILES['image_back'];
    $image_side = $_FILES['image_side'];
    $image_top = $_FILES['image_top'];
    $image_triangle = $_FILES['image_triangle'];

    // Define the upload directory
    $upload_dir = 'ruralx/src/assets/uploads/';

    // Process each image and move to the desired directory
	
	
    $front_image_path = $upload_dir . basename($image_front['name']);
    move_uploaded_file($image_front['tmp_name'], $front_image_path);

    $back_image_path = $upload_dir . basename($image_back['name']);
    move_uploaded_file($image_back['tmp_name'], $back_image_path);

    $side_image_path = $upload_dir . basename($image_side['name']);
    move_uploaded_file($image_side['tmp_name'], $side_image_path);

    $top_image_path = $upload_dir . basename($image_top['name']);
    move_uploaded_file($image_top['tmp_name'], $top_image_path);

    $triangle_image_path = $upload_dir . basename($image_triangle['name']);
    move_uploaded_file($image_triangle['tmp_name'], $triangle_image_path);

    // Now you can save the file paths in your database or perform other actions
    // Example SQL to insert data including image paths:
    $sql = "INSERT INTO product_data (product_name,product_price,product_mrp_price,product_discount,delivery_date, 
            img_front, img_back, img_side, img_top, img_triangle, category, product_description) 
            VALUES ('$name','$price','$mrp','$discount','$deliveryDate','$front_image_path', '$back_image_path',
            '$side_image_path', '$top_image_path', '$triangle_image_path', '$p_category', '$p_description')";

    // Execute the query here and check for success

}

$result = mysqli_query($conn, $sql);
if ($result) {
    echo json_encode(["message" => "Form submitted Successfully"]);
} else {
    echo json_encode(["error" => "Form not submitted", "details" => mysqli_error($conn)]);
}
?>
