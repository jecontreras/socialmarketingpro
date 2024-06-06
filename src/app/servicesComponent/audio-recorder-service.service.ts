import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AudioRecorderServiceService {
  mediaRecorder: MediaRecorder | null = null;
  chunks: Blob[] = [];

  constructor(private http: HttpClient) {}

  startRecording(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          const options = {
            mimeType: 'audio/webm; codecs=opus', // Cambiado a un tipo MIME compatible
            audioBitsPerSecond: 192000 // Ajustar la tasa de bits a 192 kbps
          };
          this.mediaRecorder = new MediaRecorder(stream, options);
          this.mediaRecorder.start();
          this.mediaRecorder.ondataavailable = (e) => {
            this.chunks.push(e.data);
          };
          resolve();
        })
        .catch((err) => {
          console.error('Error accessing microphone:', err);
          reject(err);
        });
    });
  }

  stopRecording(): Promise<Blob> {
    return new Promise<Blob>((resolve) => {
      if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
        this.mediaRecorder.addEventListener('stop', () => {
          const audioBlob = new Blob(this.chunks, { type: 'audio/webm' });
          this.chunks = [];
          resolve(audioBlob);
        });

        this.mediaRecorder.stop();
      } else {
        resolve(null);
      }
    });
  }

  uploadAudio(audioBlob: Blob): Promise<void> {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.webm');
    return this.http.post<void>(`${environment.urlFile}/archivos/audioRecorder`, formData).toPromise();
  }
}
