## Description

Reverse proxy for serving the front and backend.
Performs SSL termination.

## Development

Build with `make`.

## SSL
### Create certificate

Create free certificate with [LetsEncrypt](https://letsencrypt.org).

```bash
certbot certonly --manual --preferred-challenges dns -d '*.example.com' -m example@mail.com
```

The certificate will be available in: `/etc/letsencrypt/live/example.com/`

### Renew certificate

LetsEncrypt only allows certificates for 90 days so the above command needs to be run again to renew the certificate.