## Running

### Pre-requisites
Install `nodejs`. Instructions for [Ubuntu](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions).

Install `@angular/cli`:
```bash
sudo npm install -g @angular/cli
```

### Local environment


```bash
yarn install --pure-lockfile
yarn start
```

### Production build

```bash
yarn build
cd dist
tar -cvzf expense-tracker-<version>.tgz *
```