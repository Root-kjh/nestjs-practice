import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }
    return value;
  }

  isDevelopment() {
    return this.getValue('NODE_ENV', false) === 'development';
  }

  getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.getValue('DATABASE_HOST'),
      port: 3306,
      username: this.getValue('DATABASE_USERNAME'),
      password: this.getValue('DATABASE_PASSWORD'),
      database: 'n-t',
      entities: [__dirname + `/**/*.entity{.ts,.js}`],
      migrationsTableName: 'migrations',
      migrations: [__dirname + `/**/migrations/*{.ts,.js}`],
      ssl: !this.isDevelopment(),
    };
  }
}
