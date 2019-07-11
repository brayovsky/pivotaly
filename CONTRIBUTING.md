# Contributing

👍🎉 Thanks for taking the time to contribute! 👍🎉
Before contributing, please first discuss the changes you wish to make via an issue. You may raise a new issue or pick up an existing one. Either way, indicate that you are working on that in the issue comments.

## Steps
### 1. Get the code
Fork and clone your fork of the repository

Prerequisites
- [Git](https://git-scm.com)
- [NodeJs](https://nodejs.org/en/), >= 8.9.1
- [npm](https://npmjs.com)


### 2. Dependencies
From a terminal, where you have cloned the repository, execute the following command to install the required dependencies:

```
npm install --no-save
```

### 3. Build extension
When developing, you can use a watcher to make builds on changes quick and easy. Run the following command to make builds while developing.

```
npm run watch
```

To make a production build, run:

```
npm run bundle
```

### 4. Debug extension
To run and debug the extension while developing:
- Open the code inside Visual Studio Code.
- Ensure all dependencies are installed.
- Start the `watch` task.
- Choose `Debug Pivotaly` launch configuration from the launch dropdown in the Debug viewlet and press `F5`

### 4. Testing
To run tests, run:

`npm test`

### 5. Submitting a Pull Request
- Create an issue or indicate you are working on an existing issue.
- Submit a pull request from your fork to the `develop` branch.
  - Use future tense for git commit messages.
  - Reference the issue the PR is fixing in the description
  - Follow the [PR template](PULL_REQUEST_TEMPLATE.md)
