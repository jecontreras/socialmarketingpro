import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as RecordRTC from 'recordrtc';
import * as lamejs from 'lamejs';

@Injectable({
  providedIn: 'root'
})
export class AudioRecorderServiceService {
  mediaRecorder: MediaRecorder | null = null;
  chunks: Blob[] = [];
  recorder: any;
  private audioBlob: Blob | null = null;

  constructor(private http: HttpClient) { }

  startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      this.recorder = new RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/mp3', // Cambia a 'audio/mp3' si quieres grabar directamente en mp3
        desiredSampRate: 128000, // 128kbps
      });
      this.recorder.startRecording();
    });
  }

  stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      this.recorder.stopRecording(() => {
        const blob = this.recorder.getBlob();
        resolve(blob);
      });
    });
  }

  uploadAudio(audioBlob: Blob): Promise<void> {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.mp3'); // Cambia 'audio.mp3' si grabaste en otro formato
    return this.http.post<void>(`${environment.urlFile}/archivos/audioRecorder`, formData).toPromise();
  }

  /*startRecording(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          const options = {
            mimeType: 'audio/webm; codecs=opus',
            audioBitsPerSecond: 160000, // 160 kbps
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
    return new Promise<Blob>((resolve, reject) => {
      if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
        this.mediaRecorder.addEventListener('stop', () => {
          const audioBlob = new Blob(this.chunks, { type: 'audio/webm' });
          this.chunks = [];
          resolve(audioBlob);
        });

        this.mediaRecorder.stop();
      } else {
        reject('No recording in progress');
      }
    });
  }*/

  /*uploadAudio(audioBlob: Blob): Promise<void> {
    console.log("*******130", audioBlob)
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.ogg');
    return this.http.post<void>(`${environment.urlFile}/archivos/audioRecorder`, formData).toPromise();
  }*/
}
