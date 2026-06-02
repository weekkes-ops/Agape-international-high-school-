# Security Specification - Agape Experemental High School

## Data Invariants
1. A **User** profile can only be created by the user themselves (on first login) or an admin. Users cannot change their own roles.
2. **Results** can only be created/updated by 'teacher' or 'admin' roles. Students can only read their own results.
3. **Payments** can only be created/updated by 'admin' role. Students can only read their own payments.
4. **Announcements** are publicly readable, but only writeable by 'admin' or 'teacher' roles.
5. All IDs must match `^[a-zA-Z0-9_\-]+$`.

## The Dirty Dozen Payloads (Test Cases)
1. **Identity Spoofing**: Attempt to create a user profile with `role: 'admin'` as a student.
2. **Result Tampering**: A student attempting to update their own grade.
3. **Payment Injection**: Someone creating a 'paid' record for themselves without admin privilege.
4. **Admin Escalation**: A user updating their own profile to set `role: 'admin'`.
5. **PII Leak**: An unauthenticated user attempting to list all student emails.
6. **Shadow Update**: Adding a field `isHacker: true` to a payment record.
7. **Orphaned Result**: Creating a result for a `studentId` that doesn't exist in `/users`.
8. **Negative Payment**: Setting `amount: -1000` in a payment record.
9. **Spamming Announcements**: Unauthenticated user posting 100 announcements.
10. **ID Poisoning**: Using a 2KB string as a `userId`.
11. **Stale Update**: Updating a result without setting `updatedAt` to `request.time`.
12. **Blind List**: Authenticated student attempting to list ALL results of ALL students.

## Test Runner Plan
We will use `DRAFT_firestore.rules` until verified.
Rules will enforce `role` checks by looking up the authenticated user's document in `/users`.
