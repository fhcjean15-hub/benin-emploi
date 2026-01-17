<?php

namespace App\Mail;

use App\Models\UsersFormation;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class InscriptionFormationMail extends Mailable
{
    use Queueable, SerializesModels;

    public UsersFormation $inscription;

    /**
     * Create a new message instance.
     */
    public function __construct(UsersFormation $inscription)
    {
        $this->inscription = $inscription;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Nouvelle demande d’inscription à une formation'
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.inscription-formation',
            with: [
                'inscription' => $this->inscription,
            ]
        );
    }

    /**
     * Get the attachments for the message.
     */
    public function attachments(): array
    {
        return [];
    }
}
