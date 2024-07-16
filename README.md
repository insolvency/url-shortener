# URL Shortener

Simple URL shortener for ShareX

## Example ShareX Config

```json
{
  "Version": "14.1.0",
  "Name": "Url Shortener",
  "DestinationType": "URLShortener",
  "RequestMethod": "POST",
  "RequestURL": "http://localhost:3000/shorten",
  "Headers": {
    "Authorization": "secret"
  },
  "Body": "JSON",
  "Data": "{\"url\": \"{input}\"}",
  "URL": "{json:shortened}"
}
```

# Running using docker

## Using Docker Compose

```console
docker compose up --build -d
```

## Using Docker CLI

```console
docker build . --tag url-shortener:v1 --target final
docker run -d \
  --name=url-shortener \
  -e PORT=3000 \
  -e BASE_URL=http://localhost:3000/ \
  -e SHORTEN_LENGTH=10 \
  -e SECRET=secret \
  -e DATASOURCE_PROVIDER=memory \
  -p 3000:3000 \
  url-shortener:v1
```