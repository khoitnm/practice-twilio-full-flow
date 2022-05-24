After some experiments, I found that using Prism with Twilio API Spec may be convenient, but not fully good enough to support many business logic.
For example, it cannot support Twilio pagination:
When getting a page of Conversations, the result will be like this:
```
{..."url":"http://example.com",...}
```
So, when the Twilio SDK try to get the data in the current page, or next page, or previous page, it'll call request to `http://example.com`, and hence will get error.
So I don't really recommend this approach for a real production application at all.