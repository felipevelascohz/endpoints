import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';

interface EndpointConfig {
    vpc: string | ec2.IVpc;
    service: string[];
}

export class Endpoints extends cdk.Stack {
    constructor(scope: Construct, id: string, config:EndpointConfig, props?: cdk.StackProps) {
        super(scope, id , props)
        
        
        if (typeof config.vpc === 'string'){
            var vpc = ec2.Vpc.fromLookup(this, 'ImportVpc', { 
                isDefault: false,
                vpcId: config.vpc
            });
        } else {
            var vpc = config.vpc
        };
        
        const sg = new ec2.SecurityGroup(this, 'VpcEndpointsSG', {
            vpc,
            allowAllOutbound: false,
            securityGroupName: 'VpcEndpointsSG'
          });
  
          sg.addIngressRule(ec2.Peer.ipv4(vpc.vpcCidrBlock), ec2.Port.tcp(443), 'Allow VPC');
  
          sg.addEgressRule(ec2.Peer.ipv4(vpc.vpcCidrBlock), ec2.Port.allTraffic(), 'Allow all to VPC')

        for (var i = 0; i < config.service.length; i++) {
            var endpoint = new ec2.InterfaceVpcEndpoint(this, config.service[i], {
                vpc,
                service: new ec2.InterfaceVpcEndpointService('com.amazonaws.' + process.env.CDK_DEFAULT_REGION + '.' + config.service[i], 443),
                subnets: {
                    availabilityZones: [ 
                        process.env.CDK_DEFAULT_REGION + 'a', 
                        process.env.CDK_DEFAULT_REGION + 'b', 
                        process.env.CDK_DEFAULT_REGION + 'c' 
                    ]
                },
                privateDnsEnabled: true,
                securityGroups: [sg]
            });

            new cdk.CfnOutput(this, config.service[i] + ' Id', {
                value: endpoint.vpcEndpointId,
                description: 'Id of the endpoint ' + config.service[i]
            });

            new cdk.CfnOutput(this, config.service[i] + ' Dns', {
                value: cdk.Fn.select(0, endpoint.vpcEndpointDnsEntries),
                description: 'Dns of the endpoint ' + config.service[i]
            });

        };
        new cdk.CfnOutput(this, 'sgId', {
            value: sg.securityGroupId,
            description: 'Id of sg'
        });
    }
}