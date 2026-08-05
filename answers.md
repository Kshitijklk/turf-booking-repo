
# day 10

part 0 check:
1 Customer → create venue → 403 
2 Owner → create venue → 201, ownership comes from token 
3 Owner A → edit Owner B's venue → 403 
all achieved


part 1 check:
Embedding boxes inside venues would make sense because boxes are limited in number and usually read with their venue. However, boxes need to be referenced individually by other collections such as bookings. Therefore, boxes need their own _id and are stored in a separate collection with venue_id referencing the parent venue.

part 5:
I chose not to cascade the disabled status to boxes. When a venue is disabled, its boxes keep their existing statuses but become unreachable through the API because the parent venue is disabled. This preserves each box's previous state, so re-enabling a venue does not incorrectly reactivate boxes that had already been individually disabled.
# E-O-D check


1)Boxes are kept in a separate collection because other collections, especially bookings, will need to reference a specific box. having Box as its own document gives every box its own id that bookings can reference, even though boxes are usually read with a venue and there aren't many boxes per venue, the need for other collections to reference individual boxes overrides the reason to embed them

2)When an owner tries to create a Box inside someone else's Venue, requireAuth first verifies that their token is valid, then requireRole("owner") checks that they have the owner role, so both checks pass because they are a valid owner. After that, assertOwnsVenue compares the Venue's box_owner_id with req.user.id; since the Venue belongs to another owner, the IDs don't match and the server returns 403 Forbidden. requireRole("owner") doesn't top them because it only checks whether they are an owner, not whether they are the owner of that specific Venue. 


3)We soft-delete a Box instead of permanently removing it because future bookings may reference that Box using its _id. If the Box were hard-deleted, old bookings could point to a Box that no longer exists, creating a dangling reference. Instead, we change its status to "disabled", which prevents it from being used for new bookings while keeping the Box and its _id available for historical booking records.

