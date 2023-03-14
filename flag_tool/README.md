# How to dockerize the flag tool to test locally
With Docker service up in your local machine:
### Build Image:
`docker build -t <image-name> <Dockerfile path>` 
```
docker build -t flag-tool .
```
### Create container and run it

`docker run --name <container-name> <image-name>`

```
docker run --name flag-tool flag-tool tail -f /dev/null
```

### Execute a flag command
`docker exec <container-name> <root path> <...arguments>`
```
docker exec flag-tool ./flag_tool f 123
```