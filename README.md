Install:

```sh
npm install -g https://github.com/cg-tuwien/gitlab-list-logins
gitlab-list-logins --help
```

This command will create a list of login attempts, where each line is an attempt. Each line is tab-separated with (Timestamp, IP address, username, success or fail), e.g.:

```csv
2021-08-13T21:44:29.570Z	1.2.3.4	username	fail
```
