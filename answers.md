
# day 5 part 2(2.2)

The loop approach starts becoming inefficient as the collection grows into the thousands or
tens of thousands of documents because every request loads the entire collection into Node.
js memory. The first noticeable symptom is slower response time and increassed memory usage, 
since the application fetches multiple documents only to discard most of them. MongoDB queries are much better because the filtering happens inside the database before any data is sent to the application.

E-O-D check
q1) 
When the request comes to the server, Express matches it with the GET /sports route and calls the getSports() function. The controller reads the query parameters like status, sport_name, sort, and page. It creates a filter, sorting option, and pagination values. Then it sends the query to MongoDB. MongoDB returns the matching sports, the controller prepares the response, and finally sends it back to the client as JSON.

q2) If we filter in MongoDB, the database only sends the matching records to the server. If we fetch everything first, MongoDB sends all the records, and then Node.js has to check each one using a loop. This uses more memory, more processing, and transfers more data. That's why filtering in the database is better.

q3) The old "Cricket" record is still in the database, only its status is changed to disabled. If sport_name is unique, MongoDB treats it as an existing sport and gives a duplicate key error. So the API returns a 409 Conflict saying the sport already exists. Whether this is correct depends on the project requirements. In many cases, it is better to reactivate the disabled sport instead of creating a new one.