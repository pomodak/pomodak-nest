import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';
import { validateConfig } from '../../utils/validate-config';
import { GoogleConfig } from './auth-google-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  GOOGLE_CLIENT_ID: string;

  @IsString()
  GOOGLE_CLIENT_SECRET: string;

  @IsString()
  GOOGLE_CALLBACK_URI: string;

  @IsString()
  ANDROID_GOOGLE_CLIENT_ID: string;

  @IsString()
  IOS_GOOGLE_CLIENT_ID: string;
}

export default registerAs<GoogleConfig>('google', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackUri: process.env.GOOGLE_CALLBACK_URI,
    androidClientId: process.env.ANDROID_GOOGLE_CLIENT_ID,
    iosClientId: process.env.IOS_GOOGLE_CLIENT_ID,
  };
});
