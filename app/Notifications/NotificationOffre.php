<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NotificationOffre extends Notification
{
    use Queueable;

    public $message;
    public $url;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $message, string $url = null)
    {
        $this->message = $message;
        $this->url = $url;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        // Stockage en base + email si nécessaire
        return ['database', 'mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $mail = (new MailMessage)
                    ->subject('Nouvelle offre disponible !')
                    ->line($this->message);

        if ($this->url) {
            $mail->action('Voir l’offre', $this->url);
        }

        return $mail->line('Merci de votre confiance.');
    }

    /**
     * Get the array representation of the notification (pour la base de données).
     */
    public function toArray(object $notifiable): array
    {
        return [
            'message' => $this->message,
            'url' => $this->url,
            'type' => 'offre',
        ];
    }
}
