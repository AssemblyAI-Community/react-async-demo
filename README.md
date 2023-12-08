# AssemblyAI Async Transcription in React

## Setup

To run this demo app, you'll first need a few tools to get your dev environment set up. The first, and most important, is [Homebrew](https://brew.sh/), the third-party package manager for macOS. You can find the installation command there, which you can run in a Terminal window.

Then you can install [Node](https://formulae.brew.sh/formula/node). Running the command found in the link will automatically install the latest Node.js version on your system, which this project is compatible with.

After Homebrew and Node are installed and ready, you'll need to install [Yarn](https://formulae.brew.sh/formula/yarn).

Once you've got those three prerequisites, you're ready to build the project and run it locally!

## Running the Demo App

To run this demo app, navigate to where you cloned this repo to and at the top level of the directory, run `yarn install`. Once this has finished, run `yarn client` in one terminal window and `yarn server` in another to start up the front-end and back-end, respectively.

## Linking your AssemblyAI API Key

You'll likely notice upon first trying to use the demo app that you're not authenticated. In case you haven't already, you can sign up for an AssemblyAI account [here](https://www.assemblyai.com/dashboard/signup) and find your API key on your [account dashboard](https://www.assemblyai.com/app/account).

Copy the `.env.example` file and name it `.env`, then copy your API key and replace the `"YOUR_API_KEY"` placeholder in `.env`. This will make sure that you're able to use the API and monitor the status of all of your requests in your [processing queue](https://www.assemblyai.com/app/processing-queue) on your dashboard. Now you're ready to experiment with our async API!

## Further Customization

Considering this demo is open-source and you can modify the API requests, feel free to explore our [documentation](https://www.assemblyai.com/docs) and learn more about the different parameters that you can send to the async API. You can also customize the kind of output you're expecting depending on your needs.

Thank you for checking out this demo, and if you have any questions, don't hesitate to reach out to us at support@assemblyai.com. Best of luck!
