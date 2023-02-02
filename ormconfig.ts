import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'humanscape',
    database: 'nest',
    synchronize: false,
    entities: [__dirname + `/**/*.entity{.ts,.js}`],
    migrations: [__dirname + `/**/migrations/*{.ts,.js}`],
    migrationsTableName: 'migrations',
})