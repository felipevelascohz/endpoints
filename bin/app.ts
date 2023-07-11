#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { Endpoints } from '../src/endpoints';

const iniciativa :string = 'IdSbxFelipeVelascoEndpoints';
const provider = {
  account: process.env.CDK_DEFAULT_ACCOUNT, 
  region: process.env.CDK_DEFAULT_REGION 
};

const app = new cdk.App();


new Endpoints(app, iniciativa, {
  vpc: '',
  service: ['ecr.api', 'ecr.dkr'],
  },
  {
    env: provider
  });

  app.synth();
