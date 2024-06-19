# JS-FileStore-Bot

![GitHub repo size](https://img.shields.io/github/repo-size/theriturajps/JS-FileStore-Bot?style=plastic) ![GitHub language count](https://img.shields.io/github/languages/count/theriturajps/JS-FileStore-Bot?style=plastic) ![GitHub top language](https://img.shields.io/github/languages/top/theriturajps/JS-FileStore-Bot?style=plastic) ![GitHub last commit](https://img.shields.io/github/last-commit/theriturajps/JS-FileStore-Bot?color=red&style=plastic)


## Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/theriturajps/JS-FileStore-Bot)

> Domain name will be generated after successful deployment, so there is no way to input `BOT_DOMAIN` during deploying
    
> Click `Promote to Production` to trigger deployment

## Important Environment's and Variables

```
// Define your variables here (Important)
const BOT_TOKEN = '***********:*****************************';
const DB_CHANNEL = '-100***********';
const BOT_DOMAIN = 'https://***********.vercel.app';
const PUBLIC_CHANNEL = '-100**********';
const PUBLIC_CHANNEL_MODE = 'off';
const COPY_MESSAGE = 'deactivate';
```

## Run in terminal

1. To set webhook

    ```
    curl -F "url=[BOT_DOMAIN]/api/riturajps" "https://api.telegram.org/bot[BOT_TOKEN]/setWebhook"
    ```

2. To Retrieve Single file

    ```
    https://t.me/TheGetBot?start=id_1
    ```
3. To Retrieve Batch file

    ```
    https://t.me/TheGetBot?start=id_1_3
    ```

# Thank You

**Do Fork our repo/project :-**