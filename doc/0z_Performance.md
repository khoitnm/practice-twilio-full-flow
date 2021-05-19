# How whatApp run so fast

## Filter out negative 
Use Bloom filter: 
> In exchange for the occasional false positive (i.e. It says a word was in your chat history when it wasn't) 
> it guarantees no false negatives and is super fast and small. 
> So you do a quick bloom filter look up and then if it does say the word was in your history you do the more expensive search.

https://www.reddit.com/r/learnprogramming/comments/6723mw/whatsapp_search_how_does_it_filter_out_negatives/dgno9ut/

## Load conversations so fast
How do messaging apps (e.g., WhatsApp/Telegram) work so fast?
High level answer: https://www.quora.com/How-do-messaging-apps-e-g-WhatsApp-Telegram-work-so-fast

A big picture architectural explanation: http://highscalability.com/blog/2014/2/26/the-whatsapp-architecture-facebook-bought-for-19-billion.html

Design:
- One on One communication: https://blog.usejournal.com/whatsapp-system-design-and-chat-messaging-architecture-part-1-29fb4f0d14af
- https://www.passionatestar.com/whatsapp-system-design/
  
- More detail design:
    - https://www.youtube.com/watch?v=L7LtmfFYjc4
    - [https://medium.com/codingurukul/whatsapp-engineering-inside-1-1ef4845ff784](./0z_whatsapp/WhatsApp-Engineering%20Inside-1.%20Real%20Time%20messaging%20are%20now%20an…%20_%20by%20Suraj%20Kumar%20_%20CodinGurukul%20_%20Medium.pdf) 
    - [https://medium.com/codingurukul/whatsapp-engineering-inside-2-bdd1ec354748](./0z_whatsapp/WhatsApp-Engineering%20Inside-2.%20In%20“WhatsApp-Engineering%20Inside-1”%20we…%20_%20by%20Suraj%20Kumar%20_%20CodinGurukul%20_%20Medium.pdf)

- Anton Lavrik - Lead of WhatsApp Erlang Team: https://codesync.global/speaker/anton-lavrik/