## mongoDB data modeling 

## sports
1-decision: standalone
2-why: sports are unique values and are reused by multiple slots and venues. The value depends upon bookings and venue so making them standalone characters avoids duplicatin same values (4.4 B)
3-concern: deleting or altering a sport value requires checking if any other documents are still referencing it 

## customers
1-decision: standalone
2-why: customers are independent userrs of the system, one customer can have may bookings and the their info can change without making any changes to the booking document (4.4 B)
3-concerns:

## box owners
1-decision: standalone
2-why: owner too is an independent entity and have a one to many realtion with businesses, separating owner info avoids duplication (4.4 B)
3-concerns:removing an owner data can affect the other owned business

## attempts
1-decision: standalone
2-why: accidental clicks and wrong choices leads the user to make multiple attempts, crowding the attempts that we actually need (4.4 B)
3-concerns: due to these accidental clicks, the number of useless attempts may flood the DB, bifercating and cleaning them is required

## business
1-decision: standalone
2-why: customers are independent userrs of the system, one customer can have may bookings and the their info can change without making any changes to the booking document (4.4 B)
3-concerns:


## venues
1-decision: standalone
2-why: venues have their own different information, slots and timings and venue data is volatile and used by other collections like bookings (4.4 B)
3-concerns: since venue name can be changed overtime, historical booking data must be immutable


## boxes
1-decision: standalone
2-why:boxes can have unlimited bookings overtime and can be referenced by multiple sports and it has its own independent vakues like maintainance status, price, name etc (4.4 B)
3-concerns: sinces boxes are being referenced by bookings and venues, deleting them can be difficult

## box_sport_mapping
1-Decision: Standalone collection
2-Why: This collection represents a many-to-many relationship between boxes and sports. Since both sides are shared by multiple values 
3-: Duplicate mappings should be prevented

## bookings
1-Decision: Standalone collection with embedded snapshot fields
2-Why: Bookings increase continuously, so embedding them inside customers or boxes would create unbounded documents
3-Concerns: Care must be taken to keep embedded snapshot data consistent at booking creation time. Future changes to customers or venues should not modify historical booking records

## payments
1-Decision: Standalone collection
2-Why: Each payout belongs to a business or owner but is generated independently and continues growing over time
3-Concerns: Financial records should never be deleted, and proper auditing should be maintained

## payouts_calculations 
1-Decision: Embed into payouts
2-Why: The calculation details belong only to one payout, are read together with that payout, and remain relatively small
3-Concerns: If calculation details become very large or require independent updates, they may need to be moved into a separate collection later



## Q1 — businesses.box_owner_id is an array of owner IDs
Answer:
The best approach is to create a separate "business_owners" collection with one document for each business-owner pair
Queries:
to how every business this owner belongs to
->Find all documents where owner_id = O1
to show every owner of this business
->Find all documents where business_id = B1

to delete a an onwer only one document with the specific owner's value needs to be touced

## Q2 — venues.venue_timing is a jsonb blob

Answer:
venue_timing should be embedded inside the venue document

Why?
According to Rule 4.4, data should be embedded when it:
is read together with the parent, is bounded in size and, belongs to exactly one parent

venue_timing satisfies all three conditions

Every venue has only one schedule, the schedule is always needed when viewing a venue,the schedule has a fixed number of entries (7 days per week), so it cannot grow indefinitely

## Q3 — box_sport_mapping.time_slot_prices

number of price parings
48 half hour slots
7 days per week

therefore, 48*7= 336

estimated byte size:
1 entry ≈ 100 bytes

Total size:
336 × 100 = 33,600 bytes
≈ 33 KB

MongoDB maximum document size:
16 MB
= 16 × 1024 × 1024
= 16,777,216 bytes

Difference:
16,777,216 − 33,600
≈ 16,743,616 bytes
≈ 15.97 MB remaining

The document is far below the 16 MB limit.

Yes, embedding is still the right choice because the data is bounded, belongs to exactly one box_sport_mapping document, and is well below MongoDB's 16 MB limit.
During a booking, the application performs a price check for the selected day and time slot in case it differs. It only needs one of the 336 entries, not all of them.

## Q4 — bookings references five collections but embeds customer_details

customer_details is embedded even though customer_id is referenced because,
some users can make a booking without having a customer account.
 In those cases, there is no customer_id, so the booking must store the customer's name, phone number, email, and other details directly, and Historical Records Must Be Immutable consideration from Rule 4.4, a booking should preserve the customer's information as it was at the time of booking. Even if the customer later updates their name, phone number, or email, the old booking should still display the original details. Embedding customer_details provides this snapshot while customer_id still links to the current customer record. 

