export interface IConfig {
  port: number;
  nodeEnv: 'development' | 'production' | 'test';
  triggerTime: string;
  db: {
    host: string;
    port: number;
    password: string;
    database: string;
    username: string;
    dialect: any;
  };
}
