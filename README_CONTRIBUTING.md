# Contributing Code


## First Steps

1) **Phone a friend**: The first step is always to chat up folks on [#green-up][3] on Slack. Visit our channel [here][4] or if it's your first time, get an invitation [here][5].

2) **Get a Dev Environment Running**: We've got a super simple setup working through GitPod - an online, container based development environment that is literally a 1-step setup.

3) **Check the Project Board**: We have our open software tickets organized under [projects](https://github.com/codeforbtv/green-up-app/projects). If you're new to the project, look for those labeled as ['good first issue'](https://github.com/codeforbtv/green-up-app/labels/good%20first%20issue).

4) **Dial Tech Support**: If you have trouble at any point we have a dedicated slack channel for that.  Join the [#tech-support](https://codeforbtv.slack.com/messages/tech-support/) channel and someone will help you out asap.

5) **Get to work!** See [How to Contribute Your Work](#How-to-Contribute-Your-Work) below.

## Environment Setup

### Quickstart: using GitPod

1) **Launch a Gitpod Workspace**: The easiest way to start contributing is by skipping the setup process and using GitPod in your browser by clicking here:
(https://gitpod.io/#https://github.com/codeforbtv/green-up-app). It always takes a few minutes, so do this step first.

2) **Get a Config File**: You won't be able to run the code without a firebase-config.js file. The fastest approach is to use our shared dev environment (..which we share, so please treat it kindly). There is one pinned to the [#green-up Slack channel][3] for our dev environment. If you have trouble finding it, just ask anyone in the channel. Save your firebase-config.js in the root of the project.

3) **Download the Expo App**: The Green Up app is configured to be run on your physical phone inside the Expo mobile app (aka the "Expo Client"). Expo is a shell that runs the unpublished mobile app.
    * [Download for iPhones][1]
    * [Download for Android][2]

4) **Restart Expo**: When the GitPod workspace starts a config file in the project instructs it to install the Green Up app, and then it opens a terminal in the editor, runs the `expo start` command to launch the expo cli. Use `ctrl+c` to kill the cli tool, and type `expo start --host tunnel` to restart it with the new config information.

5) **Profit!** When the giant QR code appears in the editor...
    * **iPhones**: point your camera at the QR code and the app will launch in expo
    * **Android**: open the Expo mobile app and click "Scan QR Code"

    This will open the app on your phone. Now create an account and begin exploring!

### A Full Local Environment

1) **Get a Config File**: You won't be able to run the code without a firebase-config.js file. The fastest approach is to use our shared dev environment (..which we share, so please treat it kindly). There is one pinned to the [#green-up Slack channel][3] for our dev environment. If you have trouble finding it, just ask anyone in the channel. Save your firebase-config.js in the root of the project.

1) **(Optional) Use Your Own Firebase Account**: Setup a Firebase app and use those app settings to configure firebase-config.js,    
Get your own Firebase database here (https://firebase.google.com/) or, if you want to contribute to this project, find us on [Slack][4] and we'll gladly share ours. Not on our Slack board?  [Get an invitation.][5]

2) **Ensure you have `nvm` installed**: Do this by running `nvm ls`. If you see a list of `node` versions printed to your console, then you're all set. Otherwise, follow the [setup instructions](https://github.com/nvm-sh/nvm#installing-and-updating).

3) **Install Project Dependencies**:
```bash
nvm install v10
nvm use v10
npm install
npm install -g expo-cli@3.13.3
npm install -g flow
```

4) **Download the Expo App**: The Green Up app is configured to be run on your physical phone inside the Expo mobile app (aka the "Expo Client"). Expo is a shell that runs the unpublished mobile app.
    * [Download for iPhones][1]
    * [Download for Android][2]

5) **Start the Application**: Run the project in the root folder.

```bash
expo start
```

6) **Profit!** When the giant QR code appears in the editor...
    * **iPhones**: point your camera at the QR code and the app will launch in expo
    * **Android**: open the Expo mobile app and click "Scan QR Code"

    This will open the app on your phone. Now create an account and begin exploring!

## How to Contribute Your Work

To contribute, send us a pull request. Our team will do our best to review it on time and merge it to master.

1. If you're working on an existing issue, assign it to yourself and drag it to the 'In Progress' column in the project it's assigned to.
1. [Create a branch](https://help.github.com/articles/creating-and-deleting-branches-within-your-repository/) from master. If you don't have permissions to create a branch, [fork the repository](https://help.github.com/articles/fork-a-repo/). If the change you're making belongs to an issue, use the issue number as the branch name e.g issue-22
1. Make the changes in your branch.
1. Commit the changes to your branch using a clear and descriptive commit message.
1. Push the changes to your branch.
1. Make sure that your branch has the latest source from the master branch.
1. Create a pull request either [from your fork](https://help.github.com/articles/creating-a-pull-request-from-a-fork/) or [your branch](https://help.github.com/articles/creating-a-pull-request/). Include any relevant information about your changes in the pull request description
1. Address any questions from the pull request
1. Once the pull request has been accepted and merged to master be sure to delete your branch and drag the corresponding issue (if any) to the 'Done' column.

## Code of Conduct

This project has adopted the [Code for BTV Code of Conduct](http://codeforbtv.org/code-conduct).

## Licensing

See the [LICENSE](./LICENSE.md) for information on this project's license.

[1]: https://apps.apple.com/us/app/expo-client/id982107779
[2]: https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=www
[3]: https://codeforbtv.slack.com/messages/green-up/
[4]: https://codeforbtv.slack.com/
[5]: https://cfbtv-slackin.herokuapp.com/
