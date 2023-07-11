# AWS Endpoints Stack lib

Library created by:

- Name: Felipe Velasco

## Usage

Code example:

``` typescript
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import * as endpoints from '@felipevelascohz/endpoints';
const iniciativa :string = 'IdSbxFelipeVelasco';
const provider = {
  account: process.env.CDK_DEFAULT_ACCOUNT, 
  region: process.env.CDK_DEFAULT_REGION 
};
const app = new cdk.App();
new Endpoints(app, iniciativa, {
  vpc: string | ec2.IVpc,
  service: ['ecr.api', 'ecr.dkr'],
  },{env: provider});
  app.synth();
```
