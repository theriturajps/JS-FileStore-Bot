# JS-FileStore-Bot

## Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/theriturajps/JS-FileStore-Bot)

> Domain name will be generated after successful deployment, so there is no way to input `BOT_DOMAIN` during deploying
    
> Click `Promote to Production` to trigger deployment

## Important Environment's and Variables

- `COPY_MESSAGE` = __active__ or __not active__
- `PUBLIC_CHANNEL` = __-100123456789__
- `PUBLIC_CHANNEL_MODE` = __on__ or __off__
- `BOT_DOMAIN` = __https://***************.vercel.app__ (must include "https://")
- `DB_CHANNEL` = __-100**********__
- `BOT_TOKEN` = __AA*******:ab**********************hj__
- `BOT_USERNAME` = Enter bot username (eg. __riturajpsbot__)


> `COPY_MESSAGE`, `PUBLIC_CHANNEL`, `PUBLIC_CHANNEL_MODE`, `BOT_DOMAIN`, `DB_CHANNEL`, `BOT_TOKEN`, `BOT_USERNAME`

## Run in terminal

1. To set webhook

    ```
    curl -F "url={BOT_DOMAIN}/api/riturajps" "https://api.telegram.org/bot{BOT_TOKEN}/setWebhook"
    ```

2. To Retrieve Single file

    ```
    https://t.me/{BOT_USERNAME}?start=id_1
    ```
3. To Retrieve Batch file

    ```
    https://t.me/{BOT_USERNAME}?start=id_1_3
    ```

# Thank You

**Do Fork our repo/project :-**