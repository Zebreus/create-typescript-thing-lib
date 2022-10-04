# create-typescript-thing-lib

Library to actually create a typescript project. Future backend for
[`create-typescript-thing`](https://github.com/Zebreus/create-typescript-thing).

# TODO

- [x] Add more tests
- [x] Add logging facility
- [ ] Think about functions for updating existing codebases
  - [x] Centralize package versions
  - [ ] Automatically update package versions (gh actions?)
  - [ ] Move steps to a tag based system
  - [ ] Add information about the project to the project
- [x] Add support for projects without git
- [ ] Automatically find default branch if not specified
- [ ] Make the wizard work offline
- [x] Add function to merge json files
- [ ] Adjust runInDirectory to return a Promise instead of using a callback
