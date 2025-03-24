import { BadRequestException, Injectable } from "@nestjs/common";
import * as process from "node:process";
import { s3Client } from "../config/aws.config";
import { Upload } from '@aws-sdk/lib-storage';
import * as dotenv from "dotenv"
dotenv.config();

@Injectable()
export class S3Service {
    private readonly bucketName : string = process.env.AWS_S3_BUCKET_NAME || "";

    async uploadFile(file: Express.Multer.File, key: string): Promise<string> {
        try {
          if (!file.buffer && !file.stream) {
            throw new BadRequestException('File buffer and stream are undefined');
          }

          const body = file.buffer || file.stream;
          const upload = new Upload({
            client: s3Client,
            params: {
              Bucket: this.bucketName,
              Key: key,
              Body: body,
              ContentType: file.mimetype,
            },
          });
    
          await upload.done();
    
          return `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
        } catch (error) {
          console.log(error);
          throw new BadRequestException('Failed to upload file');
        }
      }
}