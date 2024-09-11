import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';

@Component({
  selector: 'app-chat-new-detailed',
  templateUrl: './chat-new-detailed.component.html',
  animations: [
    trigger('messageAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(50%)', opacity: 0 }),
        animate('0.3s ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0.3s ease-in', style({ transform: 'translateY(50%)', opacity: 0 }))
      ])
    ])
  ],
  styleUrls: ['./chat-new-detailed.component.scss']
})
export class ChatNewDetailedComponent {
  @ViewChild('chatMessages') private chatMessagesContainer!: ElementRef;
  @ViewChild('emojiPicker') emojiPickerRef!: ElementRef;

  // Formulario para manejar el input del chat
  chatForm = new FormGroup({
    message: new FormControl('')
  });

  messages: Array<any> = [];
  replyMessage: any = null;  // Para manejar los mensajes relacionados (reply)
  showEmojiPicker: boolean = false;

  constructor() {}

  // Método para enviar un mensaje
  sendMessage() {
    const messageText = this.chatForm.get('message')?.value;

    if (!messageText) {
      return;
    }

    const newMessage = {
      content: messageText,
      sentByUser: true,  // Para diferenciar entre mensajes enviados y recibidos
      relatedTo: this.replyMessage
    };

    this.messages.push(newMessage);
    this.chatForm.reset();  // Limpiar el input después de enviar

    this.replyMessage = null;  // Resetear el mensaje relacionado

    // Hacer scroll automático
    setTimeout(() => this.scrollToBottom(), 100);

    // Ocultar el emoji picker después de enviar un mensaje
    this.showEmojiPicker = false;
  }

  // Método para agregar un emoji al mensaje
  addEmoji(event: EmojiEvent) {
    const currentText = this.chatForm.get('message')?.value || '';
    const updatedText = currentText + event.emoji.native;  // Añadir el emoji al input
    this.chatForm.get('message')?.setValue(updatedText);
  }

  // Método para manejar el evento de "Enter" para enviar el mensaje
  handleEnter(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();  // Prevenir el salto de línea
      this.sendMessage();  // Enviar el mensaje
    }
  }

  // Método para responder a un mensaje (Reply)
  replyToMessage(message: any) {
    this.replyMessage = message;
  }

  // Método para reenviar un mensaje
  forwardMessage(message: any) {
    const forwardedMessage = {
      content: `${message.content} (Forwarded)`,  // Añadir texto indicando que fue reenviado
      sentByUser: true,
      relatedTo: message.relatedTo || null  // Preservar el mensaje relacionado si lo tiene
    };

    this.messages.push(forwardedMessage);
    this.chatForm.reset();

    setTimeout(() => this.scrollToBottom(), 100);
  }

  // Método para subir un archivo (imágenes, audio, videos, etc.)
  handleFileInput(files: FileList | null) {
    if (files && files.length > 0) {
      const file = files[0];
      const fileMessage = {
        content: file.name,  // Mostramos el nombre del archivo
        file: URL.createObjectURL(file),  // URL para mostrar el archivo
        sentByUser: true,
        relatedTo: this.replyMessage
      };

      this.messages.push(fileMessage);
      this.replyMessage = null;  // Limpiar la respuesta relacionada

      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  // Método para hacer scroll automático hacia el final del chat
  private scrollToBottom() {
    try {
      this.chatMessagesContainer.nativeElement.scrollTop = this.chatMessagesContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error en el scroll automático: ', err);
    }
  }

  // Método para alternar la visibilidad del picker de emojis
  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }
}
