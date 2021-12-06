import {App, Stack} from "@aws-cdk/core";
import {Budget} from "../../lib/constructs/budget";
import {SynthUtils} from "@aws-cdk/assert";
// import {expect, haveResource, haveResourceLike} from "@aws-cdk/assert";

test("Budget construct", () => {
    const app = new App();
    const stack = new Stack(app, "Stack")

    new Budget(stack, "Budget", {
            budgetAmount: 1,
            emailAddress: "patrickdronk@me.com"
        }
    )

    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
})