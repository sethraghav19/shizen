<?php
header('Content-Type: application/json');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require 'phpmailer/Exception.php';
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Retrieve fields
    $cargoName = $_POST['cargo_name'] ?? 'N/A';
    $cargoWeight = $_POST['cargo_weight'] ?? 'N/A';
    $cargoLength = $_POST['cargo_length'] ?? 'N/A';
    $cargoWidth = $_POST['cargo_width'] ?? 'N/A';
    $cargoHeight = $_POST['cargo_height'] ?? 'N/A';
    $routeOrigin = $_POST['route_origin'] ?? 'N/A';
    $routeDest = $_POST['route_dest'] ?? 'N/A';
    $routeObstacles = $_POST['route_obstacles'] ?? 'None';
    $contactName = $_POST['contact_name'] ?? 'N/A';
    $contactEmail = $_POST['contact_email'] ?? 'N/A';
    $ecoPriority = $_POST['eco_priority'] ?? 'N/A';
    $timeline = $_POST['timeline'] ?? 'N/A';

    $message = "You have received a new quote request from the website.\n\n";
    $message .= "--- CONTACT INFO ---\n";
    $message .= "Name: $contactName\n";
    $message .= "Email: $contactEmail\n\n";
    
    $message .= "--- CARGO INFO ---\n";
    $message .= "Type: $cargoName\n";
    $message .= "Weight: $cargoWeight MT\n";
    $message .= "Dimensions: L:$cargoLength x W:$cargoWidth x H:$cargoHeight meters\n\n";
    
    $message .= "--- ROUTING & LOGISTICS ---\n";
    $message .= "Origin: $routeOrigin\n";
    $message .= "Destination: $routeDest\n";
    $message .= "Known Obstacles: $routeObstacles\n";
    $message .= "Eco-Priority: $ecoPriority\n";
    $message .= "Timeline: $timeline\n";

    $mail = new PHPMailer(true);

    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host       = 'smtpout.secureserver.net'; // GoDaddy SMTP server
        $mail->SMTPAuth   = true;
        $mail->Username   = 'connect@shizengroup.in';
        $mail->Password   = 'YOUR_EMAIL_PASSWORD_HERE'; // <--- REPLACE THIS IN GODADDY FILE MANAGER
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = 465;

        // Recipients
        $mail->setFrom('connect@shizengroup.in', 'Shizen Website');
        $mail->addAddress('connect@shizengroup.in', 'Shizen Connect'); // Send to yourself
        $mail->addReplyTo($contactEmail, $contactName);

        // Content
        $mail->isHTML(false);
        $mail->Subject = "New Quote Request - Shizen Heavy Logistics";
        $mail->Body    = $message;

        $mail->send();
        echo json_encode(["status" => "success"]);
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => "Message could not be sent. Mailer Error: {$mail->ErrorInfo}"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request"]);
}
?>
