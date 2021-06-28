const devNotes = ` 
![git](https://imgs.xkcd.com/comics/git_2x.png)

<img src="https://imgs.xkcd.com/comics/git_2x.png"/>

[xyp](https://www.xypnox.com/)

# Git

- [Notes](#notes)

  - [Fetch all branches from remote](#fetch-all-branches-from-remote)
  - [Checkout a remote branch](#checkout-a-remote-branch)
  - [Add/Delete a remote](#adddelete-a-remote)
  - [Pull from a force pushed/rebased branch remote](#pull-from-a-force-pushedrebased-branch-remote)
  - [Diff of a stash](#diff-of-a-stash)
  - [Delete local branches whose remote branches have been deleted](#delete-local-branches-whose-remote-branches-have-been-deleted)
  - [Squash a branch to merge](#squash-a-branch-to-merge)
  - [Depth 1 clone](#depth-1-clone)
  - [Deleting a branch](#deleting-a-branch)
  - [Check if a branch exists](#check-if-a-branch-exists)
  - [Set a branch to track one at origin](#set-a-branch-to-track-one-at-origin)
  - [Remove a file or folder from staging area](#remove-a-file-or-folder-from-staging-area)
  - [Edit a commit message](#edit-a-commit-message)
  - [Delete a commit](#delete-a-commit)
  - [Renaming a branch in local and remote](#renaming-a-branch-in-local-and-remote)
  - [Bisecting to search for a faulty commit](#bisecting-to-search-for-a-faulty-commit)

- [Learn](#learn)
- [Articles](#articles)
- [Misc](#misc)
- [Cheat Sheet](#cheat-sheet)


- Git hooks - Checks and scripts that run precommit. Can be linters etc.

## Notes

Short commands for prezto: https://github.com/sorin-ionescu/prezto/tree/master/modules/git#git-1

### Fetch all branches from remote

\`git fetch --all\`

### Checkout a remote branch

\`\`\`
git checkout -t <name of remote>/<branch name>
\`\`\`

Ref: https://stackoverflow.com/a/1783426/

### Add/Delete a remote

List all remotes

\`\`\`
git remote -v
\`\`\`

Remove a remote

\`\`\`
git remote remove <origin>
\`\`\`

Add a remote

\`\`\`
git remote add <origin> <https://github.com/xypnox/example.git>
\`\`\`

### Pull from a force pushed/rebased branch remote

\`\`\`
git fetch origin
git reset --hard origin/<master> # Destroys your work
\`\`\`

To preserve changes in the branch see: Ref: https://stackoverflow.com/a/14787801/

### Diff of a stash

\`\`\`
git stash show -p
\`\`\`

### Delete local branches whose remote branches have been deleted

Delete all tracking branches whose remote equivalent no longer exists. That is, when the branch has been deleted on the remote, remove it from local repo. The deletion is done usually after the branch has been merged into the master.

\`\`\`bash
git fetch -p && for branch in $(git for-each-ref --format '%(refname) %(upstream:track)' refs/heads | awk '$2 == "[gone]" {sub("refs/heads/", "", $1); print $1}'); do git branch -D $branch; done
\`\`\`

For an alias:


Ref: <https://stackoverflow.com/a/33548037/>

### Squash a branch to merge

Use the command \`git merge --squash <branch>\` to squash the commits of \`<branch>\` and add it to the staging area. Then you can commit those changes regularly. Do note that squashing creates a different commit hash so hashes cannot be used to track merged status of the branch.

### Depth 1 clone

\`git clone --depth 1 <URL>\`

Clone repos with depth 1 if you want to start contributing/committing now and don't particularly care about the history. (Great for one-off contributions)

Saves time, is faster and less data is transferred esp. with large projects.

### Deleting a branch

\`git branch -d <branch>\` - delete a branch that has been merged.
\`git branch -D <branch>\` - delete a branch that has/has not been merged.
\`git push --delete origin <branch>\` - delete a branch on remote

### Check if a branch exists

\`git branch --list\` can be used to list all the branches and then grep over them, if you know the name of the branch beforehand then use:

\`git show-ref refs/heads/<branch>\`

This will return the hash of the head pointer of the branch if it exists, or exit with error code 1.

### Set a branch to track one at origin

Creating and pushing a new branch works but pulling it or viewing the pushed status requires setting up a tracking branch.

For the first time push use:

\`git push -u origin <branch>\`

This will track your \`<branch>\`

For setting up a general branch to track one at origin, use:

\`git branch -u origin/<branch>\`

### Remove a file or folder from staging area

If you need to remove a single file from the staging area, use

\`git reset HEAD -- <file>\`

If you need to remove a whole directory (folder) from the staging area, use

\`git reset HEAD -- <directoryName>\`

Ref: https://stackoverflow.com/a/1505968/

### Gitignore

[[dev.git.ignore]]

### Edit a commit message

**Most Recent Commit:**

\`\`\`bash
git commit --amend
\`\`\`

[Ref: so](https://stackoverflow.com/a/179147)

**An older Commit**

Interactive rebase allows you to edit any message you want to update even if it's not the latest message.

\`\`\`bash
# n is the number of commits up to the last commit you want to be able to edit
git rebase -i HEAD~n
\`\`\`

If the commit is the very first one you can also do:

\`\`\`bash
git rebase -i --root
\`\`\`

1. \`git rebase --interactive $parent_of_flawed_commit\`

2. In the editor \`pick\` -> \`reword\` for commits you want to fix.
   After save, Git will replay the listed commits.

3. Git will ask you for new commit messages for the listed commits one by one.
   Or if you are in shell you can do:
   \`git commit --amend\`
   \`git rebase --continue\`

[Ref: so](https://stackoverflow.com/a/180085)

### Delete a commit

To delete the \`N\` recent commits

\`\`\`bash
git reset --hard HEAD~N
\`\`\`

or reset to a commit hash:

\`\`\`bash
git reset --hard <sha1-commit-id>
\`\`\`

Then force pushing will also update the remote and delete the commit there as well.

### Renaming a branch in local and remote

\`\`\`bash
git branch -m old_branch new_branch         # Rename branch locally
git push origin :old_branch                 # Delete the old branch
git push --set-upstream origin new_branch   # Push the new branch, set local branch to track the new remote
\`\`\`

### Bisecting to search for a faulty commit

Ref: https://git-scm.com/docs/git-bisect#_basic_bisect_commands_start_bad_good

Mark at least two commits, one good, one bad, and the rest is handled by git bisect.

\`\`\`bash
$ git bisect start
$ git bisect bad                 # Current version is bad
$ git bisect good v2.6.13-rc2    # v2.6.13-rc2 is known to be good
\`\`\`

It picks the commit in the middle and we check and say if it is good or bad via \`git bisect good/bad\`, and it will narrow down the commit which introduced a bug.

Also see: [[Git Bisect|blog.yes-it-exists#git-bisect]]

## Learn

<https://git-scm.com/book/en/v2>

<https://learnxinyminutes.com/docs/git/>

<http://travisjeffery.com/b/2012/02/search-a-git-repo-like-a-ninja/>

<https://eagain.net/articles/git-for-computer-scientists/>

## Articles

<https://chris.beams.io/posts/git-commit/>

## Misc

Quick disaster management guide for git: https://ohshitgit.com/

## Cheat Sheet

<https://github.github.com/training-kit/downloads/github-git-cheat-sheet.pdf>

<http://justinhileman.info/article/git-pretty/git-pretty.png>

<http://ndpsoftware.com/git-cheatsheet.html>

<https://res.cloudinary.com/hy4kyit2a/image/upload/SF_git_cheatsheet.pdf>

<http://jonas.nitro.dk/git/quick-reference.html>
`;

export default devNotes;
