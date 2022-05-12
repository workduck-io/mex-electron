# Mex

Using https://github.com/electron-react-boilerplate/electron-react-boilerplate.

## Notes

- When updating Electron version, ensure you change the Node ABI version in the build scripts and forge config. For reference: https://www.npmjs.com/package/electron-releases

## APIs

- https://jsapi.apiary.io/previews/varungarg/reference/

- Get all username with array of userids

```
curl --location --request POST 'https://3jeonl1fee.execute-api.us-east-1.amazonaws.com/user/all' \
--header 'Authorization: Bearer TOKEN' \
--header 'Content-Type: application/json' \
--data-raw '{
"tag" : "MEX",
"userIds" : ["84164cba-074c-4ba8-b1b7-d5957dccecc2", "84164cba-074c-4ba8-b1b7-ecc2"]
}'
```

- Get UserId by email

```
curl --location --request GET 'https://3jeonl1fee.execute-api.us-east-1.amazonaws.com/user/email/rishivikram+1000@workduck.io' \
--header 'Authorization: Bearer TOKEN' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "heloo",
    "name": "rishi",
    "tag": "demo"
}'
```
