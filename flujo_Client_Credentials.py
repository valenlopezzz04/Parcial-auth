import http.client

conn = http.client.HTTPSConnection("authparcial.us.auth0.com")

payload = "{\"client_id\":\"gTnuqW0iWnWYYsZJxP4e0BiDfGXZjHQL\",\"client_secret\":\"wNyC4zURxiRs4rEfQJvLPZ1TrLKZ1Pemt6I0C6LN-f4h6kfe93JO-By8ldAgl14D\",\"audience\":\"https://parcial-api\",\"grant_type\":\"client_credentials\"}"

headers = { 'content-type': "application/json" }

conn.request("POST", "/oauth/token", payload, headers)

res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))