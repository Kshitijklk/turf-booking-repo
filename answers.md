
# day 5 part 2(2.2)

The loop approach starts becoming inefficient as the collection grows into the thousands or
tens of thousands of documents because every request loads the entire collection into Node.
js memory. The first noticeable symptom is slower response time and increassed memory usage, 
since the application fetches multiple documents only to discard most of them. MongoDB queries are much better because the filtering happens inside the database before any data is sent to the application.