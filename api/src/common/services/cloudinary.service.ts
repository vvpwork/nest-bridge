/* eslint-disable @typescript-eslint/typedef */
import { v2 as cloudinaryV2 } from 'cloudinary';
import { createReadStream } from 'streamifier';
import { config } from '../config';
import { ICloudinaryUploadFileResponseData } from '../interfaces';

const { name, apiKey, apiSecret } = config.cloudinary;

export class CloudinaryService {
  private iclInstance: typeof cloudinaryV2;
  constructor() {
    this.iclInstance = cloudinaryV2;
    this.iclInstance.config({
      cloud_name: name,
      api_key: apiKey,
      api_secret: apiSecret,
    });
  }

  private async streamUpload(file: Express.Multer.File): Promise<any> {
    return new Promise((resolve, reject) => {
      const stream = this.iclInstance.uploader.upload_stream((error: Error, result: any) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      });
      createReadStream(file.buffer).pipe(stream);
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<ICloudinaryUploadFileResponseData> {
    return this.streamUpload(file);
  }
}
