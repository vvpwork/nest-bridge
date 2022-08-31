export interface IConfig {
  db: {
    host: string;
    port: number;
    password: string;
    name: string;
    username: string;
    dialect: string;
  };
}
