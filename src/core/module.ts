import { Router } from "express";

export interface AppModule {
  name: string;
  path: string;
  router: Router;
}
