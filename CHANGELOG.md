# Change Log
All notable changes to the "pivotaly" extension will be documented in this file.

## [0.7.2]
#### Added
- Option to view story details of current and backlog stories.

#### Fixed
- Broken view of tasks and blockers in story information view.

## [0.7.1]
#### Fixed
- Validation of project id and token on start.

## [0.7.0]
#### Added
- Option to reinstate a workspace marked as not a Pivotal Tracker Project back to a Pivotal Tracker Project.
- A view of current and backlog stories with an option to start a story from the view or copy its ID.
- Adding or editing story points from story information view.

#### Fixed
- Error when starting an unestimated story.

## [0.6.0]
#### Added
- Add blockers from story information view
- Add tasks from story information view
- Add points per story in member cycle view
- Use regular expression as a branch delimiter
- Community guidelines for contributing

#### Fixed
- Delivering chore causes error

## [0.5.3]
#### Added
- Refresh button for member cycle time
- Automatic refreshing of story details view once story is changed
- Automatic refreshing of member cycle time and story details view once project id is changed

#### Fixed
- Error showing up after marking a workspace as not a pivotal tracker project and checking out to another branch
- Error showing up after opening vs code without a workspace open

## [0.5.2]
#### Fixed
- Cycle time details of some iterations not showing up

## [0.5.1]
#### Fixed
- Installation failures of the extension

## [0.5.0]
#### Added
- Editing of already saved Pivotal Tracker token
- Editing of current project
- Dynamic checking of validity of Pivotal Tracker token
- Total number of points per member on member cycletime card
- Reduced download size

#### Fixed
- Need to reload vscode after marking a workspace as not a Pivotal Tracker project
- Erratic messages in member cycle time card if a story was never started

## [0.4.3]
#### Fixed
- Workspaces marked as not pivotal tracker projects still show pivotaly controls after reloading
- Removed `iterations.forEach is not a function` error message when cycle time data is unavailable

## [0.4.2]
#### Added
- Option to mark a workspace as not a pivotal tracker project

## [0.4.1]
#### Fixed
- Erratic checkout detection
- Removed git hooks symlink

## [0.4.0]
#### Added
- Intuitional flow 
    - Pick project id from a list of projects instead of manually inserting a project id
    - Link a story from a list of stories in the current iteration and backlog instead of manually inserting an id

## [0.3.1]
#### Added
- Courtesy message in the sideview when there is no active story

#### Fixed
- Refresh button in sideview not working when story changes


## [0.3.0]
#### Added
- Story information in the sideview
- View description markdown from the sideview
- Ability to mark tasks as complete or incomplete from the sideview
- Ability to mark blockers as resolved or unresolved from the sideview
- Ability to start, stop, finish, deliver and link a story from the side view


#### Fixed
- Member statistics not showing clearly in dark mode

## [0.2.2]
#### Fixed
- Information notifications not showing

## [0.2.1]
#### Added
- Contributions to views
- Option to pick iteration to view member cycle time for

#### Fixed
- Some git repo workspaces registering as non-repositories

## [0.2.0]
#### Added
- Add cycle time per member

#### Fixed
- Links invalid story id

## [0.1.0]
- Support for workspaces that are not git repos

## [0.0.2]
#### Added
- Error message when not in a git repo

#### Fixed
- Doesn't register different project IDs when switching workspaces 

## [0.0.1]
- Initial release
