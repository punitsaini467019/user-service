import { DataSourceOptions } from 'typeorm';

export const data: () => DataSourceOptions = () => {
  return {
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 3001,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [__dirname + '/../**/*.entity.js'],
    synchronize: false,
    migrationsRun: true,
    migrations: ['dist/db/migrations/*{.ts,.js}'],
  };
};
