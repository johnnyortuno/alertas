import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptDecryptService {

  private passKey = "Kq.35%n#Haz0.!E";

  constructor() { }

  set(keys, value) {
    var promise = new Promise<string>((resolve, reject) => {
      var key = CryptoJS.enc.Utf8.parse(keys);
      var iv = CryptoJS.enc.Utf8.parse(keys);
      var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key, {
          keySize: 128 / 8,
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
      });
      resolve(encrypted.toString());
    });
    return promise;
  }

  get(keys, value) {
    var promise = new Promise<string>((resolve, reject) => {
      var key = CryptoJS.enc.Utf8.parse(keys);
      var iv = CryptoJS.enc.Utf8.parse(keys);
      var decrypted = CryptoJS.AES.decrypt(value, key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      resolve(decrypted.toString(CryptoJS.enc.Utf8));
    });
    return promise;
  }

  getPassKey(): string {
    return this.passKey;
  }
}
