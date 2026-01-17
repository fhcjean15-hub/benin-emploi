<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Nouvelle inscription</title>
</head>
<body style="font-family: Arial, sans-serif; background:#f9fafb; padding:20px;">

<div style="max-width:600px;margin:auto;background:#ffffff;padding:20px;border-radius:8px;">
    <h2 style="color:#15803d;">📚 Nouvelle demande d’inscription</h2>

    <p>Une nouvelle inscription a été effectuée.</p>

    <hr>

    <p><strong>Formation :</strong> {{ $inscription->formation->titre ?? '—' }}</p>
    <p><strong>Nom :</strong> {{ $inscription->nom }}</p>
    <p><strong>Prénom :</strong> {{ $inscription->prenom }}</p>
    <p><strong>Email :</strong> {{ $inscription->email }}</p>
    <p><strong>Téléphone :</strong> {{ $inscription->contact }}</p>
    <p><strong>Montant :</strong> {{ number_format($inscription->montant, 0, ',', ' ') }} FCFA</p>

    <hr>

    <p style="font-size:12px;color:#6b7280;">
        Message automatique – Benin emploi +
    </p>
</div>

</body>
</html>
