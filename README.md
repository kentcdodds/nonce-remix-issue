# Nonce Remix Issue

In Remix, it doesn't appear to be possible to use React for hydration and have a
`nonce` attribute on script tags without exposing that value to the client which
exposes Remix applications to XSS attacks.

In this example, we're using Express to create the `nonce` value and pass that
in via `getLoaderContext`. Then we use that in our root loader to pass it to our
root element so we can render the scripts and things with the `nonce` value.

We then extract that from the root loader data in our `handleDocumentRequest` so
we can pass it to `renderToPipeableStream` and set it in our CSP header.

Unfortunately, sending the nonce through the loader to the UI means that the
`nonce` value is exposed to the client which exposes us to XSS attacks.

On top of this, it also leads to React hydration warnings (which is why Remix
uses `suspressHydrationWarning` on all its scripts which it really should not
do). Related issue: https://github.com/facebook/react/issues/26028

If you're not streaming, then you could do a fancy find/replace thing on the
generated HTML before sending it to the client. So the nonce could be something
like: `let nonce = typeof document === 'undefined' ? "NONCE_REPLACER" : ""` and
then you do a replaceAll before sending that to the client. However, that won't
work with streaming.

## Suggested Solution

I'm thinking there needs to be a mechanism (maybe specifically for this use
case, or maybe something more general) that allows us to mark values in our
loader as server-only so they never reach the client.

It should be noted that we can't just come up with a solution that works for
Remix components only because people render their own script tags all the time.
So there needs to be a way for people to pass a `nonce` to the server-side React
components in a way that it doesn't get into the client-side data.

## Demo

Feel free to run the demo. It'll pop open a alert if you're vulnerable to XSS.

```sh
npm install
npm run dev
```
