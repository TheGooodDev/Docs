# Procédure install surreal DB

---

## Docker

### Windows

---

Install `wsl`

```shell
wsl --install
```

see what distribution wsl use

```shell
wsl -l
```

Upgrade wsl to version 2 

```shell
wsl --set-version <distribution name> 2
```

Install docker desktop : [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Linux

---

Update the `apt` package index and install packages to allow `apt` to use a repository over HTTPS:

```shell
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg
```

Add Docker’s official GPG key:

```shell
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
```

Use the following command to set up the repository:

```shell
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

Install Docker

```shell
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```



## Install Node

---

run

```shell
sudo apt install nodejs
node -v
sudo apt install npm
```



## Install SurrealDb

---

Create a `docker-compose.yml` file

```dockerfile
version: '3'

services:
  surrealdb:
    image: surrealdb/surrealdb:latest
    container_name: surrealdb
    restart: always
    command: start --user "user" --pass "password" file:/data/database.db
    ports:
      - 8000:8000
    volumes:
      - ./data:/data
```

```shell
docker compose up -d
```

Now you have a SurrealDb container that run.



Install Node Dependencies :

```shell
npm install --save surrealdb.js
```



# Connection Javascript

---

```javascript
const { default: Surreal } = require('surrealdb.js');

const db = new Surreal('http://localhost:8000/rpc');

async function main() {

	try {
		await db.signin({
			user: '',
			pass: '',
		});
	} catch (e) {
		console.error('ERROR', e);
	}
	db.close().then(()=>{
		console.log("Close")
	})
}

main();

```
Import CSV

---

```javascript
const fs = require("fs");
const { parse } = require("csv-parse")

let tab = ["title","name","adress","realAdress","departement","country","tel","email"]
await fs.createReadStream("./contacts.csv")
      .pipe(parse({ delimiter: ",", from_line: 2 }))
      .on("data", async function (row) {
        let obj = {};
        row.forEach((element,i) => {
          obj[tab[i]] = element;
        });
        await db.create("restaurants", obj);
      });;
```


