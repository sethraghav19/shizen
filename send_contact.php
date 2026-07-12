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
    $contactName = $_POST['contact_name'] ?? 'N/A';
    $contactEmail = $_POST['contact_email'] ?? 'N/A';
    $contactService = $_POST['contact_service'] ?? 'N/A';
    $contactPayload = $_POST['contact_payload'] ?? 'N/A';
    $contactMessage = $_POST['contact_message'] ?? 'N/A';

    $message = "You have received a new Secure Engineering Request from the website.\n\n";
    $message .= "--- CONTACT INFO ---\n";
    $message .= "Name: $contactName\n";
    $message .= "Email: $contactEmail\n\n";
    
    $message .= "--- PROJECT DETAILS ---\n";
    $message .= "Primary Equipment: $contactService\n";
    $message .= "Target Payload: $contactPayload Tons\n";
    $message .= "Project Description & Route Details:\n$contactMessage\n";

    $mail = new PHPMailer(true);

    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host       = 'localhost'; 
        $mail->SMTPAuth   = false;
        $mail->SMTPSecure = false;
        $mail->SMTPAutoTLS = false;
        $mail->Port       = 25;

        // Recipients
        $mail->setFrom('connect@shizengroup.in', 'Shizen Website');
        $mail->addAddress('connect@shizengroup.in', 'Shizen Connect'); // Send to yourself
        $mail->addReplyTo($contactEmail, $contactName);

        // Content
        $mail->isHTML(false);
        $mail->Subject = "New Engineering Request - Shizen Heavy Logistics";
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
