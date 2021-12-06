import * as cdk from '@aws-cdk/core';
import {Artifact, Pipeline} from "@aws-cdk/aws-codepipeline";
import {CodeBuildAction, GitHubSourceAction} from "@aws-cdk/aws-codepipeline-actions";
import {SecretValue} from "@aws-cdk/core";
import {BuildSpec, LinuxBuildImage, PipelineProject} from "@aws-cdk/aws-codebuild";

export class PipelineStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const pipeline = new Pipeline(this, "Pipeline", {
            pipelineName: "Pipeline",
            crossAccountKeys: false
        })

        const sourceOutput = new Artifact("SourceOutput")
        pipeline.addStage({
            stageName: 'Source',
            actions: [
                new GitHubSourceAction({
                    actionName: "Source",
                    owner: "patrickdronk",
                    repo: "aws-pipeline",
                    branch: "main",
                    oauthToken: SecretValue.secretsManager("github-token"),
                    output: sourceOutput
                })
            ]
        })

        const buildOutput = new Artifact("BuildOutput")
        pipeline.addStage({
            stageName: "codeBuild",
            actions: [
                new CodeBuildAction({
                    actionName: "Build",
                    input: sourceOutput,
                    outputs: [buildOutput],
                    project: new PipelineProject(this, "build", {
                        environment: {
                            buildImage: LinuxBuildImage.STANDARD_5_0
                        },
                        buildSpec: BuildSpec.fromSourceFilename('build-specs/cdk-build-spec.yml')
                    })
                })
            ]
        })
    }
}
