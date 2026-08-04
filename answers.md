
# day 10

part 0 check:
1 Customer → create venue → 403 
2 Owner → create venue → 201, ownership comes from token 
3 Owner A → edit Owner B's venue → 403 
all achieved


part 1 check:
Embedding boxes inside venues would make sense because boxes are limited in number and usually read with their venue. However, boxes need to be referenced individually by other collections such as bookings. Therefore, boxes need their own _id and are stored in a separate collection with venue_id referencing the parent venue.

# E-O-D check
