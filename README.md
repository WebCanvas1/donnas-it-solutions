# Donna’s IT Solutions

React + TypeScript + Vite website.

## Development

```sh
npm ci
npm run dev
```

## Validation

```sh
npm run typecheck
npm run lint
npm run build
```

## Cloudflare Pages

Connect this repository, select `main`, use build command `npm run build`, and output directory `dist`. The project root is the repository root. No environment variables are currently required. Future pushes to main can trigger automatic deployments.

## Outstanding functionality

The pickup form currently only displays a local success message; enquiries are not sent or stored. Connect an enquiry service before relying on this form in production.
