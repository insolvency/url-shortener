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