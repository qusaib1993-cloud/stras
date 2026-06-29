# Security Specification - Hekaya Khait Abayas (حكاية خيط)

This specification defines the security architecture, invariants, and threat models for the Hekaya Khait Abayas e-commerce application.

## 1. Data Invariants

1. **Order Creation Limits**: Orders can be submitted by anyone, but must start in a `'pending'` status with strict validation of customer details (Jordanian phone number, height, weight, selected offer, and address).
2. **Order ID Integrity**: Order IDs must be between 4 and 64 characters long and conform to the pattern `ORD-[0-9]+` or simple alphanumeric strings to prevent path variable poisoning.
3. **Price Invariants**: Total price must match the selected offer (14 JOD for 1 abaya, 22 JOD for 2 abayas).
4. **Immutability**: Once an order is created, its core fields (`id`, `date`, `name`, `phone`, `offer`, `color`, `weight`, `height`, `address`, `totalPrice`) cannot be mutated.
5. **Dashboard Access**: Updating order status (e.g. confirming, shipping, or cancelling) is restricted to authenticated administrators. Deletion of orders is strictly forbidden.

---

## 2. The "Dirty Dozen" Attack Payloads

### Payload 1: Creating an order with status 'confirmed' (State Shortcutting)
*   **Vector**: Skipping the pending phase.
*   **Payload**: `{ "id": "ORD-1234", "name": "Fatima", "phone": "0791234567", "offer": "14", "color": "black", "weight": 60, "height": 160, "address": "Amman", "date": "2026-06-29T00:00:00Z", "status": "confirmed", "totalPrice": 14 }`
*   **Result**: `PERMISSION_DENIED`

### Payload 2: Creating an order with a missing required field (Schema Bypass)
*   **Vector**: Missing `address` field.
*   **Payload**: `{ "id": "ORD-1234", "name": "Fatima", "phone": "0791234567", "offer": "14", "color": "black", "weight": 60, "height": 160, "date": "2026-06-29T00:00:00Z", "status": "pending", "totalPrice": 14 }`
*   **Result**: `PERMISSION_DENIED`

### Payload 3: Creating an order with a massive field or ghost fields (Denial of Wallet & Shadow Update)
*   **Vector**: Injecting `ghost_field` or huge strings.
*   **Payload**: `{ "id": "ORD-1234", "name": "Fatima", "phone": "0791234567", "offer": "14", "color": "black", "weight": 60, "height": 160, "address": "Amman", "date": "2026-06-29T00:00:00Z", "status": "pending", "totalPrice": 14, "ghost_field": "unauthorized_data" }`
*   **Result**: `PERMISSION_DENIED`

### Payload 4: Value Poisoning (Negative totalPrice)
*   **Vector**: Setting totalPrice to `-100`.
*   **Payload**: `{ "id": "ORD-1234", "name": "Fatima", "phone": "0791234567", "offer": "14", "color": "black", "weight": 60, "height": 160, "address": "Amman", "date": "2026-06-29T00:00:00Z", "status": "pending", "totalPrice": -100 }`
*   **Result**: `PERMISSION_DENIED`

### Payload 5: Type Mismatch (Weight as a boolean)
*   **Vector**: Submitting string or boolean for numerical fields.
*   **Payload**: `{ "id": "ORD-1234", "name": "Fatima", "phone": "0791234567", "offer": "14", "color": "black", "weight": true, "height": 160, "address": "Amman", "date": "2026-06-29T00:00:00Z", "status": "pending", "totalPrice": 14 }`
*   **Result**: `PERMISSION_DENIED`

### Payload 6: Mutating Immutable Fields (Updating customer details on existing order)
*   **Vector**: Unauthorized modification of custom details.
*   **Payload**: `{ "name": "New Name" }`
*   **Result**: `PERMISSION_DENIED`

### Payload 7: State Shortcutting (Setting order to random status)
*   **Vector**: Updating status to `'delivered'` or undefined states.
*   **Payload**: `{ "status": "delivered" }`
*   **Result**: `PERMISSION_DENIED`

### Payload 8: Destructive Action (Deleting an order)
*   **Vector**: Client deleting an order record from Firestore.
*   **Result**: `PERMISSION_DENIED`

### Payload 9: ID Poisoning (Injecting a 1MB non-alphanumeric document ID)
*   **Vector**: Path variable poisoning with custom symbols.
*   **Result**: `PERMISSION_DENIED`

### Payload 10: Query scraping (Scraping all orders without search parameters)
*   **Vector**: Reading the entire database without providing matching ID or phone search criteria.
*   **Result**: `PERMISSION_DENIED` (unless Admin)

### Payload 11: Empty phone or boundary limits bypass
*   **Vector**: Phone numbers less than 10 characters or out-of-bound heights.
*   **Payload**: `{ "id": "ORD-1234", "name": "Fatima", "phone": "123", "offer": "14", "color": "black", "weight": 60, "height": 500, "address": "Amman", "date": "2026-06-29T00:00:00Z", "status": "pending", "totalPrice": 14 }`
*   **Result**: `PERMISSION_DENIED`

### Payload 12: Injecting system fields / Admin claims
*   **Vector**: Setting `notes` or other fields arbitrarily on creation.
*   **Result**: `PERMISSION_DENIED`

---

## 3. Test Cases Configuration

The test suite will verify that:
1. Public can create a valid pending order.
2. Public can retrieve a single order if they provide its exact ID and matching phone.
3. Only authenticated admin users can list all orders or update order statuses.
