[![Build Status](https://travis-ci.com/brayovsky/pivotaly.svg?branch=master)](https://travis-ci.com/brayovsky/pivotaly) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/0ef47d66521d4d22b8612679e746acf3)](https://www.codacy.com/project/Andela-eugene/pivotaly/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=brayovsky/pivotaly&amp;utm_campaign=Badge_Grade_Dashboard) [![Coverage Status](https://coveralls.io/repos/github/brayovsky/pivotaly/badge.svg?branch=master)](https://coveralls.io/github/brayovsky/pivotaly?branch=master)

# Pivotaly

Pivotaly enables you to keep your work in sync with pivotal tracker without having to switch between the applications. Start, stop, finish and deliver stories that you are working on right from vscode.

## Features
- View story details
    View details of the story you are working on - description, id, name, type, story state, tasks and blockers

- Start stories

    Mark a story as started
- Unstart stories

    Mark a story as unstarted. Implemented as `stop story`
- Finish stories

    Mark a story as finished
- Deliver stories

    Mark a story as delivered
- Deliver and undeliver tasks

    Mark tasks as complete or incomplete
- Resolve and unresolve blockers

    Mark blockers as resolved or unresolved
- Link stories
    
    Assign a story to a git branch

- Member cycle time
    
    View cycle time per members per iteration



#
#### Change story state
![Change Story State](images/features/start-story.gif)

#
#### View member cycle time
![View Member Cycle Time](images/features/cycle-time.gif)


## Requirements

#### 1. Git (Optional)
Pivotaly can rely on git branches for an efficient flow. i.e. Pivotaly assumes a single pivotal tracker story corresponds to a single git branch.

A story id is prepended or appended to a git branch to link a story to a branch automatically. e.g `ft-edit-read-me-345` will assume `345`  is the story id.

#### 2. Pivotal tracker API token
Pivotaly requires an API token for private pivotal tracker boards.

## Extension Settings

Pivotaly contributes the following settings:

* `pivotaly.protectedBranches`: Array of git branches that are ideally not feature branches e.g. `master`. Pivotaly will not attempt to link a story to git branches added.

* `pivotaly.branchDelimiter`: Delimiter string or RegExp to use to retrieve story ID. e.g. set to `'-'` to get id `345` from `ft-edit-read-me-345` or `'_'` to get `345` from `ft-edit-read-me_345`  or `[\/-]` to get `678` from `feature/678-read-me`

## Known Issues

Pivotaly may not track check-outs from bare repositories as expected.

## Release Notes
[Changelog](CHANGELOG.md)

## Setting up
See set up instructions in [contributing.md](CONTRIBUTING.md)
