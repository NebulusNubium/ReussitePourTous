# Configuration Email

## Configuration actuelle
Le formulaire est configuré pour utiliser Gmail SMTP mais nécessite :

1. **Un compte Gmail valide**
2. **Un mot de passe d'application Google**

## Configuration rapide pour les tests

### Option 1: Utiliser Gmail (recommandé pour la production)
1. Créer un compte Gmail dédié : `noreply.reussitepourtous@gmail.com`
2. Activer la validation en 2 étapes
3. Générer un mot de passe d'application
4. Remplacer les identifiants dans `contact-form.php`

### Option 2: Configuration temporaire pour les tests
Je peux configurer un service SMTP gratuit temporaire pour les tests.

### Option 3: Simulation d'envoi (pour développement)
Sauvegarder les messages dans un fichier local au lieu de les envoyer.

## Instructions détaillées

### Pour Gmail :
1. Allez sur https://myaccount.google.com/security
2. Activez "Validation en 2 étapes"
3. Générez un "Mot de passe d'application"
4. Utilisez ce mot de passe dans le code

### Variables à modifier dans contact-form.php :
```php
$mail->Username   = 'votre-email@gmail.com';
$mail->Password   = 'votre-mot-de-passe-application';
```

# Configuration Gmail - Mot de passe d'application

## 🔐 Instructions détaillées pour créer un mot de passe d'application Gmail

### Étape 1 : Activer la validation en 2 étapes
1. Allez sur https://myaccount.google.com/security
2. Cherchez "Validation en 2 étapes" 
3. Cliquez sur "Commencer" si pas encore activé
4. Ajoutez votre numéro de téléphone et suivez les instructions

### Étape 2 : Créer le mot de passe d'application
1. Une fois la validation en 2 étapes activée, retournez sur https://myaccount.google.com/security
2. Cherchez "Mots de passe d'application" (App passwords)
3. Cliquez dessus (vous devrez peut-être vous reconnecter)
4. Sélectionnez "Autre (nom personnalisé)"
5. Tapez "Formulaire Contact Site Web"
6. Cliquez sur "Générer"
7. **COPIEZ IMMÉDIATEMENT** le mot de passe de 16 caractères (ex: abcd efgh ijkl mnop)

### Étape 3 : Mettre à jour le code
Dans le fichier `contact-form.php`, remplacez :
```php
$mail->Password = 'REMPLACEZ-PAR-VOTRE-MOT-DE-PASSE-APP';
```

Par :
```php
$mail->Password = 'votre-mot-de-passe-de-16-caracteres';
```

### ⚠️ Important
- N'utilisez PAS votre mot de passe Gmail normal
- Le mot de passe d'application est différent et unique
- Une fois généré, vous ne pouvez plus le revoir
- Format typique : 4 groupes de 4 lettres (ex: abcd efgh ijkl mnop)

### 🧪 Test
Après configuration, testez le formulaire - vous devriez voir :
"Votre message a été envoyé avec succès !"
