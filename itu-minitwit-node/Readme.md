# Itu MiniTwit App

Project description....

## Prerequisites

Start by installing the latest Node.js :

https://nodejs.org/en/download/

Also downloading and installing Docker:

https://www.docker.com/get-started/

## Installing

Once you have Node.js installed, clone this repository by opening it in the Github desktop client or via command line:

```
git clone https://github.com/ingrid-mc/DevOps-group_s.git
```

While you're in the project root directory, install all package dependencies:
```
npm install
```

## Running locally 
To serve the application locally on http://localhost:3000/, run the following command on the terminal:
```
npm start
```

## Containerize

To build an image in Docker, make sure that Docker is running in your computer, and run the following command from the path `/itu-minitwit-node/`:

```
docker build -t itu-minitwit-node .
```

Then you can find the image with name `itu-minitwit-node` listed as a Docker image by running the following command:
```
docker images
```
To build and run a container with the same name from image `itu-minitwit-node`, run the following command:
```
docker run  -d --name itu-minitwit-node -p 3000:3000 itu-minitwit-node
```

Now the application should be accesible in: 

http://localhost:3000/

## Running as virtual machine with Vagrant and Virtual Box

## Deploy to DigitalOcean

## Running the cypress tests 

You can run the cypress tests either open or closed. Use ``npm run cy:open`` to run through a browser and seeing the emulator, or use ``npm run cy:closed`` to just run the tests in the command line. 
