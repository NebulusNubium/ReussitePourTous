<?php
session_start();
require_once 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Generate CSRF token if not exists
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

$message = '';
$error = '';

if ($_POST) {
    // Verify CSRF token
    if (!hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'] ?? '')) {
        $error = 'Token de sécurité invalide. Veuillez réessayer.';
    } else {
        // Sanitize and validate inputs - Fixed deprecated FILTER_SANITIZE_STRING
        $name = htmlspecialchars(trim($_POST['name'] ?? ''), ENT_QUOTES, 'UTF-8');
        $email = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
        $object = htmlspecialchars(trim($_POST['object'] ?? ''), ENT_QUOTES, 'UTF-8');
        $messageContent = htmlspecialchars(trim($_POST['message'] ?? ''), ENT_QUOTES, 'UTF-8');

        // Validation
        if (empty($name) || empty($email) || empty($object) || empty($messageContent)) {
            $error = 'Tous les champs sont obligatoires.';
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $error = 'Adresse email invalide.';
        } else {
            // Send email using PHPMailer
            $mail = new PHPMailer(true);

            try {
                // Server settings
                $mail->isSMTP();
                $mail->Host       = 'smtp.gmail.com';
                $mail->SMTPAuth   = true;
                $mail->Username   = 'noreply.reussitepourtous@gmail.com';
                $mail->Password   = 'ebul kbsi qyxn luxs';
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                $mail->Port       = 587;
                $mail->CharSet    = 'UTF-8';

                // Recipients
                $mail->setFrom('noreply.reussitepourtous@gmail.com', 'Site Web Martial KNOPFER');
                $mail->addAddress('martialknopfer@gmail.com', 'Martial KNOPFER');
                $mail->addReplyTo($email, $name);

                // Content
                $mail->isHTML(false);
                $mail->Subject = 'Nouveau message de contact: ' . $object;

                // Create email body with proper formatting
                $emailBody = "Nouveau message reçu depuis le site web\n";
                $emailBody .= "=====================================\n\n";
                $emailBody .= "Nom: " . $name . "\n";
                $emailBody .= "Email: " . $email . "\n";
                $emailBody .= "Objet: " . $object . "\n";
                $emailBody .= "Date: " . date('d/m/Y à H:i:s') . "\n\n";
                $emailBody .= "Message:\n";
                $emailBody .= "--------\n";
                $emailBody .= $messageContent . "\n\n";
                $emailBody .= "=====================================\n";
                $emailBody .= "Ce message a été envoyé depuis le formulaire de contact du site web de Martial KNOPFER.";

                $mail->Body = $emailBody;

                $mail->send();

                // AUSSI sauvegarder en local comme backup
                $logMessage = "=== NOUVEAU MESSAGE (ENVOYÉ) ===\n";
                $logMessage .= "Date: " . date('d/m/Y à H:i:s') . "\n";
                $logMessage .= "Nom: " . $name . "\n";
                $logMessage .= "Email: " . $email . "\n";
                $logMessage .= "Objet: " . $object . "\n";
                $logMessage .= "Message: " . $messageContent . "\n";
                $logMessage .= "Status: EMAIL ENVOYÉ AVEC SUCCÈS\n";
                $logMessage .= "================================\n\n";

                $logFile = 'messages_contact.txt';
                file_put_contents($logFile, $logMessage, FILE_APPEND | LOCK_EX);

                $message = 'Votre message a été envoyé avec succès ! Je vous répondrai dans les plus brefs délais.';
                $_POST = array();

            } catch (Exception $e) {
                // En cas d'erreur d'envoi, sauvegarder quand même le message
                $logMessage = "=== NOUVEAU MESSAGE (ERREUR EMAIL) ===\n";
                $logMessage .= "Date: " . date('d/m/Y à H:i:s') . "\n";
                $logMessage .= "Nom: " . $name . "\n";
                $logMessage .= "Email: " . $email . "\n";
                $logMessage .= "Objet: " . $object . "\n";
                $logMessage .= "Message: " . $messageContent . "\n";
                $logMessage .= "Erreur: " . $mail->ErrorInfo . "\n";
                $logMessage .= "=====================================\n\n";

                $logFile = 'messages_contact.txt';
                file_put_contents($logFile, $logMessage, FILE_APPEND | LOCK_EX);

                $error = "Une erreur s'est produite lors de l'envoi du message. Cependant, votre message a été sauvegardé et je le recevrai. Erreur: {$mail->ErrorInfo}";
            }
        }
    }
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact - Martial KNOPFER</title>
    <link rel="stylesheet" href="assets/css/main.css">
    <style>
        .contact-form {
            max-width: 600px;
            margin: 2rem auto;
            padding: 2rem;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: #333;
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
        }

        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
        }

        .form-group textarea {
            min-height: 120px;
            resize: vertical;
        }

        .btn-submit {
            background: #007bff;
            color: white;
            padding: 0.75rem 2rem;
            border: none;
            border-radius: 4px;
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .btn-submit:hover {
            background: #0056b3;
        }

        .alert {
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 4px;
        }

        .alert-success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }

        .alert-error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }

        .back-link {
            display: inline-block;
            margin-bottom: 2rem;
            color: #007bff;
            text-decoration: none;
        }

        .back-link:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <a href="index.html" class="back-link">← Retour à l'accueil</a>

        <div class="contact-form">
            <h1>Formulaire de Contact</h1>
            <p>Contactez-moi pour réserver un cours ou poser une question.</p>

            <?php if ($message): ?>
                <div class="alert alert-success"><?php echo htmlspecialchars($message); ?></div>
            <?php endif; ?>

            <?php if ($error): ?>
                <div class="alert alert-error"><?php echo htmlspecialchars($error); ?></div>
            <?php endif; ?>

            <form method="POST" action="">
                <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars($_SESSION['csrf_token']); ?>">

                <div class="form-group">
                    <label for="name">Nom complet *</label>
                    <input type="text" id="name" name="name" value="<?php echo htmlspecialchars($_POST['name'] ?? ''); ?>" required>
                </div>

                <div class="form-group">
                    <label for="email">Email *</label>
                    <input type="email" id="email" name="email" value="<?php echo htmlspecialchars($_POST['email'] ?? ''); ?>" required>
                </div>

                <div class="form-group">
                    <label for="object">Objet *</label>
                    <select id="object" name="object" required>
                        <option value="">Choisissez un objet</option>
                        <option value="Réservation cours" <?php echo ($_POST['object'] ?? '') === 'Réservation cours' ? 'selected' : ''; ?>>Réservation de cours</option>
                        <option value="Cours français" <?php echo ($_POST['object'] ?? '') === 'Cours français' ? 'selected' : ''; ?>>Cours de français</option>
                        <option value="Cours maths" <?php echo ($_POST['object'] ?? '') === 'Cours maths' ? 'selected' : ''; ?>>Cours de mathématiques</option>
                        <option value="Cours anglais" <?php echo ($_POST['object'] ?? '') === 'Cours anglais' ? 'selected' : ''; ?>>Cours d'anglais</option>
                        <option value="Soutien scolaire" <?php echo ($_POST['object'] ?? '') === 'Soutien scolaire' ? 'selected' : ''; ?>>Soutien scolaire</option>
                        <option value="Préparation bac" <?php echo ($_POST['object'] ?? '') === 'Préparation bac' ? 'selected' : ''; ?>>Préparation au bac</option>
                        <option value="Question générale" <?php echo ($_POST['object'] ?? '') === 'Question générale' ? 'selected' : ''; ?>>Question générale</option>
                        <option value="Autre" <?php echo ($_POST['object'] ?? '') === 'Autre' ? 'selected' : ''; ?>>Autre</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="message">Message *</label>
                    <textarea id="message" name="message" placeholder="Décrivez votre demande, le niveau de l'élève, vos disponibilités, etc." required><?php echo htmlspecialchars($_POST['message'] ?? ''); ?></textarea>
                </div>

                <button type="submit" class="btn-submit">Envoyer le message</button>
            </form>
        </div>
    </div>
</body>
</html>
