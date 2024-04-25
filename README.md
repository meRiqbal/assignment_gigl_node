A Node Js backend project for simple user signup and login using express
```

git clone https://github.com/nagasai-iitr/GIGL-NODEJS.git
cd GIGL-NODEJS
npm install
```

Make sure you give in the correct details for MySQL database in ```index.js(ln:18:24)```
```
node index.js

```

Signup:

```POST http://localhost:3000/signup```
```
{
    "email": "samplenode@gmail.com",
    "username":"sampleuser",
    "password":"samplepassword"
}
```

Login:

```POST http://localhost:3000/login```
```
{
    "username":"sampleuser",
    "password":"samplepassword"
}
```
