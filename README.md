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

### Elements

```
ELEMENT_DEFAULT = 'p'
ELEMENT_H1 = 'h1'
ELEMENT_H2 = 'h2'
ELEMENT_H3 = 'h3'
ELEMENT_H4 = 'h4'
ELEMENT_H5 = 'h5'
ELEMENT_H6 = 'h6'
ELEMENT_HR = 'hr'
ELEMENT_PARAGRAPH = 'p'
ELEMENT_TAG = 'tag'
ELEMENT_TODO_LI = 'action_item'
ELEMENT_QA_BLOCK = 'agent-based-question'
ELEMENT_ILINK = 'ilink'
ELEMENT_MENTION = 'mention'
ELEMENT_ACTION_BLOCK = 'action-block'
ELEMENT_INLINE_BLOCK = 'inline_block'
ELEMENT_EXCALIDRAW = 'excalidraw'
ELEMENT_MEDIA_EMBED = "media_embed";
ELEMENT_TABLE = "table";
ELEMENT_TH = "th";
ELEMENT_TR = "tr";
ELEMENT_TD = "td";
ELEMENT_CODE_BLOCK = "code_block";
ELEMENT_CODE_LINE = "code_line";
ELEMENT_CODE_SYNTAX = "code_syntax";
ELEMENT_IMAGE = "img";
ELEMENT_LINK = "a";
ELEMENT_MEDIA_EMBED = "media_embed";
ELEMENT_UL = "ul";
ELEMENT_OL = "ol";
ELEMENT_LI = "li";
ELEMENT_LIC = "lic";
ELEMENT_SYNC_BLOCK = 'sync_block' // Probably deprecated
// Marks
MARK_HIGHLIGHT = "highlight";
MARK_BOLD = "bold";
MARK_CODE = "code";
MARK_ITALIC = "italic";
MARK_STRIKETHROUGH = "strikethrough";
```
